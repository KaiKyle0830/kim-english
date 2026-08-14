# -*- coding: utf-8 -*-
"""產生網站用的英文發音檔（微軟神經語音）。

網站原本用瀏覽器內建的語音（Web Speech API），品質依手機而定，
常常很機械。這支程式把所有會被唸到的英文（單字、例句、投影片上
可以點的句子）事先合成成 mp3 放進 audio/，網站優先播這些檔案，
每支手機聽起來都一樣。

用法：
    pip install edge-tts
    python3 gen/generate_audio.py            # 只補產生缺少的
    python3 gen/generate_audio.py --force    # 全部重做（換聲音時用）

換聲音：改下面的 VOICE，然後跑 --force。
可選聲音例：en-US-EmmaNeural / en-US-AvaNeural / en-US-AndrewNeural
"""

import argparse
import asyncio
import json
import os
import re
import sys

import edge_tts

VOICE = "en-US-EmmaNeural"   # 美式女聲，活潑親切
RATE = "-10%"                # 比正常說話略慢，聽得清楚
CONCURRENCY = 6              # 同時合成幾個（太高容易被伺服器擋）
TAIL_SILENCE = 0.25          # 說完後保留幾秒，避免尾音被切掉

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, "audio")
INDEX_JS = os.path.join(ROOT, "data", "audio.js")

# 例句格式是「English sentence. 中文翻譯。」，中文從第一個中文字或全形標點開始
_SPLIT_EX = re.compile(r"^(.*?)\s*([一-鿿，。！？].*)$", re.S)


def split_ex(ex):
    """把例句拆成 (英文, 中文)，和 js/app.js、data/slides.js 的做法一致。"""
    m = _SPLIT_EX.match(ex or "")
    return (m.group(1), m.group(2)) if m else (ex or "", "")


def normalize(text):
    return re.sub(r"\s+", " ", (text or "")).strip()


def key_of(text):
    """FNV-1a 32-bit（js/app.js 有一份一模一樣的實作）。"""
    h = 2166136261
    for b in normalize(text).encode("utf-8"):
        h = ((h ^ b) * 16777619) & 0xFFFFFFFF
    return format(h, "08x")


def read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return f.read()


def unescape_js(s):
    """把 JS 字串字面值裡的跳脫還原（資料檔只用得到 \\" 和 \\'）。"""
    return s.replace('\\"', '"').replace("\\'", "'").replace("\\\\", "\\")


def collect_texts():
    """收集網站上所有會被唸出來的英文。"""
    texts = []

    # 1) data/words.js：["英文","中文","詞性","例句（英＋中）"]
    #    data/school.js：同上再多一個 KK 音標
    entry = re.compile(
        r'\["((?:[^"\\]|\\.)*)","(?:[^"\\]|\\.)*","(?:[^"\\]|\\.)*","((?:[^"\\]|\\.)*)"'
    )
    for path in ("data/words.js", "data/school.js"):
        for en, ex in entry.findall(read(path)):
            texts.append(unescape_js(en))
            ex_en = split_ex(unescape_js(ex))[0]
            if ex_en:
                texts.append(ex_en)

    slides = read("data/slides.js")

    # 2) data/slides.js 裡寫死的 data-say（動態的那些含 ${...}，已由上面涵蓋）
    for m in re.finditer(r'data-(?:auto)?say="([^"${}]+)"', slides):
        texts.append(m.group(1))

    # 3) 課文對話：["說話者","English line","中文"]，英文裡可能有 <b> 標籤
    for m in re.finditer(
        r'\["[A-Za-z]+",\s*"((?:[^"\\]|\\.)*)",\s*"(?:[^"\\]|\\.)*"\]', slides
    ):
        line = re.sub(r"</?b>", "", unescape_js(m.group(1)))
        if re.search(r"[A-Za-z]", line):
            texts.append(line)

    seen, out = set(), []
    for t in texts:
        t = normalize(t)
        # 大小寫要分開（US 和 us 唸法不同），只濾掉空的和沒有英文字母的
        if t and re.search(r"[A-Za-z]", t) and t not in seen:
            seen.add(t)
            out.append(t)
    return out


# ---------- mp3 尾端靜音裁切 ----------
# edge-tts 固定輸出 MPEG-2 Layer III / 24kHz / 48kbps / mono，
# 每個 frame 是 576 個 sample（24 毫秒）、144 位元組（padding bit 為 1 時 145）。
FRAME_MS = 576 / 24000 * 1000


def trim_mp3(data, keep_seconds):
    """只保留前 keep_seconds 秒的完整 frame；解析不了就原樣回傳。"""
    i = 0
    if data[:3] == b"ID3":  # 跳過 ID3v2 標頭
        size = 0
        for b in data[6:10]:
            size = (size << 7) | (b & 0x7F)
        i = 10 + size
    keep_ms, elapsed = keep_seconds * 1000, 0.0
    while i + 4 <= len(data):
        if data[i] != 0xFF or (data[i + 1] & 0xE0) != 0xE0:
            return data  # 不是預期的格式，別亂剪
        frame = 144 + ((data[i + 2] >> 1) & 1)
        if elapsed >= keep_ms:
            return data[:i]
        elapsed += FRAME_MS
        i += frame
    return data


async def synth(text, path):
    audio, end_100ns = bytearray(), 0
    async for chunk in edge_tts.Communicate(text, VOICE, rate=RATE).stream():
        if chunk["type"] == "audio":
            audio += chunk["data"]
        elif chunk["type"] in ("WordBoundary", "SentenceBoundary"):
            # 不同聲音給的邊界事件不一樣（Emma 只給 SentenceBoundary），兩種都收
            end_100ns = max(end_100ns, chunk["offset"] + chunk["duration"])
    if not audio:
        raise RuntimeError("沒有收到音訊：%r" % text)
    out = bytes(audio)
    if end_100ns:  # 切掉句尾多餘的靜音，檔案小一半以上
        out = trim_mp3(out, end_100ns / 1e7 + TAIL_SILENCE)
    with open(path, "wb") as f:
        f.write(out)
    return len(out)


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="已存在的也重新產生")
    args = ap.parse_args()

    texts = collect_texts()
    os.makedirs(AUDIO_DIR, exist_ok=True)
    keys = {}
    for t in texts:
        keys.setdefault(key_of(t), t)
    if len(keys) != len(texts):
        print("警告：有 %d 筆的 key 撞在一起" % (len(texts) - len(keys)), file=sys.stderr)

    todo = [
        (k, t)
        for k, t in keys.items()
        if args.force or not os.path.exists(os.path.join(AUDIO_DIR, k + ".mp3"))
    ]
    print("共 %d 句，需要產生 %d 個檔案，聲音 %s（%s）" % (len(keys), len(todo), VOICE, RATE))

    done, total_bytes, failed = 0, 0, []
    sem = asyncio.Semaphore(CONCURRENCY)

    async def one(k, t):
        nonlocal done, total_bytes
        async with sem:
            for attempt in range(3):
                try:
                    # 先 await 拿到結果再累加，不然 += 跨越 await 會漏算
                    n = await synth(t, os.path.join(AUDIO_DIR, k + ".mp3"))
                    total_bytes += n
                    break
                except Exception as e:  # 網路偶爾會斷，退避後重試
                    if attempt == 2:
                        failed.append((k, t, repr(e)))
                    else:
                        await asyncio.sleep(2 ** attempt)
            done += 1
            if done % 100 == 0 or done == len(todo):
                print("  %d/%d" % (done, len(todo)), flush=True)

    await asyncio.gather(*(one(k, t) for k, t in todo))

    for k, t, e in failed:
        print("失敗：%s %r %s" % (k, t, e), file=sys.stderr)
    if todo:
        print("新產生 %.1f MB" % (total_bytes / 1048576))

    # 索引：網站用它判斷某句有沒有現成的音檔，沒有才退回瀏覽器內建語音。
    # 每個 key 固定 8 個字元，接成一整串比 JSON 陣列小很多。
    ok = sorted(k for k in keys if os.path.exists(os.path.join(AUDIO_DIR, k + ".mp3")))
    with open(INDEX_JS, "w", encoding="utf-8") as f:
        f.write("// 由 gen/generate_audio.py 自動產生，請勿手動修改\n")
        f.write("// 聲音：%s（語速 %s），共 %d 句\n" % (VOICE, RATE, len(ok)))
        f.write("window.AUDIO_KEYS=%s;\n" % json.dumps("".join(ok)))
    print("索引已寫入 data/audio.js（%d 句）" % len(ok))


if __name__ == "__main__":
    asyncio.run(main())

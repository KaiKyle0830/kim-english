# -*- coding: utf-8 -*-
"""為 8 個文法單元各產生 300 題選擇題，輸出 data/grammar/unitN.js"""
import json, random, itertools, os

random.seed(20260809)
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "grammar")

# ---------- 共用資料 ----------
SUBJ_I   = ["I"]
SUBJ_S3  = ["He", "She", "It", "Tom", "Mary", "Kin", "My father", "His sister",
            "The dog", "That boy", "Our teacher", "The baby", "Mr. Wang", "My best friend",
            "The cat", "This girl", "Her brother", "Amy", "David", "The old man"]
SUBJ_PL  = ["We", "They", "You", "Tom and Mary", "The students", "My parents",
            "Her sisters", "The dogs", "Those boys", "The children", "Kin and I",
            "The girls", "My classmates", "These people"]

ADJS = ["happy", "tall", "hungry", "tired", "busy", "cute", "smart", "angry",
        "late", "kind", "shy", "lazy", "thirsty", "nervous", "lucky", "famous",
        "young", "old", "strong", "quiet"]
NOUN_S = ["a student", "a teacher", "a doctor", "a nurse", "a cook", "a singer",
          "my friend", "an engineer", "a police officer", "a farmer"]
NOUN_P = ["students", "teachers", "doctors", "good friends", "singers", "farmers",
          "nurses", "cooks"]
PLACES = ["at home", "at school", "in the classroom", "in the park", "in Taipei",
          "in the kitchen", "at the door", "in the library"]

def third(v):
    irr = {"have": "has", "do": "does", "go": "goes"}
    if v in irr: return irr[v]
    if v.endswith(("ch", "sh", "s", "x", "o")): return v + "es"
    if v.endswith("y") and v[-2] not in "aeiou": return v[:-2+1][:-1] + "ies" if False else v[:-1] + "ies"
    return v + "s"

def ving(v):
    spec = {"run":"running","swim":"swimming","sit":"sitting","get":"getting","put":"putting",
            "stop":"stopping","shop":"shopping","cut":"cutting","begin":"beginning","jog":"jogging"}
    if v in spec: return spec[v]
    if v.endswith("ie"): return v[:-2] + "ying"
    if v.endswith("e") and v != "be": return v[:-1] + "ing"
    return v + "ing"

PAST_IRR = {"go":"went","eat":"ate","have":"had","see":"saw","buy":"bought","come":"came",
            "take":"took","get":"got","make":"made","write":"wrote","read":"read","run":"ran",
            "swim":"swam","drink":"drank","give":"gave","sing":"sang","teach":"taught",
            "think":"thought","find":"found","tell":"told","say":"said","do":"did","sit":"sat",
            "sleep":"slept","wear":"wore","win":"won","lose":"lost","ride":"rode","drive":"drove",
            "fly":"flew","meet":"met","speak":"spoke","catch":"caught","hear":"heard","send":"sent"}
def past(v):
    if v in PAST_IRR: return PAST_IRR[v]
    if v.endswith("e"): return v + "d"
    if v.endswith("y") and v[-2] not in "aeiou": return v[:-1] + "ied"
    spec = {"stop":"stopped","shop":"shopped","plan":"planned","jog":"jogged","hug":"hugged"}
    if v in spec: return spec[v]
    return v + "ed"

VP = [("play basketball","play"),("watch TV","watch"),("study English","study"),
      ("go to school","go"),("eat breakfast","eat"),("read comic books","read"),
      ("listen to music","listen"),("do homework","do"),("play the piano","play"),
      ("clean the room","clean"),("wash the dishes","wash"),("drink milk","drink"),
      ("walk to school","walk"),("ride a bike","ride"),("cook dinner","cook"),
      ("sing songs","sing"),("swim","swim"),("run in the park","run"),
      ("write letters","write"),("take a walk","take"),("visit their grandma","visit"),
      ("draw pictures","draw"),("speak English","speak"),("teach math","teach")]

def person_exp(s):
    if s == "I": return "主詞是 I（第一人稱單數）"
    if s in ("He","She","It") or s in SUBJ_S3: return f"主詞 {s} 是第三人稱單數"
    if s == "You": return "主詞 You（你/你們）"
    return f"主詞 {s} 是複數"

def mk(q, correct, wrongs, exp):
    """組一題：選項洗牌、記答案 index"""
    opts = [correct] + [w for w in dict.fromkeys(wrongs) if w != correct][:3]
    if len(opts) < 4: return None
    random.shuffle(opts)
    return {"q": q, "opts": opts, "a": opts.index(correct), "exp": exp}

def finish(unit_id, title, pool, n=300):
    seen, bank = set(), []
    random.shuffle(pool)
    for item in pool:
        if item is None: continue
        if item["q"] in seen: continue
        seen.add(item["q"])
        bank.append(item)
        if len(bank) >= n: break
    assert len(bank) >= n, f"{unit_id} 只有 {len(bank)} 題"
    path = os.path.join(OUT, f"{unit_id}.js")
    with open(path, "w", encoding="utf-8") as f:
        f.write("window.GRAMMAR_BANKS = window.GRAMMAR_BANKS || {};\n")
        f.write(f'window.GRAMMAR_BANKS["{unit_id}"] = ')
        json.dump(bank, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    print(unit_id, title, len(bank), "題 ->", os.path.relpath(path))

# ---------- Unit 1：be 動詞 ----------
def unit1():
    pool = []
    def be_of(s):
        if s == "I": return "am"
        if s in SUBJ_PL or s == "You": return "are"
        return "is"
    comps = ADJS + NOUN_S + PLACES
    comps_pl = ADJS + NOUN_P + PLACES
    for s in SUBJ_I + SUBJ_S3 + SUBJ_PL:
        cs = comps_pl if (s in SUBJ_PL or s == "You") else comps
        for c in random.sample(cs, 8):
            be = be_of(s)
            pool.append(mk(f"{s} ___ {c}.", be,
                           ["am","is","are","be"],
                           f"{person_exp(s)}，be 動詞用 {be}。"))
    # 否定
    for s in random.sample(SUBJ_S3, 10) + random.sample(SUBJ_PL, 8) + ["I"]:
        be = be_of(s)
        neg = {"am":"am not","is":"isn't","are":"aren't"}[be]
        c = random.choice(ADJS + (NOUN_P if s in SUBJ_PL or s=="You" else NOUN_S))
        pool.append(mk(f"{s} ___ {c}. (否定句)", neg,
                       ["am not","isn't","aren't","not"],
                       f"{person_exp(s)}，否定用「{be} not」，縮寫為 {neg}。" if be!="am" else
                       "I 的否定是 am not（沒有 amn't 這種縮寫）。"))
    # 疑問句
    for s in ["you","he","she","they","it","we","your brother","his sister","the students","Tom","Mary","the dog","your parents","that girl"]:
        s3 = s in ("he","she","it","your brother","his sister","Tom","Mary","the dog","that girl")
        be = "Is" if s3 else "Are"
        c = random.choice(ADJS + (NOUN_S if s3 else NOUN_P))
        pool.append(mk(f"___ {s} {c}?", be,
                       ["Am","Is","Are","Be"],
                       f"疑問句把 be 動詞移到句首；{s} 是{'第三人稱單數' if s3 else '複數（或 you）'}，用 {be}。"))
    # There is / are
    for n1, isare in [("a book","is"),("a cat","is"),("an apple","is"),("some water","is"),
                      ("two dogs","are"),("many students","are"),("some birds","are"),("five people","are")]:
        for pl in random.sample(PLACES, 4):
            pool.append(mk(f"There ___ {n1} {pl}.", isare,
                           ["is","are","am","be"],
                           f"There is/are 依後面的名詞決定：{n1} 是{'單數或不可數' if isare=='is' else '複數'}，用 {isare}。"))
    finish("u1", "be動詞", pool)

# ---------- Unit 2：現在簡單式 ----------
def unit2():
    pool = []
    times = ["every day", "every morning", "on weekends", "after school", "every night", "on Sundays"]
    for s in SUBJ_I + SUBJ_S3 + SUBJ_PL:
        s3 = s not in SUBJ_PL and s not in ("I", "You")
        for phrase, v in random.sample(VP, 7):
            t = random.choice(times)
            rest = phrase[len(v):].strip()
            correct = third(v) if s3 else v
            wrongs = [v if s3 else third(v), ving(v), "to " + v]
            pool.append(mk(f"{s} ___ {rest} {t}.".replace("  ", " ") if rest else f"{s} ___ {t}.",
                           correct, wrongs,
                           (f"{person_exp(s)}，現在簡單式動詞要加 s/es：{correct}。" if s3
                            else f"{person_exp(s)}，現在簡單式動詞用原形 {v}。")))
    # 否定
    for s in random.sample(SUBJ_S3, 12) + random.sample(SUBJ_PL, 8) + ["I"]:
        s3 = s in SUBJ_S3
        phrase, v = random.choice(VP)
        correct = "doesn't" if s3 else "don't"
        pool.append(mk(f"{s} ___ {phrase}.", correct,
                       ["don't","doesn't","isn't","aren't"],
                       f"{person_exp(s)}，一般動詞否定用 {correct} + 原形動詞。"))
    # 疑問
    for s in ["you","he","she","they","your brother","his sister","Tom","the students","Mary","your parents","we","the dog","Mr. Wang","those boys"]:
        s3 = s in ("he","she","your brother","his sister","Tom","Mary","the dog","Mr. Wang")
        phrase, v = random.choice(VP)
        correct = "Does" if s3 else "Do"
        pool.append(mk(f"___ {s} {phrase}?", correct,
                       ["Do","Does","Is","Are"],
                       f"一般動詞的疑問句用 Do/Does 開頭；{s} 是{'第三人稱單數，用 Does' if s3 else '複數（或 you/we），用 Do'}，後面動詞保持原形。"))
    # do/does 之後用原形
    for s, aux in [("he","Does"),("she","Does"),("your father","Does"),("Tom","Does"),
                   ("they","Do"),("you","Do"),("the students","Do"),("we","Do")]:
        for phrase, v in random.sample(VP, 5):
            rest = phrase[len(v):].strip()
            q = f"{aux} {s} ___ {rest}?".replace(" ?", "?") if rest else f"{aux} {s} ___?"
            pool.append(mk(q, v, [third(v), ving(v), past(v)],
                           f"助動詞 {aux} 已經表示時態，後面的動詞一律用原形 {v}。"))
    finish("u2", "現在簡單式", pool)

# ---------- Unit 3：現在進行式 ----------
def unit3():
    pool = []
    marks = ["now", "right now", "at the moment"]
    def be_of(s):
        if s == "I": return "am"
        if s in SUBJ_PL or s == "You": return "are"
        return "is"
    # be 的選擇
    for s in SUBJ_I + SUBJ_S3 + SUBJ_PL:
        for phrase, v in random.sample(VP, 6):
            rest = phrase[len(v):].strip()
            be = be_of(s)
            pool.append(mk(f"{s} ___ {ving(v)} {rest} now.".replace("  "," "),
                           be, ["am","is","are","be"],
                           f"現在進行式 = be + V-ing；{person_exp(s)}，be 動詞用 {be}。"))
    # V-ing 拼法
    for v in ["run","swim","sit","get","stop","shop","cut","write","make","dance",
              "take","come","ride","give","have","eat","read","play","study","sing",
              "sleep","draw","drink","fly","cook","watch","clean","jog","drive","smile"]:
        for s in random.sample(SUBJ_S3, 4):
            wrong1 = v + "ing" if ving(v) != v + "ing" else v[:-1] + "ing"
            pool.append(mk(f"Look! {s} is ___ .", ving(v),
                           [wrong1, third(v), past(v)],
                           f"{v} 的現在分詞是 {ving(v)}。" +
                           ("（重複字尾再加 ing）" if ving(v) not in (v+"ing",) and not v.endswith("e") else
                            "（去 e 加 ing）" if v.endswith("e") else "")))
    # 簡單式 vs 進行式（時間標記）
    for s in SUBJ_S3:
        for phrase, v in random.sample(VP, 4):
            rest = phrase[len(v):].strip()
            m = random.choice(marks)
            pool.append(mk(f"{s} ___ {rest} {m}.".replace("  "," "),
                           f"is {ving(v)}",
                           [third(v), f"are {ving(v)}", v],
                           f"句尾有 {m}（現在正在），要用現在進行式 is + V-ing。"))
    for s in SUBJ_PL:
        for phrase, v in random.sample(VP, 3):
            rest = phrase[len(v):].strip()
            pool.append(mk(f"Listen! {s} ___ {rest}.".replace("  "," "),
                           f"are {ving(v)}",
                           [v, f"is {ving(v)}", third(v)],
                           f"Listen!（聽！）表示動作正在發生，用現在進行式 are + V-ing。"))
    # 疑問與否定
    for s in ["you","he","she","they","the baby","your mother","the boys","Tom"]:
        s3 = s in ("he","she","the baby","your mother","Tom")
        for phrase, v in random.sample(VP, 4):
            be = "Is" if s3 else "Are"
            pool.append(mk(f"___ {s} {ving(v)} {phrase[len(v):].strip()} now?".replace("  "," "),
                           be, ["Am","Is","Are","Do"],
                           f"現在進行式疑問句把 be 動詞移到句首；{s} 用 {be}。"))
    for s in SUBJ_S3 + SUBJ_PL:
        s3 = s in SUBJ_S3
        for phrase, v in random.sample(VP, 3):
            correct = "isn't" if s3 else "aren't"
            pool.append(mk(f"{s} ___ {ving(v)} {phrase[len(v):].strip()} now. (否定句)".replace("  "," "),
                           correct, ["isn't","aren't","doesn't","don't"],
                           f"現在進行式否定在 be 動詞後加 not；{person_exp(s)}，用 {correct}。"))
    finish("u3", "現在進行式", pool)

# ---------- Unit 4：過去式 ----------
def unit4():
    pool = []
    pasts = ["yesterday", "last night", "last week", "last Sunday", "two days ago", "this morning", "an hour ago"]
    # was / were
    for s in SUBJ_I + SUBJ_S3 + SUBJ_PL:
        be = "were" if (s in SUBJ_PL or s == "You") else "was"
        c = random.choice(ADJS + PLACES)
        t = random.choice(pasts)
        pool.append(mk(f"{s} ___ {c} {t}.", be,
                       ["was","were","is","are"],
                       f"句尾 {t} 表示過去；{person_exp(s)}，過去式 be 動詞用 {be}。"))
    # 動詞過去式（規則＋不規則）
    verbs = ["go","eat","see","buy","come","take","get","make","write","run","swim",
             "drink","give","sing","teach","think","find","tell","do","sit","sleep",
             "wear","win","lose","ride","drive","fly","meet","speak","catch","hear",
             "play","watch","study","clean","wash","walk","cook","visit","stop","plan",
             "listen","talk","help","open","close","live","work","dance","cry","try"]
    for v in verbs:
      for s in random.sample(SUBJ_I + SUBJ_S3 + SUBJ_PL, 3):
        t = random.choice(pasts)
        obj = {"go":"to the park","eat":"a big dinner","see":"a movie","buy":"a new bag",
               "take":"a bus","make":"a cake","write":"a letter","drink":"some juice",
               "teach":"English","tell":"a story","wear":"a blue shirt","ride":"a bike",
               "meet":"an old friend","speak":"to the teacher","catch":"a fish",
               "hear":"a strange sound","play":"basketball","watch":"TV","study":"math",
               "clean":"the room","wash":"the car","cook":"dinner","visit":"their uncle",
               "help":"her mother","open":"the window","close":"the door",
               "listen":"to music","talk":"to a friend","work":"hard","live":"in Tainan",
               "dance":"happily","cry":"loudly","try":"again","walk":"to school",
               "run":"in the park","swim":"in the pool","fly":"to Japan","sing":"a song",
               "sleep":"for ten hours","sit":"on the sofa","stop":"the car","plan":"a trip",
               "win":"the game","lose":"the game","drive":"to work","get":"a nice gift",
               "come":"home","do":"the dishes","think":"about the question","find":"the key",
               "give":"me a hand","send":"a card"}.get(v, "")
        q = f"{s} ___ {obj} {t}.".replace("  ", " ")
        p = past(v)
        wrongs = [v, third(v), ving(v)]
        note = ("不規則變化" if v in PAST_IRR else "規則變化，字尾加 ed")
        pool.append(mk(q, p, wrongs, f"{t} 表示過去，用過去式；{v} 的過去式是 {p}（{note}）。"))
    # didn't + 原形
    for s in SUBJ_I + SUBJ_S3 + SUBJ_PL:
        for phrase, v in random.sample(VP, 3):
            rest = phrase[len(v):].strip()
            t = random.choice(pasts)
            q = f"{s} didn't ___ {rest} {t}.".replace("  ", " ")
            pool.append(mk(q, v, [past(v), third(v), ving(v)],
                           f"didn't 已表示過去，後面動詞用原形 {v}。"))
    # Did 疑問句
    for s in ["you","he","she","they","your brother","Tom","Mary","the students"]:
        for phrase, v in random.sample(VP, 5):
            t = random.choice(pasts)
            pool.append(mk(f"___ {s} {phrase} {t}?", "Did",
                           ["Do","Does","Was"],
                           "過去式的一般動詞疑問句用 Did 開頭，動詞用原形。"))
    # was/were 否定
    for s in SUBJ_S3 + SUBJ_PL:
        neg = "weren't" if s in SUBJ_PL else "wasn't"
        pl = random.choice(PLACES)
        pool.append(mk(f"{s} ___ {pl} last night. (否定句)", neg,
                       ["wasn't","weren't","isn't","didn't"],
                       f"{person_exp(s)}，過去式 be 動詞否定用 {neg}。"))
    finish("u4", "過去式", pool)

# ---------- Unit 5：未來式 ----------
def unit5():
    pool = []
    futs = ["tomorrow", "next week", "next Sunday", "tonight", "next month", "this weekend", "next year"]
    # will + 原形
    for s in SUBJ_I + SUBJ_S3 + SUBJ_PL:
        for phrase, v in random.sample(VP, 4):
            rest = phrase[len(v):].strip()
            t = random.choice(futs)
            q = f"{s} will ___ {rest} {t}.".replace("  ", " ")
            pool.append(mk(q, v, [third(v), past(v), ving(v)],
                           f"will 之後動詞一律用原形 {v}。"))
    # be going to 的 be
    for s in SUBJ_I + SUBJ_S3 + SUBJ_PL:
        for phrase, v in random.sample(VP, 3):
            be = "am" if s == "I" else ("are" if (s in SUBJ_PL or s == "You") else "is")
            t = random.choice(futs)
            pool.append(mk(f"{s} ___ going to {phrase} {t}.", be,
                           ["am","is","are","will"],
                           f"be going to 的 be 要隨主詞變化；{person_exp(s)}，用 {be}。"))
    # going to 之後用原形
    for s in SUBJ_S3 + SUBJ_PL:
        for phrase, v in random.sample(VP, 3):
            be = "are" if s in SUBJ_PL else "is"
            rest = phrase[len(v):].strip()
            t = random.choice(futs)
            q = f"{s} {be} going to ___ {rest} {t}.".replace("  ", " ")
            pool.append(mk(q, v, [third(v), past(v), ving(v)],
                           f"be going to 之後接原形動詞 {v}。"))
    # won't / 否定
    for s in SUBJ_I + SUBJ_S3 + SUBJ_PL:
        for phrase, v in random.sample(VP, 2):
            t = random.choice(futs)
            pool.append(mk(f"{s} ___ {phrase} {t}. (否定句)", "won't",
                           ["won't","don't","didn't","isn't"],
                           "will 的否定是 will not，縮寫 won't，後接原形動詞。"))
    # Will 疑問句
    for s in ["you","he","she","they","your family","Tom","it"]:
        for phrase, v in random.sample(VP, 5):
            t = random.choice(futs)
            pool.append(mk(f"___ {s} {phrase} {t}?", "Will",
                           ["Do","Does","Are"],
                           "未來式疑問句把 Will 放句首，動詞用原形。"))
    # 時間詞判斷：will vs 過去
    for s in SUBJ_S3:
        for phrase, v in random.sample(VP, 3):
            rest = phrase[len(v):].strip()
            t = random.choice(futs)
            q = f"{s} ___ {rest} {t}.".replace("  ", " ")
            pool.append(mk(q, f"will {v}", [third(v), past(v), f"is {ving(v)}"],
                           f"句尾 {t} 是未來時間，要用 will + 原形動詞。"))
    finish("u5", "未來式", pool)

# ---------- Unit 6：助動詞 ----------
def unit6():
    pool = []
    modals = ["can", "may", "must", "should", "could"]
    # 助動詞後用原形
    for m in modals:
        for phrase, v in VP:
            for s in random.sample(SUBJ_I + SUBJ_S3 + SUBJ_PL, 2):
                rest = phrase[len(v):].strip()
                q = f"{s} {m} ___ {rest}.".replace("  ", " ")
                pool.append(mk(q, v, [third(v), past(v), ving(v)],
                               f"助動詞 {m} 之後的動詞一律用原形 {v}。"))
    # can 的否定
    for s in SUBJ_I + SUBJ_S3 + SUBJ_PL:
        for phrase, v in random.sample(VP, 2):
            pool.append(mk(f"{s} ___ {phrase}. (否定：不會)", "can't",
                           ["don't","isn't","not can"],
                           "can 的否定是 cannot / can't，直接加在 can 後面。"))
    # 疑問句
    for s in ["you","he","she","they","your sister","Tom"]:
        for phrase, v in random.sample(VP, 4):
            m = random.choice(["Can","May","Should"])
            pool.append(mk(f"___ {s} {phrase}? ({'能力' if m=='Can' else '請求允許' if m=='May' else '建議'})", m,
                           ["Do","Does","Is"],
                           f"助動詞疑問句把 {m} 放句首，主詞後面接原形動詞。"))
    # could（過去能力）
    for s in SUBJ_S3:
        act = random.choice(["swim","ride a bike","read","write his name","speak English","play the piano","count to 100"])
        pool.append(mk(f"{s} ___ {act} when {'she' if s in ('She','Mary','Amy','Kin','His sister','This girl') else 'he'} was five.",
                       "could", ["can","must","should"],
                       "when ... was five 表示過去，能力的過去式用 could。"))
    # have to
    for s in SUBJ_S3 + SUBJ_PL + ["I"]:
        ht = "has" if s in SUBJ_S3 else "have"
        for act in random.sample(["get up early","wear a uniform","finish the homework","go home now","clean the room","take out the trash"], 2):
            pool.append(mk(f"{s} ___ to {act}.", ht,
                           ["have" if ht=="has" else "has","must","should"],
                           f"「___ to + 原形」是 have to 句型；{person_exp(s)}，用 {ht} to。（must 後面不加 to）"))
    # 語意選擇（線索明確）
    sense = [
        ("___ I use your phone? (禮貌地請求)", "May", ["Must","Should","Will"], "請求別人允許用 May I...? 最有禮貌。"),
        ("___ I borrow your pen? (禮貌地請求)", "May", ["Must","Should","Will"], "請求別人允許用 May I...? 最有禮貌。"),
        ("You look tired. You ___ go to bed early. (給建議)", "should", ["can","may","will"], "給別人建議用 should（應該）。"),
        ("It's cold outside. You ___ wear a coat. (給建議)", "should", ["can","may","will"], "給別人建議用 should（應該）。"),
        ("Birds ___ fly, but I can't. (能力)", "can", ["must","should","may"], "表示能力（會…）用 can。"),
        ("Fish ___ swim, but they can't walk. (能力)", "can", ["must","should","may"], "表示能力（會…）用 can。"),
        ("It's a school rule. Students ___ wear uniforms. (規定必須)", "must", ["can","may","could"], "規定、必須要做的事用 must。"),
        ("The test starts at 8:00. We ___ be there on time. (必須)", "must", ["can","may","could"], "必須要做的事用 must。"),
        ("Don't worry. It ___ rain later, so bring an umbrella just in case. (可能)", "may", ["must","should","can't"], "表示「可能會」用 may。"),
        ("The light is red. You ___ cross the road. (禁止)", "mustn't", ["shouldn't","don't","can"], "紅燈禁止通行，「絕對不可以」用 mustn't。"),
        ("You ___ swim here. It's dangerous. (禁止)", "mustn't", ["shouldn't","don't","can"], "危險禁止的事用 mustn't（絕對不可以）。"),
    ]
    for q, c, w, e in sense:
        pool.append(mk(q, c, w, e))
    finish("u6", "助動詞", pool)

# ---------- Unit 7：比較級與最高級 ----------
def unit7():
    pool = []
    # (原級, 比較級, 最高級, 誤選)
    ADJC = [("tall","taller","tallest"),("short","shorter","shortest"),("old","older","oldest"),
            ("young","younger","youngest"),("fast","faster","fastest"),("slow","slower","slowest"),
            ("cheap","cheaper","cheapest"),("small","smaller","smallest"),("cold","colder","coldest"),
            ("strong","stronger","strongest"),("big","bigger","biggest"),("hot","hotter","hottest"),
            ("thin","thinner","thinnest"),("fat","fatter","fattest"),("happy","happier","happiest"),
            ("easy","easier","easiest"),("heavy","heavier","heaviest"),("busy","busier","busiest"),
            ("early","earlier","earliest"),("pretty","prettier","prettiest"),
            ("beautiful","more beautiful","most beautiful"),("important","more important","most important"),
            ("interesting","more interesting","most interesting"),("expensive","more expensive","most expensive"),
            ("popular","more popular","most popular"),("difficult","more difficult","most difficult"),
            ("famous","more famous","most famous"),("useful","more useful","most useful"),
            ("good","better","best"),("bad","worse","worst"),("many","more","most")]
    pairs = [("Tom","his brother"),("Mary","her sister"),("This book","that one"),
             ("My bag","yours"),("The MRT","the bus"),("Summer","spring"),
             ("This question","the last one"),("Her hair","mine"),("The red car","the blue one"),
             ("Kin","his classmate")]
    groups = ["in his class","in her family","of the three","in our school","in Taiwan","of all","on the team","in the world"]
    for base, cmp_, sup in ADJC:
      for rep in range(4):
        a, b = random.choice(pairs)
        note = ("不規則變化" if base in ("good","bad","many") else
                "多音節形容詞用 more + 原級" if cmp_.startswith("more") else
                "重複字尾再加 er" if base in ("big","hot","thin","fat") else
                "y 結尾改 ier" if base.endswith("y") else "字尾加 er")
        wrong_cmp = (base + "er") if cmp_.startswith("more") else ("more " + base)
        pool.append(mk(f"{a} is ___ ({base}) than {b}.", cmp_,
                       [base, sup, wrong_cmp],
                       f"有 than（比）要用比較級；{base} 的比較級是 {cmp_}（{note}）。"))
        g = random.choice(groups)
        s = random.choice(["Tom","Mary","This one","That building","Kin","My father","This movie"])
        wrong_sup = (base + "est") if sup.startswith("most") else ("most " + base)
        pool.append(mk(f"{s} is the ___ ({base}) {g}.", sup,
                       [base, cmp_, wrong_sup],
                       f"「the ___ + in/of 範圍」用最高級；{base} 的最高級是 {sup}。"))
    # as ... as（提示用比較級，答案是原級）
    for base, cmp_, sup in ADJC:
        a, b = random.choice(pairs)
        pool.append(mk(f"{a} is as ___ as {b}. (提示：{base} 的正確形式)", base,
                       [cmp_, sup, "the " + sup],
                       f"as ... as（一樣…）中間放形容詞原級 {base}。"))
    # 比較級 + than 的 than
    for base, cmp_, sup in ADJC:
        a, b = random.choice(pairs)
        pool.append(mk(f"{a} is {cmp_} ___ {b}.", "than",
                       ["then","as","of"],
                       "比較級後面接 than（比）；注意不要拼成 then（然後）。"))
    # 最高級前的 the
    for base, cmp_, sup in ADJC:
        g = random.choice(groups)
        s = random.choice(["Tom","This one","Mary","That mountain"])
        pool.append(mk(f"{s} is ___ {sup} {g}.", "the",
                       ["a","an","than"],
                       "最高級前面要加 the。"))
    finish("u7", "比較級與最高級", pool)

# ---------- Unit 8：疑問詞 ----------
def unit8():
    pool = []
    QA = [
        ("Who", "is that tall girl", "She is my sister.", "問「人」用 Who。"),
        ("Who", "teaches you English", "Mr. Lin does.", "問「人」用 Who。"),
        ("Who", "is your favorite singer", "Jay Chou.", "問「人」用 Who。"),
        ("What", "is your name", "My name is Kin.", "問「什麼」用 What。"),
        ("What", "time is it", "It's ten o'clock.", "What time 問「幾點」。"),
        ("What", "day is today", "It's Friday.", "What day 問「星期幾」。"),
        ("What", "color do you like", "I like blue.", "What color 問「顏色」。"),
        ("What", "do you do after school", "I play basketball.", "問「做什麼事」用 What。"),
        ("Where", "is my schoolbag", "It's under the desk.", "問「地點」用 Where。"),
        ("Where", "do you live", "I live in Taipei.", "問「地點」用 Where。"),
        ("Where", "are you going", "To the library.", "問「地點」用 Where。"),
        ("When", "is your birthday", "It's on May fifth.", "問「時間/日期」用 When。"),
        ("When", "do you get up", "At six thirty.", "問「時間」用 When。"),
        ("When", "does the movie start", "At eight tonight.", "問「時間」用 When。"),
        ("Why", "are you late", "Because I missed the bus.", "回答有 Because，問句用 Why（為什麼）。"),
        ("Why", "do you like summer", "Because I can swim.", "回答有 Because，問句用 Why（為什麼）。"),
        ("Why", "is she crying", "Because she lost her wallet.", "回答有 Because，問句用 Why（為什麼）。"),
        ("How", "do you go to school", "By bus.", "問「方法/交通方式」用 How，回答常用 By...。"),
        ("How", "is the weather today", "It's sunny.", "問「天氣/狀況」用 How。"),
        ("How", "does your grandma feel today", "Much better.", "問「感覺/狀況」用 How。"),
        ("Which", "one do you want, the red one or the blue one", "The red one.", "在範圍內選一個用 Which。"),
        ("Which", "season do you like best, summer or winter", "Summer.", "在選項中挑選用 Which。"),
        ("Whose", "jacket is this", "It's Mary's.", "問「誰的（所有物）」用 Whose。"),
        ("Whose", "shoes are these", "They are Tom's.", "問「誰的（所有物）」用 Whose。"),
    ]
    whs = ["What","Who","Where","When","Why","How","Which","Whose"]
    for wh, body, ans, exp in QA:
        wr = random.sample([w for w in whs if w != wh], 3)
        pool.append(mk(f"___ {body}? — {ans}", wh, wr, exp))
    # How many / How much / How old / How long / How often
    HOWS = [
        ("How many", "brothers do you have", "Two.", "問「可數名詞數量」用 How many。"),
        ("How many", "students are there in your class", "Thirty.", "問「可數名詞數量」用 How many。"),
        ("How much", "is this watch", "It's five hundred dollars.", "問「價錢」用 How much。"),
        ("How much", "water do you drink every day", "About two bottles.", "問「不可數名詞數量」用 How much。"),
        ("How old", "is your brother", "He is ten.", "問「年齡」用 How old。"),
        ("How long", "is the movie", "About two hours.", "問「多久/多長」用 How long。"),
        ("How often", "do you exercise", "Three times a week.", "問「頻率（多常）」用 How often，回答常是 ... times a week。"),
        ("How tall", "is your father", "About 180 centimeters.", "問「身高」用 How tall。"),
    ]
    hs = [h[0] for h in HOWS]
    for h, body, ans, exp in HOWS:
        wr = random.sample([x for x in hs if x != h], 3)
        pool.append(mk(f"___ {body}? — {ans}", h, wr, exp))
    # 疑問詞 + do/does/is/are 搭配（全組合）
    for wh in ["What time","Where","When","Why","How often"]:
        for s, aux in [("you","do"),("he","does"),("she","does"),("they","do"),
                       ("your brother","does"),("your parents","do"),("Tom","does"),
                       ("your sister","does"),("the students","do")]:
            for act in ["go to school","get up","do your homework","play basketball",
                        "study English","eat breakfast","watch TV","clean the room"]:
                act2 = act.replace("your", "his" if aux == "does" and s not in ("she","your sister") else ("her" if s in ("she","your sister") else "their")) if s != "you" else act
                pool.append(mk(f"{wh} ___ {s} {act2}?", aux,
                               ["do" if aux=="does" else "does","is","are"],
                               f"疑問詞後面接助動詞；{s} 是{'第三人稱單數，用 does' if aux=='does' else '複數（或 you），用 do'}，後面動詞用原形。"))
    finish("u8", "疑問詞", pool)

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    unit1(); unit2(); unit3(); unit4(); unit5(); unit6(); unit7(); unit8()
    print("全部完成")

// 共用工具
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];

// ---------- localStorage ----------
const STORE_KEY = "kimEnglish";
function loadStore(){
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveStore(st){ localStorage.setItem(STORE_KEY, JSON.stringify(st)); }
// st.vocab[setId] = {known:{idx:true}, hard:{idx:true}}
// st.quiz[unitId] = [{d:"2026-08-09", s:18, t:20}, ...]
// st.wrongs[unitId] = [bankIdx, ...]
function getVocab(setId){
  const st = loadStore();
  return (st.vocab && st.vocab[setId]) || {known:{}, hard:{}};
}
function setVocab(setId, data){
  const st = loadStore();
  st.vocab = st.vocab || {};
  st.vocab[setId] = data;
  saveStore(st);
}
function addQuizResult(unitId, score, total){
  const st = loadStore();
  st.quiz = st.quiz || {};
  st.quiz[unitId] = st.quiz[unitId] || [];
  st.quiz[unitId].push({d:new Date().toISOString().slice(0,16), s:score, t:total});
  if (st.quiz[unitId].length > 30) st.quiz[unitId] = st.quiz[unitId].slice(-30);
  saveStore(st);
}
function getQuizHistory(unitId){
  const st = loadStore();
  return (st.quiz && st.quiz[unitId]) || [];
}
function addWrongs(unitId, idxList){
  const st = loadStore();
  st.wrongs = st.wrongs || {};
  const cur = new Set(st.wrongs[unitId] || []);
  idxList.forEach(i => cur.add(i));
  st.wrongs[unitId] = [...cur];
  saveStore(st);
}
function removeWrong(unitId, idx){
  const st = loadStore();
  if (!st.wrongs || !st.wrongs[unitId]) return;
  st.wrongs[unitId] = st.wrongs[unitId].filter(i => i !== idx);
  saveStore(st);
}
function getWrongs(unitId){
  const st = loadStore();
  return (st.wrongs && st.wrongs[unitId]) || [];
}
// 單字考試成績：st.vquiz[setId] = [{d:"2026-08-13T09:20", m:"mcq"|"spell", s, t, p}]
function addVocabResult(setId, mode, score, total, p){
  const st = loadStore();
  st.vquiz = st.vquiz || {};
  st.vquiz[setId] = st.vquiz[setId] || [];
  st.vquiz[setId].push({
    d: new Date().toISOString().slice(0,16),
    m: mode, s: score, t: total, p: p ? +p : 0
  });
  if (st.vquiz[setId].length > 40) st.vquiz[setId] = st.vquiz[setId].slice(-40);
  saveStore(st);
}
function getVocabHistory(setId){
  const st = loadStore();
  return (st.vquiz && st.vquiz[setId]) || [];
}

// ---------- 進度打包：給老師後台看的分享碼 ----------
// 認識／不熟用位元遮罩壓縮，才能塞進一條網址
function bitsToB64(bits){
  let bytes = "";
  for (let i = 0; i < bits.length; i += 8){
    bytes += String.fromCharCode(parseInt(bits.slice(i, i+8).padEnd(8, "0"), 2));
  }
  return btoa(bytes).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function b64ToBits(b64, len){
  const s = atob(b64.replace(/-/g,"+").replace(/_/g,"/"));
  let bits = "";
  for (let i = 0; i < s.length; i++) bits += s.charCodeAt(i).toString(2).padStart(8, "0");
  return bits.slice(0, len);
}
// 代碼做過簡單擾亂，學生看到只會是一串亂碼（這是防好奇，不是加密）
const CODE_PREFIX = "KIN1.";
const CODE_KEY = "KinEnglish2026";
function xorStr(s){
  let out = "";
  for (let i = 0; i < s.length; i++)
    out += String.fromCharCode(s.charCodeAt(i) ^ CODE_KEY.charCodeAt(i % CODE_KEY.length));
  return out;
}
function encodeProgress(){
  const st = loadStore();
  const k = {}, h = {};
  allSets().forEach(s => {
    const v = (st.vocab && st.vocab[s.id]) || {known:{}, hard:{}};
    let kb = "", hb = "", any = false;
    for (let i = 0; i < s.words.length; i++){
      const kk = v.known[i] ? "1" : "0", hh = v.hard[i] ? "1" : "0";
      if (kk === "1" || hh === "1") any = true;
      kb += kk; hb += hh;
    }
    if (any){ k[s.id] = bitsToB64(kb); h[s.id] = bitsToB64(hb); }
  });
  const payload = {v:1, t:new Date().toISOString().slice(0,16),
    g: st.goalSet || "", k, h, q: st.quiz || {}, w: st.wrongs || {}, vq: st.vquiz || {}};
  // 用 encodeURIComponent 先處理中文等非 Latin1 字元，btoa 才不會爆
  const raw = unescape(encodeURIComponent(JSON.stringify(payload)));
  return CODE_PREFIX + btoa(xorStr(raw))
    .replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function decodeProgress(code){
  let c = String(code).trim().replace(/\s+/g, "");
  if (c.startsWith(CODE_PREFIX)) c = c.slice(CODE_PREFIX.length);
  const b64 = c.replace(/-/g,"+").replace(/_/g,"/");
  const p = JSON.parse(decodeURIComponent(escape(xorStr(atob(b64)))));
  const vocab = {};
  allSets().forEach(s => {
    if (!p.k || !p.k[s.id]) return;
    const kb = b64ToBits(p.k[s.id], s.words.length);
    const hb = b64ToBits(p.h[s.id] || "", s.words.length);
    const known = {}, hard = {};
    for (let i = 0; i < s.words.length; i++){
      if (kb[i] === "1") known[i] = true;
      if (hb[i] === "1") hard[i] = true;
    }
    vocab[s.id] = {known, hard};
  });
  return {stamp:p.t, goalSet:p.g, vocab, quiz:p.q || {}, wrongs:p.w || {}, vquiz:p.vq || {}};
}
// ---------- 單字來源：主題單字集 ＋ 學校課本單元 ----------
// 學校單元與主題單字集的資料結構相同，所以字卡／單字表／測驗都能共用
function allSets(){
  const school = (window.SCHOOL_UNITS || []).filter(u => u.ready);
  return (window.WORD_SETS || []).concat(school);
}
function findSet(id){ return allSets().find(s => s.id === id) || null; }

// 文法單元：一般 8 個單元 ＋ 已匯入且有文法的學校單元
function allUnits(){
  const school = (window.SCHOOL_UNITS || [])
    .filter(u => u.ready && u.grammar)
    .map(u => ({id:u.id, no:u.no, name:u.name, icon:u.icon,
                brief:u.topic || "", isSchool:true}));
  return (window.UNITS || []).concat(school);
}

// ---------- 學單字：過濾簡單字、每 10 字分篇 ----------
const LESSON_SIZE = 10;
// 回傳這個主題「要學的字」（略過 EASY_WORDS），保留原始 index
function learnWords(set){
  const easy = new Set((window.EASY_WORDS && window.EASY_WORDS[set.id]) || []);
  return set.words
    .map((w, i) => ({en:w[0], zh:w[1], pos:w[2], ex:w[3] || "", kk:w[4] || "", idx:i}))
    .filter(w => !easy.has(w.en));
}
// 切成每篇 10 個字；最後不足 4 個字就併入前一篇，避免出現只有 1 個字的篇
function lessonsOf(set){
  const all = learnWords(set), out = [];
  for (let i = 0; i < all.length; i += LESSON_SIZE) out.push(all.slice(i, i + LESSON_SIZE));
  if (out.length > 1 && out[out.length-1].length < 4){
    const tail = out.pop();
    out[out.length-1] = out[out.length-1].concat(tail);
  }
  return out;
}
// 指定第 n 篇（1 起算）；沒指定就回傳全部要學的字
function lessonWords(set, p){
  const ls = lessonsOf(set);
  const n = parseInt(p, 10);
  return (n >= 1 && n <= ls.length) ? ls[n-1] : learnWords(set);
}
function knownIn(setId, items){
  const v = getVocab(setId);
  return items.filter(w => v.known[w.idx]).length;
}

// 目標單字單元
function getGoalSet(){ return loadStore().goalSet || null; }
function setGoalSet(setId){
  const st = loadStore();
  st.goalSet = setId;
  saveStore(st);
}

// ---------- 學習報告（寄給老師的純文字內容） ----------
function buildReport(){
  const st = loadStore();
  const L = [];
  const cfg = window.REPORT_CONFIG || {};
  const now = new Date().toISOString().slice(0,16).replace("T", " ");
  L.push(`${cfg.studentName || "學生"} 的英文學習回報`);
  L.push(`回報時間：${now}`);

  // 總覽
  let known = 0, hard = 0, learnable = 0;
  allSets().forEach(s => {
    const v = getVocab(s.id), learn = learnWords(s);
    learnable += learn.length;
    known += learn.filter(w => v.known[w.idx]).length;
    hard += Object.keys(v.hard).length;
  });
  const units = allUnits();
  let passed = 0, tests = 0;
  units.forEach(u => {
    const h = getQuizHistory(u.id);
    tests += h.length;
    if (h.some(r => r.s / r.t >= 0.8)) passed++;
  });
  allSets().forEach(s => tests += getVocabHistory(s.id).length);

  L.push("");
  L.push("【總覽】");
  L.push(`已認識單字：${known} / ${learnable}`);
  L.push(`標記不熟：${hard} 個`);
  L.push(`文法通過：${passed} / ${units.length} 單元（80 分以上）`);
  L.push(`累計測驗：${tests} 次`);

  // 文法
  const gLines = [];
  units.forEach(u => {
    const label = u.isSchool ? `【學校】${u.name}` : `Unit ${u.no} ${u.name}`;
    const h = getQuizHistory(u.id);
    if (!h.length){ gLines.push(`${label}：尚未測驗`); return; }
    const pcts = h.map(r => Math.round(r.s / r.t * 100));
    gLines.push(`${label}：${h.length} 次，最佳 ${Math.max(...pcts)} 分，` +
      `最近 ${pcts[pcts.length-1]} 分，錯題 ${getWrongs(u.id).length} 題`);
  });
  L.push(""); L.push("【文法測驗】"); L.push(...gLines);

  // 單字
  const vLines = [];
  allSets().forEach(s => {
    const v = getVocab(s.id), learn = learnWords(s);
    const k = learn.filter(w => v.known[w.idx]).length;
    const hd = Object.keys(v.hard).length;
    if (k || hd) vLines.push(`${s.name}：認識 ${k}/${learn.length}${hd ? `，不熟 ${hd}` : ""}`);
  });
  if (vLines.length){ L.push(""); L.push("【單字進度】"); L.push(...vLines); }

  // 最近測驗
  const rec = [];
  units.forEach(u => getQuizHistory(u.id).forEach(r =>
    rec.push({d:r.d, w:`文法 ${u.isSchool ? "學校 " + u.name : "Unit " + u.no + " " + u.name}`,
              s:r.s, t:r.t})));
  allSets().forEach(s => getVocabHistory(s.id).forEach(r =>
    rec.push({d:r.d, w:`單字 ${s.name}${r.p ? ` 第${r.p}篇` : ""}・${r.m === "mcq" ? "選擇題" : "拼字"}`, s:r.s, t:r.t})));
  rec.sort((a,b) => String(b.d).localeCompare(String(a.d)));
  if (rec.length){
    L.push(""); L.push("【最近測驗】");
    rec.slice(0,15).forEach(r => L.push(`${String(r.d).replace("T"," ")}　${r.w}　${r.s}/${r.t}`));
  }

  // 不熟的字
  const hLines = [];
  allSets().forEach(s => {
    const v = getVocab(s.id);
    const ws = Object.keys(v.hard).map(Number).sort((a,b)=>a-b)
      .map(i => s.words[i]).filter(Boolean);
    if (ws.length) hLines.push(`${s.name}：` + ws.map(w => `${w[0]} ${w[1]}`).join("、"));
  });
  if (hLines.length){ L.push(""); L.push("【還不熟的單字】"); L.push(...hLines); }

  L.push(""); L.push("————————————————");
  L.push("完整儀表板代碼（貼到 teacher.html 可看圖表與錯題）：");
  L.push(encodeProgress());
  return L.join("\n");
}

// 一鍵寄送：依 report-config.js 的設定送出，回傳 {ok, how, message}
// opts.silent = 自動回報（不做 mailto 後備）；opts.keepalive = 頁面關閉中也要送出
async function sendReport(opts){
  opts = opts || {};
  const cfg = window.REPORT_CONFIG || {};
  const body = buildReport();
  const subject = (cfg.subject || "英文學習回報") +
    (opts.silent ? "｜自動回報" : "") + "（" +
    new Date().toISOString().slice(0,10) + "）";

  if (cfg.method === "web3forms" && cfg.accessKey){
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      keepalive: !!opts.keepalive,
      headers: {"Content-Type": "application/json", Accept: "application/json"},
      body: JSON.stringify({access_key: cfg.accessKey, subject,
        from_name: cfg.studentName || "學生", message: body})
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok && j.success !== false) return {ok:true, how:"web3forms"};
    return {ok:false, how:"web3forms", message:(j && j.message) || "寄送失敗"};
  }

  if (cfg.method === "formsubmit" && cfg.teacherEmail){
    const res = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(cfg.teacherEmail), {
      method: "POST",
      keepalive: !!opts.keepalive,
      headers: {"Content-Type": "application/json", Accept: "application/json"},
      body: JSON.stringify({_subject: subject, name: cfg.studentName || "學生", message: body})
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) return {ok:true, how:"formsubmit", message:j && j.message};
    return {ok:false, how:"formsubmit", message:"寄送失敗"};
  }

  if (opts.silent) return {ok:false, how:"none", message:"沒有可用的自動寄送方式"};

  // 後備：打開郵件 App（內容已經帶好，學生按寄出）
  if (cfg.teacherEmail){
    location.href = `mailto:${cfg.teacherEmail}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
    return {ok:true, how:"mailto"};
  }
  return {ok:false, how:"none", message:"老師還沒設定收件方式"};
}

// ---------- 自動回報 ----------
// iOS 不允許網頁在關閉狀態下自己執行，所以改成：學生打開 App 或用完切走時，
// 若有新的學習紀錄就在背景寄出。跨到隔天一定會補送一次。
function todayStr(){
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" +
         String(d.getDate()).padStart(2,"0");
}
// 進度指紋：只要背了字或考過試就會變
function progressFingerprint(){
  const st = loadStore();
  const src = JSON.stringify([st.vocab || {}, st.quiz || {}, st.vquiz || {}]);
  let h = 0;
  for (let i = 0; i < src.length; i++) h = (h * 31 + src.charCodeAt(i)) | 0;
  return src.length + ":" + h;
}
function hasProgress(){
  const st = loadStore();
  return !!(st.vocab && Object.keys(st.vocab).length) ||
         !!(st.quiz && Object.keys(st.quiz).length) ||
         !!(st.vquiz && Object.keys(st.vquiz).length);
}
function getAutoState(){ return loadStore().auto || {}; }
function setAutoState(o){
  const st = loadStore();
  st.auto = o;
  saveStore(st);
}
let autoSending = false;
async function maybeAutoReport(){
  const cfg = window.REPORT_CONFIG || {};
  if (!cfg.auto || autoSending) return false;
  if (/teacher\.html/.test(location.pathname)) return false;   // 老師後台不回報
  if (navigator.onLine === false) return false;
  if (!hasProgress()) return false;

  const fp = progressFingerprint();
  const a = getAutoState();
  if (a.fp === fp) return false;                                // 沒有新進度就不寄

  const newDay = a.day !== todayStr();
  const hours = a.at ? (Date.now() - new Date(a.at).getTime()) / 36e5 : Infinity;
  if (!newDay && hours < (cfg.minHours == null ? 6 : cfg.minHours)) return false;

  autoSending = true;
  try {
    const r = await sendReport({silent:true, keepalive:true});
    if (r.ok) setAutoState({fp, at:new Date().toISOString(), day:todayStr()});
    return r.ok;
  } catch(e){ return false; }
  finally { autoSending = false; }
}
if (typeof window !== "undefined"){
  // visibilitychange 是派發在 document 上，直接掛在 document 才不會漏接
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") maybeAutoReport();
  });
  addEventListener("pagehide", () => { maybeAutoReport(); });
  addEventListener("blur", () => { maybeAutoReport(); });
  addEventListener("load", () => setTimeout(maybeAutoReport, 2000));
}

// ---------- 發音 ----------
// 優先播 audio/ 底下事先合成好的 mp3（用 gen/generate_audio.py 產生，微軟神經語音），
// 每支手機聽起來都一樣好；沒有現成音檔時才退回瀏覽器內建的語音。

// 和 gen/generate_audio.py 的 key_of() 是同一套雜湊（FNV-1a 32-bit）
function audioKey(text){
  const bytes = new TextEncoder().encode(String(text || "").replace(/\s+/g, " ").trim());
  let h = 2166136261;
  for (let i = 0; i < bytes.length; i++){
    h = Math.imul(h ^ bytes[i], 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
// data/audio.js 把所有 key 接成一長串，每 8 個字元一個
let _audioKeys = null;
function hasAudio(key){
  if (!_audioKeys){
    const s = window.AUDIO_KEYS || "";
    _audioKeys = new Set();
    for (let i = 0; i + 8 <= s.length; i += 8) _audioKeys.add(s.substr(i, 8));
  }
  return _audioKeys.has(key);
}

// 使用者可以自己切回內建語音（例如手機不方便關靜音時）
function useBuiltinVoice(){ return !!loadStore().builtinVoice; }
function setBuiltinVoice(on){
  const st = loadStore();
  st.builtinVoice = !!on;
  saveStore(st);
}

let _voice = null;
function pickVoice(){
  const vs = speechSynthesis.getVoices().filter(v => v.lang.startsWith("en"));
  const score = v => {
    const n = v.name;
    // 各平台上真的比較好聽的：Edge 的線上神經語音 > Google 語音 > Apple 進階語音
    if (/Natural|Neural/i.test(n)) return 5;
    if (/^Google/.test(n)) return 4;
    if (/Enhanced|Premium|Siri/i.test(n)) return 3;
    if (/Samantha|Ava|Allison|Karen|Serena/.test(n)) return 2;
    return 1;
  };
  const us = vs.filter(v => v.lang === "en-US" || v.lang === "en_US");
  _voice = (us.length ? us : vs).sort((a, b) => score(b) - score(a))[0] || null;
}
if ("speechSynthesis" in window){
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}
function ttsSpeak(text){
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.9;
  if (_voice) u.voice = _voice;
  speechSynthesis.speak(u);
}

let _player = null;
function stopSpeaking(){
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (_player){ _player.pause(); _player = null; }
}
function speak(text){
  stopSpeaking();
  const key = audioKey(text);
  if (useBuiltinVoice() || !hasAudio(key)){ ttsSpeak(text); return; }
  const a = new Audio("audio/" + key + ".mp3");
  _player = a;
  // 音檔壞掉或被擋下來（例如還沒下載又沒網路）就改用內建語音，不能讓它沒聲音
  const fallback = () => { if (_player === a){ _player = null; ttsSpeak(text); } };
  a.onerror = fallback;
  const p = a.play();
  if (p && p.catch) p.catch(fallback);
}

// ---------- 隨機 ----------
function shuffle(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function sampleN(arr, n){ return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function qs(name){ return new URLSearchParams(location.search).get(name); }
function esc(s){ const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

// ---------- service worker ----------
if ("serviceWorker" in navigator){
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(()=>{}));
}

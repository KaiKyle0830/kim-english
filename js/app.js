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
  st.quiz[unitId].push({d:new Date().toISOString().slice(0,10), s:score, t:total});
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
// ---------- 單字來源：主題單字集 ＋ 學校課本單元 ----------
// 學校單元與主題單字集的資料結構相同，所以字卡／單字表／測驗都能共用
function allSets(){
  const school = (window.SCHOOL_UNITS || []).filter(u => u.ready);
  return (window.WORD_SETS || []).concat(school);
}
function findSet(id){ return allSets().find(s => s.id === id) || null; }

// ---------- 學單字：過濾簡單字、每 10 字分篇 ----------
const LESSON_SIZE = 10;
// 回傳這個主題「要學的字」（略過 EASY_WORDS），保留原始 index
function learnWords(set){
  const easy = new Set((window.EASY_WORDS && window.EASY_WORDS[set.id]) || []);
  return set.words
    .map((w, i) => ({en:w[0], zh:w[1], pos:w[2], ex:w[3] || "", idx:i}))
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

// ---------- 發音 (Web Speech API) ----------
let _voice = null;
function pickVoice(){
  const vs = speechSynthesis.getVoices().filter(v => v.lang.startsWith("en"));
  _voice = vs.find(v => v.name.includes("Samantha")) || vs.find(v => v.lang === "en-US") || vs[0] || null;
}
if ("speechSynthesis" in window){
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}
function speak(text){
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.9;
  if (_voice) u.voice = _voice;
  speechSynthesis.speak(u);
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

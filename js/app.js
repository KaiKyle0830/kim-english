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

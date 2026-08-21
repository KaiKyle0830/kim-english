// 離線快取：安裝時抓齊所有資源。
// 網頁和程式碼走「網路優先」：有網路就一定拿到最新版，重新整理一次就會更新；
// 網路不通或太慢（超過 NET_TIMEOUT）才改用快取，所以離線一樣能用。
// 發音檔內容永遠不會變，走「快取優先」，不必每次回伺服器問。
const CACHE = "kim-english-v17";
const NET_TIMEOUT = 2500;
// 發音檔另外放一個快取：版本更新時不要把已經下載好的語音清掉（有 2000 多個檔案）
const AUDIO_CACHE = "kim-english-audio-v1";
const ASSETS = [
  "index.html", "vocab.html", "lessons.html", "wordlist.html", "cards.html",
  "vocabquiz.html", "mcq.html", "spell.html",
  "grammar.html", "unit.html", "wrongs.html",
  "school.html", "schoolunit.html", "share.html", "slides.html",
  "lens.html",
  "css/style.css", "css/slides.css", "css/lens.css",
  "js/app.js", "js/units.js", "js/lens.js",
  "data/words.js", "data/easy.js", "data/school.js", "data/slides.js",
  "data/report-config.js", "data/audio.js",
  "data/grammar/s1.js", "data/grammar/s2.js",
  "data/grammar/u1.js", "data/grammar/u2.js", "data/grammar/u3.js", "data/grammar/u4.js",
  "data/grammar/u5.js", "data/grammar/u6.js", "data/grammar/u7.js", "data/grammar/u8.js",
  "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png"
];
self.addEventListener("install", e => {
  // cache:"reload" 繞過瀏覽器 HTTP 快取，確保裝新版時抓到的是最新檔案
  const fresh = ASSETS.map(u => new Request(u, {cache: "reload"}));
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(fresh)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE && k !== AUDIO_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin === location.origin && /\/audio\/[0-9a-f]{8}\.mp3$/.test(url.pathname)){
    // 發音檔的內容永遠不會變，抓過一次就直接用快取，不必再回伺服器確認
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok){
        const copy = res.clone();
        caches.open(AUDIO_CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      }
      return res;
    })));
    return;
  }
  e.respondWith(networkFirst(e.request));
});

// 網路優先：以網路的回應為準，順便更新快取。
// 網路太慢就先拿快取頂著（但背景那個 fetch 還是會把快取更新好），
// 網路完全不通就直接用快取。
function networkFirst(req){
  return new Promise(resolve => {
    let settled = false;
    const done = res => { if (!settled && res){ settled = true; resolve(res); } };
    const fromCache = () => caches.match(req, {ignoreSearch:true});

    const slow = setTimeout(() => fromCache().then(done), NET_TIMEOUT);
    fetch(req).then(res => {
      clearTimeout(slow);
      // 先複製，等 caches.open 完成後 body 可能已被頁面讀走就不能再 clone
      if (res.ok){
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      done(res);
    }).catch(() => {
      clearTimeout(slow);
      fromCache().then(hit => done(hit || Response.error()));
    });
  });
}

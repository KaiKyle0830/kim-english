// 離線快取：安裝時抓齊所有資源，之後快取優先、背景更新
const CACHE = "kim-english-v4";
const ASSETS = [
  "index.html", "vocab.html", "wordlist.html", "cards.html",
  "vocabquiz.html", "mcq.html", "spell.html",
  "grammar.html", "unit.html", "wrongs.html",
  "css/style.css", "js/app.js", "js/units.js", "data/words.js",
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
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch:true}).then(hit => {
      const fetched = fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || fetched;
    })
  );
});

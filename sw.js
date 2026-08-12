// 離線快取：安裝時抓齊所有資源，之後快取優先、背景更新
const CACHE = "kim-english-v10";
const ASSETS = [
  "index.html", "vocab.html", "lessons.html", "wordlist.html", "cards.html",
  "vocabquiz.html", "mcq.html", "spell.html",
  "grammar.html", "unit.html", "wrongs.html",
  "school.html", "schoolunit.html", "share.html",
  "css/style.css", "js/app.js", "js/units.js",
  "data/words.js", "data/easy.js", "data/school.js", "data/report-config.js",
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
        // 先複製，等 caches.open 完成後 body 可能已被頁面讀走就不能再 clone
        if (res.ok){
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => hit);
      return hit || fetched;
    })
  );
});

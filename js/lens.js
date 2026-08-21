// 透鏡成像互動頁：光學圖 + 成像判讀 + 小測驗
// 座標約定：透鏡在原點，物體在左邊 x=-p，向右為 +x，向上為 +y。
// 焦距帶正負號：凸透鏡 f>0，凹透鏡 f<0，兩種透鏡就能共用同一組公式。
//   成像位置 q = p·f / (p − f)      q>0 在右邊（實像）、q<0 在左邊（虛像）
//   放大率   m = −q / p             m>0 正立、m<0 倒立、|m| 就是放大倍率
(function(){
const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];

const OBJ_H = 3.4;          // 物高（公分），固定不變，這樣像的大小才看得出差別
const EQ    = 0.24;         // 判斷「剛好等於 f 或 2f」的容許誤差
const S = { type:"convex", f:6, p:16 };

// 帶正負號的焦距
const sf = () => S.type === "convex" ? S.f : -S.f;

function solve(){
  const f = sf(), p = S.p;
  if (Math.abs(p - f) < EQ) return { f, p, none:true };   // 物體在焦點上：折射後是平行光
  const q = p * f / (p - f);
  const m = -q / p;
  return { f, p, q, m, none:false, real:q > 0, upright:m > 0 };
}

// 目前落在哪一種情況
function caseKey(){
  const f = S.f, p = S.p;
  if (S.type === "concave") return "concave";
  if (Math.abs(p - f)     < EQ) return "atF";
  if (p < f)                    return "inF";
  if (Math.abs(p - 2*f)   < EQ) return "at2F";
  if (p > 2*f)                  return "out2F";
  return "between";
}

const CASES = {
  out2F: { row:0, name:"倒立、縮小的實像",
    tags:[["倒立","a"],["縮小","b"],["實像","c"]],
    use:"📷 照相機、手機鏡頭、我們的眼睛。景物離鏡頭很遠（遠大於 2f），縮小的實像剛好落在感光元件或視網膜上。" },
  at2F: { row:1, name:"倒立、等大的實像",
    tags:[["倒立","a"],["等大","b"],["實像","c"]],
    use:"🖨️ 早期的影印機。物距＝像距＝2f，這是凸透鏡成實像時「像最小」的位置，再靠近像就開始變大。" },
  between: { row:2, name:"倒立、放大的實像",
    tags:[["倒立","a"],["放大","b"],["實像","c"]],
    use:"🎬 投影機、幻燈機。所以投影片要倒著放，投到布幕上才會是正的。" },
  atF: { row:3, name:"不成像（折射後成為平行光）",
    tags:[["不成像","d"]],
    use:"🔦 探照燈、手電筒。把燈泡放在焦點上，射出去的就是一束平行光，可以照得很遠。" },
  inF: { row:4, name:"正立、放大的虛像",
    tags:[["正立","a"],["放大","b"],["虛像","d"]],
    use:"🔍 放大鏡。像和物體在透鏡的同一側，光線並沒有真的通過那裡，所以用布幕接不到。" },
  concave: { row:5, name:"正立、縮小的虛像",
    tags:[["正立","a"],["縮小","b"],["虛像","d"]],
    use:"👓 近視眼鏡、門上的貓眼。凹透鏡讓光線發散，不管物體放多遠，都只會成正立縮小的虛像。" }
};

const RULES = [
  ["物距 > 2f",    "凸", "f ～ 2f",  "倒立縮小實像", "照相機"],
  ["物距 = 2f",    "凸", "= 2f",     "倒立等大實像", "影印機"],
  ["f < 物距 < 2f","凸", "> 2f",     "倒立放大實像", "投影機"],
  ["物距 = f",     "凸", "不成像",   "折射後平行光", "探照燈"],
  ["物距 < f",     "凸", "與物同側", "正立放大虛像", "放大鏡"],
  ["任何位置",     "凹", "與物同側", "正立縮小虛像", "近視眼鏡"]
];

// ---------- 光學圖 ----------
const cv = $("#stage"), ctx = cv.getContext("2d");
let W = 320, HT = 220;            // 畫布的 CSS 尺寸
let half = 20, halfTarget = 20;   // 畫面左右各顯示幾公分（會平滑縮放）
let vmax = OBJ_H;                 // 上下最多要放得下幾公分（物或像比較高的那個）
let raf = 0;

function cssVar(n){ return getComputedStyle(document.body).getPropertyValue(n).trim(); }

function fit(){
  const box = cv.parentElement;
  const dpr = window.devicePixelRatio || 1;
  W  = Math.max(240, box.clientWidth - 20);
  HT = Math.round(Math.min(330, Math.max(215, W * 0.62)));
  cv.style.width = W + "px"; cv.style.height = HT + "px";
  cv.width = Math.round(W * dpr); cv.height = Math.round(HT * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// 世界座標（公分）→ 畫布座標（像素）
// 左右和上下都要放得進來，取比較小的縮放比
const scale = () => Math.min((W / 2 - 14) / half, (HT / 2 - 34) / vmax);
const CX = () => W / 2, CY = () => HT / 2 + 6;
const X = x => CX() + x * scale();
const Y = y => CY() - y * scale();

function seg(a, b, color, width, dash){
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = width || 2;
  ctx.setLineDash(dash || []);
  ctx.beginPath(); ctx.moveTo(X(a.x), Y(a.y)); ctx.lineTo(X(b.x), Y(b.y)); ctx.stroke();
  ctx.restore();
}
// 從 P 沿著方向 d 畫到畫面邊緣
function toEdge(P, d){
  const edge = d.x > 0 ? half : -half;
  const t = (edge - P.x) / d.x;
  return { x: edge, y: P.y + d.y * t };
}
function label(text, px, py, color, align, font){
  ctx.save();
  ctx.fillStyle = color; ctx.font = font || "600 12px -apple-system,'PingFang TC',sans-serif";
  ctx.textAlign = align || "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, px, py); ctx.restore();
}
// 物體／像的箭頭（世界座標）
function arrow(x, y, color, dashed){
  const x0 = X(x), y0 = Y(0), y1 = Y(y), up = y1 < y0 ? -1 : 1, w = 5;
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
  ctx.setLineDash(dashed ? [5,4] : []);
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x0, y1); ctx.lineTo(x0 - w, y1 + up*9); ctx.lineTo(x0 + w, y1 + up*9);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}
// 底下的距離標示
function dim(x1, x2, py, text, color){
  if (Math.abs(X(x2) - X(x1)) < 26) return;
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(X(x1), py - 4); ctx.lineTo(X(x1), py + 4);
  ctx.moveTo(X(x2), py - 4); ctx.lineTo(X(x2), py + 4);
  ctx.moveTo(X(x1), py); ctx.lineTo(X(x2), py);
  ctx.stroke();
  const mid = (X(x1) + X(x2)) / 2;
  ctx.font = "600 11px -apple-system,'PingFang TC',sans-serif";
  const w = ctx.measureText(text).width + 8;
  ctx.fillStyle = cssVar("--card");
  ctx.fillRect(mid - w/2, py - 7, w, 14);
  ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, mid, py);
  ctx.restore();
}

const RAY = { par:"#f59e0b", mid:"#10b981", foc:"#a855f7" };

function drawLens(lensNeed){
  const x = CX(), w = 12;
  // 鏡片高度跟著光線走：至少包住打在透鏡上的光線，但不能低到蓋住底下的距離標示
  const lh = Math.max(44, Math.min(lensNeed * 1.25, HT * 0.40, HT / 2 - 42));
  const accent = cssVar("--accent");
  // 透鏡所在的平面：畫成淡淡的虛線，光線畫到這條線上轉折
  ctx.save();
  ctx.strokeStyle = cssVar("--line"); ctx.lineWidth = 1; ctx.setLineDash([4,4]);
  ctx.beginPath(); ctx.moveTo(x, 12); ctx.lineTo(x, HT - 12); ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  if (S.type === "convex"){                      // 中間厚、邊緣薄
    ctx.moveTo(x, CY() - lh);
    ctx.quadraticCurveTo(x + w*2.2, CY(), x, CY() + lh);
    ctx.quadraticCurveTo(x - w*2.2, CY(), x, CY() - lh);
  } else {                                       // 中間薄、邊緣厚
    ctx.moveTo(x - w, CY() - lh);
    ctx.lineTo(x + w, CY() - lh);
    ctx.quadraticCurveTo(x, CY(), x + w, CY() + lh);
    ctx.lineTo(x - w, CY() + lh);
    ctx.quadraticCurveTo(x, CY(), x - w, CY() - lh);
  }
  ctx.closePath();
  ctx.fillStyle = "rgba(79,109,245,.18)"; ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
  label(S.type === "convex" ? "凸透鏡" : "凹透鏡", x, HT - 8, accent);
}

function draw(){
  const r = solve(), muted = cssVar("--muted"), text = cssVar("--text");
  const f = S.f, p = S.p, sgn = sf();
  ctx.clearRect(0, 0, W, HT);

  // 主軸
  ctx.save();
  ctx.strokeStyle = muted; ctx.lineWidth = 1; ctx.globalAlpha = .55;
  ctx.beginPath(); ctx.moveTo(0, CY()); ctx.lineTo(W, CY()); ctx.stroke();
  ctx.restore();

  // 焦點 F 與二倍焦距 2F
  [[-2*f,"2F"],[-f,"F"],[f,"F′"],[2*f,"2F′"]].forEach(([x, name]) => {
    if (Math.abs(x) > half) return;
    ctx.save();
    ctx.fillStyle = muted;
    ctx.beginPath(); ctx.arc(X(x), CY(), 3, 0, 7); ctx.fill();
    ctx.restore();
    label(name, X(x), CY() + 15, muted, "center", "600 11px -apple-system,sans-serif");
  });


  // 光線：T 是物體頂端
  const T = { x:-p, y:OBJ_H };
  const L1 = { x:0, y:OBJ_H };                       // 平行光打在透鏡上的位置
  const dir1 = { x:Math.abs(sgn), y:-Math.sign(sgn)*OBJ_H };  // 折射後通過（或看似來自）焦點
  const L2 = { x:0, y:0 };                           // 通過鏡心
  const dir2 = { x:p, y:-OBJ_H };
  const y3 = r.none ? null : OBJ_H * sgn / (sgn - p); // 朝焦點入射 → 折射後與主軸平行
  const L3 = y3 === null ? null : { x:0, y:y3 };
  const dir3 = { x:1, y:0 };
  drawLens(Math.max(OBJ_H, Math.min(Math.abs(y3 || 0), OBJ_H * 2.4)) * scale());
  const rays = [
    { L:L1, d:dir1, c:RAY.par, from:T },
    { L:L2, d:dir2, c:RAY.mid, from:T }
  ];
  if (L3 && $("#ray3").checked) rays.push({ L:L3, d:dir3, c:RAY.foc, from:T });

  rays.forEach(ry => {
    seg(ry.from, ry.L, ry.c, 2);                 // 入射
    seg(ry.L, toEdge(ry.L, ry.d), ry.c, 2);      // 折射後
  });

  // 虛像：把折射光線往回延長（虛線），交點就是像的位置
  if (!r.none && r.q < 0){
    const I = { x:r.q, y:r.m * OBJ_H };
    rays.forEach(ry => seg(ry.L, I, ry.c, 1.5, [5,4]));
    seg(T, I, RAY.mid, 1.5, [5,4]);
  }

  // 物體
  arrow(-p, OBJ_H, cssVar("--accent"));
  label("物體", X(-p), Y(OBJ_H) - 18, cssVar("--accent"));

  // 像
  if (!r.none){
    const ih = r.m * OBJ_H;
    if (Math.abs(r.q) <= half){
      arrow(r.q, ih, "#dc2626", !r.real);
      // 標籤不要壓到底下的距離標示，太低就往上收、順便往旁邊讓開箭頭
      let ly = ih > 0 ? Y(ih) - 18 : Y(ih) + 20, lx = X(r.q);
      if (ly > HT - 46){ ly = HT - 46; lx = Math.min(lx + 24, W - 28); }
      label(r.real ? "實像" : "虛像", lx, ly, "#dc2626");
    } else {
      const side = r.q > 0 ? 1 : -1;
      label((side > 0 ? "像在畫面外 →" : "← 像在畫面外"), CX() + side * (W/2 - 60),
            CY() - 62, "#dc2626");
    }
  } else {
    label("折射後是平行光，不成像", CX(), 22, "#dc2626");
  }

  // 底下的距離標示
  const base = HT - 26;
  dim(-p, 0, base, "物距 " + p.toFixed(1) + " cm", muted);
  if (!r.none && Math.abs(r.q) <= half)
    dim(Math.min(r.q, 0), Math.max(r.q, 0), r.q < 0 ? base - 17 : base,
        "像距 " + Math.abs(r.q).toFixed(1) + " cm", muted);
}

// 縮放平滑一點，拖曳時畫面才不會忽大忽小
function animate(){
  raf = 0;
  const d = halfTarget - half;
  if (Math.abs(d) > 0.05){ half += d * 0.25; raf = requestAnimationFrame(animate); }
  else half = halfTarget;
  draw();
}
function redraw(){ if (!raf) raf = requestAnimationFrame(animate); }

// ---------- 文字說明 ----------
function update(){
  const r = solve(), key = caseKey(), info = CASES[key];

  // 視野：物、像、2f 都盡量放得進來
  let need = Math.max(S.p * 1.15, S.f * 2.5, 9);
  if (!r.none && isFinite(r.q)) need = Math.max(need, Math.min(Math.abs(r.q) * 1.25, 44));
  halfTarget = Math.min(Math.max(need, 9), 50);
  // 像太高就把整張圖縮小一點，但最多縮到 2.4 倍物高，免得整張圖變得很小
  vmax = OBJ_H * Math.min(2.4, Math.max(1.15, r.none ? 1 : Math.abs(r.m) * 1.15));

  $("#fVal").textContent = S.f.toFixed(1) + " cm";
  $("#pVal").textContent = S.p.toFixed(1) + " cm";
  $("#caseName").textContent = info.name;
  $("#caseWhere").textContent = S.type === "concave"
    ? "凹透鏡：不管物體放在哪裡，結果都一樣"
    : ["物距 > 2f（兩倍焦距外）","物距 = 2f（剛好在兩倍焦距上）",
       "f < 物距 < 2f（焦距和兩倍焦距之間）","物距 = f（剛好在焦點上）",
       "物距 < f（焦距以內）"][info.row];
  $("#lg1").textContent = S.type === "convex" ? "平行主軸 → 過焦點" : "平行主軸 → 像從焦點射出";
  $("#lg3").textContent = S.type === "convex" ? "過焦點 → 平行主軸" : "朝焦點入射 → 平行主軸";
  $("#tags").innerHTML = info.tags.map(t => `<span class="tag ${t[1]}">${t[0]}</span>`).join("");
  $("#useText").textContent = info.use;

  $("#numP").textContent = S.p.toFixed(1);
  $("#numQ").textContent = r.none ? "—" : Math.abs(r.q).toFixed(1);
  $("#numM").textContent = r.none ? "—" : Math.abs(r.m).toFixed(2) + "×";
  $("#numQL").textContent = r.none ? "像距" : (r.real ? "像距（右側）" : "像距（同側）");

  $("#calc").innerHTML = r.none
    ? "物體剛好在焦點上，折射後的光線互相平行，永遠不會相交，所以不成像。"
    : `q = <b>${S.p.toFixed(1)}×${sf().toFixed(1)} ÷ (${S.p.toFixed(1)}−${sf().toFixed(1)})`
      + ` = ${r.q.toFixed(1)}</b> cm ${r.q > 0 ? "（正號 → 實像，在透鏡另一側）" : "（負號 → 虛像，和物體同一側）"}`
      + `<br>放大率 = 像距 ÷ 物距 = ${Math.abs(r.q).toFixed(1)} ÷ ${S.p.toFixed(1)}`
      + ` = <b>${Math.abs(r.m).toFixed(2)}</b>`
      + (Math.abs(r.m) > 1.01 ? "（大於 1 → 放大）" : Math.abs(r.m) < 0.99 ? "（小於 1 → 縮小）" : "（等於 1 → 等大）");

  $$("#rules tr[data-row]").forEach(tr =>
    tr.classList.toggle("on", +tr.dataset.row === info.row));
  $$("#presets button").forEach(b => b.classList.toggle("on", b.dataset.key === key));

  redraw();
}

// ---------- 控制項 ----------
function setType(t){
  S.type = t;
  $$("#typeSeg button").forEach(b => b.classList.toggle("on", b.dataset.t === t));
  update();
}
$$("#typeSeg button").forEach(b => b.onclick = () => setType(b.dataset.t));

const fIn = $("#fIn"), pIn = $("#pIn");
fIn.oninput = () => { S.f = +fIn.value; update(); };
pIn.oninput = () => { S.p = +pIn.value; update(); };
$("#ray3").onchange = redraw;

function syncInputs(){ fIn.value = S.f; pIn.value = S.p; }

// 情境快捷鍵：直接把滑桿設到那個情境
const PRESETS = {
  out2F:   { type:"convex",  f:6, p:20 },
  at2F:    { type:"convex",  f:6, p:12 },
  between: { type:"convex",  f:6, p:9  },
  atF:     { type:"convex",  f:6, p:6  },
  inF:     { type:"convex",  f:6, p:3  },
  concave: { type:"concave", f:6, p:12 }
};
$$("#presets button").forEach(b => b.onclick = () => {
  Object.assign(S, PRESETS[b.dataset.key]);
  syncInputs(); setType(S.type);
});

// 直接在圖上拖曳物體
let dragging = false;
function pxToP(clientX){
  const x = (clientX - cv.getBoundingClientRect().left - CX()) / scale();
  return Math.min(40, Math.max(1, Math.round(-x * 2) / 2));   // 對齊 0.5 cm
}
cv.addEventListener("pointerdown", e => {
  if (e.clientX - cv.getBoundingClientRect().left > CX() - 4) return;  // 只在透鏡左邊拖
  dragging = true;
  cv.setPointerCapture(e.pointerId);
  S.p = pxToP(e.clientX); syncInputs(); update();
});
cv.addEventListener("pointermove", e => {
  if (!dragging) return;
  e.preventDefault();
  const np = pxToP(e.clientX);
  if (np !== S.p){ S.p = np; syncInputs(); update(); }
});
["pointerup","pointercancel"].forEach(ev =>
  cv.addEventListener(ev, () => { dragging = false; }));

addEventListener("resize", () => { fit(); draw(); });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw);

// 成像規則表
$("#rules").innerHTML =
  "<tr><th>物體位置</th><th>鏡</th><th>像距</th><th>像的性質</th><th>應用</th></tr>" +
  RULES.map((r, i) => `<tr data-row="${i}"><td>${r[0]}</td><td>${r[1]}</td>` +
    `<td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join("");

fit(); syncInputs(); update();

// ---------- 小測驗 ----------
const OUT = {
  out2F:"倒立、縮小的實像", at2F:"倒立、等大的實像", between:"倒立、放大的實像",
  atF:"不成像（折射後是平行光）", inF:"正立、放大的虛像", concave:"正立、縮小的虛像"
};
function shuffle(a){
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); [b[i],b[j]] = [b[j],b[i]]; }
  return b;
}
const pick = a => a[Math.floor(Math.random() * a.length)];

// 題型一：給焦距和物距，問成什麼像
function qImage(){
  const f = pick([5, 6, 8, 10]);
  const key = pick(["out2F","at2F","between","atF","inF"]);
  const p = { out2F:f*pick([2.5,3,4]), at2F:f*2, between:f*1.5, atF:f, inF:f*0.5 }[key];
  const wrongs = shuffle(Object.keys(OUT).filter(k => k !== key)).slice(0, 3);
  const why = {
    out2F:`物距 ${p} 大於 2f＝${2*f}，落在「兩倍焦距外」→ 倒立縮小的實像（照相機）。`,
    at2F:`物距 ${p} 剛好等於 2f＝${2*f} → 倒立等大的實像，像距也是 ${2*f} 公分。`,
    between:`2f＝${2*f}，物距 ${p} 在 f 和 2f 之間 → 倒立放大的實像（投影機）。`,
    atF:`物距剛好等於焦距 ${f} → 折射後的光線互相平行，不會相交，所以不成像。`,
    inF:`物距 ${p} 小於焦距 ${f} → 正立放大的虛像，這就是放大鏡的用法。`
  }[key];
  return { q:`焦距 ${f} 公分的<b>凸透鏡</b>，物體放在透鏡前 ${p} 公分處，會成什麼像？`,
           opts:[OUT[key], ...wrongs.map(k => OUT[k])], ans:OUT[key], why };
}
// 題型二：給應用，問物體要放在哪裡
function qWhere(){
  const items = [
    ["🎬 投影機要在布幕上投出<b>放大的實像</b>，投影片應該放在哪裡？", "焦距和兩倍焦距之間（f < 物距 < 2f）",
     "只有放在 f 和 2f 之間，才會成放大的實像；像距會大於 2f，所以布幕要放得比較遠。"],
    ["📷 照相機要把遠方風景拍成<b>縮小的實像</b>，景物在哪裡？", "兩倍焦距外（物距 > 2f）",
     "物距大於 2f 時成倒立縮小的實像，像會落在 f 和 2f 之間，剛好是感光元件的位置。"],
    ["🔍 用放大鏡看小字，要看到<b>放大的正立虛像</b>，字要放在哪裡？", "焦距以內（物距 < f）",
     "物距小於焦距時，折射光線發散，往回延長才交會，成的是正立放大的虛像。"],
    ["🖨️ 想用凸透鏡成一個<b>和物體一樣大的實像</b>，物體要放在哪裡？", "剛好在兩倍焦距上（物距 = 2f）",
     "物距＝2f 時像距也是 2f，放大率剛好等於 1。"]
  ];
  const it = pick(items);
  const all = ["兩倍焦距外（物距 > 2f）","剛好在兩倍焦距上（物距 = 2f）",
               "焦距和兩倍焦距之間（f < 物距 < 2f）","焦距以內（物距 < f）"];
  return { q:it[0], opts:all, ans:it[1], why:it[2] };
}
// 題型三：放大率
function qMag(){
  const [p, q] = pick([[20,40],[15,30],[30,15],[24,12],[10,30],[18,18],[12,36]]);
  const m = q / p, ans = m.toFixed(1) + " 倍";
  const pool = ["0.5 倍","1.0 倍","1.5 倍","2.0 倍","3.0 倍"].filter(x => x !== ans);
  return { q:`物體放在凸透鏡前 ${p} 公分，像成在透鏡另一側 ${q} 公分處，放大率是多少？`,
           opts:[ans, ...shuffle(pool).slice(0, 3)], ans,
           why:`放大率＝像距 ÷ 物距＝${q} ÷ ${p}＝${m.toFixed(1)}，`
              + (m > 1 ? "大於 1 所以是放大的像。" : m < 1 ? "小於 1 所以是縮小的像。" : "等於 1 所以和物體一樣大。") };
}
// 題型四：觀念題
function qIdea(){
  const items = [
    ["下列哪一種像，可以用<b>白色紙屏</b>接收到？", "倒立放大的實像",
     ["正立放大的虛像","正立縮小的虛像","不成像"],
     "只有實像是光線真的會合而成的，才能投影在屏幕上；虛像是光線往回延長的交點，接不到。"],
    ["用<b>凹透鏡</b>看東西，不管物體遠近，看到的像都是？", "正立、縮小的虛像",
     ["倒立、放大的實像","倒立、縮小的實像","正立、放大的虛像"],
     "凹透鏡會讓光線發散，折射光線往回延長才交會，所以永遠是正立縮小的虛像。"],
    ["凸透鏡成實像時，把物體<b>慢慢靠近</b>透鏡（但仍在焦距外），像會怎麼變？", "像距變大，像變大",
     ["像距變小，像變小","像距變大，像變小","像距和大小都不變"],
     "口訣「物近像遠像變大」：物體越靠近焦點，像跑得越遠，也變得越大。"],
    ["近視眼鏡使用的鏡片是？", "凹透鏡",
     ["凸透鏡","平面鏡","凹面鏡"],
     "近視是影像成在視網膜前面，用凹透鏡先讓光線發散一點，成像就會往後移到視網膜上。"]
  ];
  const it = pick(items);
  return { q:it[0], opts:[it[1], ...it[2]], ans:it[1], why:it[3] };
}

const GENS = [qImage, qWhere, qMag, qIdea];
const BEST_KEY = "kimLensBest";
let quiz = null;

function startQuiz(){
  const qs = shuffle([qImage, qImage, qWhere, qMag, qIdea, pick(GENS)]).map(g => {
    const it = g();
    return { ...it, opts: shuffle([...new Set(it.opts)]) };
  });
  quiz = { qs, i:0, score:0 };
  $("#qStart").classList.add("hidden");
  $("#qBody").classList.remove("hidden");
  showQ();
}
function showQ(){
  const it = quiz.qs[quiz.i];
  $("#qBody").innerHTML =
    `<div class="q-num">第 ${quiz.i+1} / ${quiz.qs.length} 題　目前 ${quiz.score} 分</div>
     <div class="q-text">${it.q}</div>
     <div id="opts">${it.opts.map((o,i) => `<button class="opt" data-i="${i}">${o}</button>`).join("")}</div>
     <div id="fb"></div>`;
  $$("#opts .opt").forEach(b => b.onclick = () => answer(+b.dataset.i));
}
function answer(i){
  const it = quiz.qs[quiz.i], chosen = it.opts[i], ok = chosen === it.ans;
  if (ok) quiz.score++;
  $$("#opts .opt").forEach((b, j) => {
    b.disabled = true;
    if (it.opts[j] === it.ans) b.classList.add("correct");
    else if (j === i) b.classList.add("wrong");
  });
  $("#fb").innerHTML =
    `<div class="explain ${ok ? "good" : "bad"}">${ok ? "✅ 答對了！" : "❌ 正確答案：" + it.ans}<br>${it.why}</div>
     <button class="btn primary" id="next">${quiz.i + 1 < quiz.qs.length ? "下一題" : "看結果"}</button>`;
  $("#next").onclick = () => {
    quiz.i++;
    if (quiz.i < quiz.qs.length) showQ(); else finishQuiz();
  };
}
function finishQuiz(){
  const n = quiz.qs.length, pct = Math.round(quiz.score / n * 100);
  let best = 0;
  try { best = +localStorage.getItem(BEST_KEY) || 0; } catch(e){}
  if (pct > best){ best = pct; try { localStorage.setItem(BEST_KEY, pct); } catch(e){} }
  $("#qBody").innerHTML =
    `<div class="score-big">${quiz.score} / ${n}</div>
     <div class="score-sub">${pct >= 80 ? "很不錯，透鏡成像你掌握住了！" : "再回上面拖拖看光學圖，然後重考一次 💪"}
       <br>最佳成績 ${best} 分</div>
     <button class="btn primary" id="again">再考一次</button>`;
  $("#again").onclick = startQuiz;
}
$("#qGo").onclick = startQuiz;
try {
  const b = +localStorage.getItem(BEST_KEY) || 0;
  if (b) $("#qBest").textContent = "最佳成績 " + b + " 分";
} catch(e){}
})();

// 上課投影片內容。單字頁由 SCHOOL_UNITS 的單字表自動產生，避免資料重複。
(function(){
  const UNITS = window.SCHOOL_UNITS || [];
  const byId = id => UNITS.find(u => u.id === id) || {words:[]};
  const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

  // 例句「English. 中文。」拆成兩段
  function splitEx(ex){
    const m = String(ex || "").match(/^(.*?)\s*([一-鿿，。！？].*)$/);
    return m ? [m[1], m[2]] : [ex || "", ""];
  }

  // 單張單字卡
  function wordSlide(w){
    const [en, zh, pos, ex, kk] = w;
    const [exEn, exZh] = splitEx(ex);
    return {html:
      `<div class="s-word s-center" data-autosay="${esc(en)}">
        <div class="en" data-say="${esc(en)}">${esc(en)}</div>
        ${kk ? `<div class="kk">[${esc(kk)}]</div>` : ""}
        <div><span class="pos">${esc(pos)}</span></div>
        <div class="zh">${esc(zh)}</div>
        <div><button class="say" data-say="${esc(en)}">🔊 再唸一次</button></div>
        ${exEn ? `<div class="ex" data-say="${esc(exEn)}">
          <b>${esc(exEn)}</b><span>${esc(exZh)}</span></div>` : ""}
      </div>`};
  }

  // 一組單字的總覽
  function groupSlide(title, ws){
    return {toc: `單字：${title}`, html:
      `<div class="s-kicker">VOCABULARY</div>
       <div class="s-h2">${esc(title)}（${ws.length} 個字）</div>
       <div class="s-grid">${ws.map(w =>
         `<div data-say="${esc(w[0])}"><b>${esc(w[0])}</b><span>${esc(w[1])}</span></div>`).join("")}</div>
       <div class="s-tip">💡 點任何一個字都可以聽發音，接下來一個一個看。</div>`};
  }

  // 一組 = 總覽 + 每個字一張
  function group(unitId, title, from, to){
    const ws = byId(unitId).words.slice(from, to);
    return [groupSlide(title, ws)].concat(ws.map(wordSlide));
  }

  function dialogue(title, note, lines){
    return {toc: title, html:
      `<div class="s-kicker">DIALOGUE</div>
       <div class="s-h2">${esc(title)}</div>
       <div class="s-lead" style="font-size:.95rem">${esc(note)}</div>
       <div class="s-dlg">${lines.map(([who, en, zh]) =>
         `<div class="s-line"><span class="s-who">${esc(who)}</span>
           <span class="s-say" data-say="${esc(en.replace(/<\/?b>/g,""))}">${en}
           <span class="zh">${esc(zh)}</span></span></div>`).join("")}</div>
       <div class="s-tip">💡 點任何一句都可以聽整句發音。</div>`};
  }

  function quiz(q, opts, ansKey, exp){
    return `<div class="s-quiz" data-ans="${ansKey}">
      <div class="qq">${q}</div>
      ${opts.map(([k, t]) => `<button class="s-opt" data-k="${k}">(${k}) ${t}</button>`).join("")}
      <div class="s-ans">✅ 答案：(${ansKey})　${exp}</div>
    </div>`;
  }

  // ================= Lesson 1 =================
  const s1 = [
    {toc:"封面", html:
      `<div class="s-center" style="text-align:center">
        <div class="s-kicker">LESSON 1</div>
        <div class="s-h1">Who's That<br>Young Man?</div>
        <div class="s-lead">那位年輕男子是誰？</div>
        <div class="s-tip" style="text-align:left">左右滑動換頁，或用下面的按鈕。<br>右上角「目錄」可以直接跳到想看的段落。</div>
      </div>`},
    {toc:"學習目標", html:
      `<div class="s-kicker">GOALS</div>
       <div class="s-h2">這一課要學會什麼</div>
       <ul class="s-list">
         <li>用 <b>be 動詞</b>的直述句、Yes / No 問答句，說明<b>職業、身分或物品</b></li>
         <li>用<b>形容詞</b>的問句與回答</li>
         <li>用 <b>Who</b> 的問答，介紹<b>家族關係與職業</b></li>
       </ul>
       <div class="s-tip">課文情境：開學時 Ann 發現有新的體育老師，而 Nick 的姐姐 Bella 是她和 Rita 的英語老師。</div>`},

    ...group("s1", "家庭成員", 0, 10),
    ...group("s1", "描述一個人", 10, 14),
    ...group("s1", "學校生活", 14, 20),
    ...group("s1", "打招呼與對話", 20, 26),
    ...group("s1", "職業與其他", 26, 37),

    dialogue("課文 ①　At school（在學校裡）",
      "開學第一天，Ann 看到一位新老師。", [
      ["Ann", "Good morning, Nick.", "早安，Nick。"],
      ["Nick", "Good morning, Ann.", "早安，Ann。"],
      ["Ann", "Nick, who's that young man? <b>He's tall and handsome.</b>", "Nick，那位年輕男子是誰？他好高又好帥。"],
      ["Nick", "He's our new PE teacher.", "他是我們新的體育老師。"],
      ["Ann", "Really?", "真的嗎？"],
      ["Nick", "<b>Yes, he's Bella's friend, and his name is Scott.</b>", "是的，他是 Bella 的朋友，而且他的名字是 Scott。"]
    ]),
    dialogue("課文 ②　In the classroom（在教室裡）",
      "Ann 介紹她的堂弟 Nick 給 Rita 認識。", [
      ["Rita", "<b>Ann, we're in the same class again!</b>", "Ann，我們又在同一班了！"],
      ["Ann", "Yeah, it's great! Hi, Rita. <b>This is Nick.</b> He's my cousin. He's in Class 701.", "對呀，太棒了！嗨，Rita。這是 Nick。他是我的堂弟。他念 701 班。"],
      ["Rita", "Nice to meet you, Nick. I'm Rita.", "很高興認識你，Nick。我是 Rita。"],
      ["Nick", "<b>Nice to meet you, too, Rita.</b>", "我也很高興認識妳，Rita。"],
      ["Ann", "Hey, Rita. <b>Good news.</b> Bella is our English teacher!", "嘿，Rita。好消息。Bella 是我們的英語老師！"],
      ["Nick", "Oh, no. That's not good.", "噢，不。那不太好。"],
      ["Ann", "<b>What's the problem?</b> She's a great teacher.", "有什麼問題嗎？她是個很棒的老師。"],
      ["Nick", "Well... she's a strict teacher, too.", "嗯……她也是個很嚴格的老師。"],
      ["Bella", "Nick!", "Nick！"]
    ]),

    {toc:"文法①　be 動詞直述句", html:
      `<div class="s-kicker">GRAMMAR 1</div>
       <div class="s-h2">be 動詞的直述句（單數）</div>
       <div class="s-lead">句型：主詞 ＋ be 動詞 ＋ a(n) ＋ 單數名詞</div>
       <div class="s-scroll"><table class="s-table">
         <tr><th>主詞</th><th>be 動詞</th><th>例句</th></tr>
         <tr><td>I</td><td><b>am</b></td><td>I <b>am</b> a student.</td></tr>
         <tr><td>You</td><td><b>are</b></td><td>You <b>are</b> a student.</td></tr>
         <tr><td>He / She / It / Ann</td><td><b>is</b></td><td>She <b>is</b> a nurse.</td></tr>
       </table></div>
       <div class="s-eg" data-say="He is a cook. He is not a cook.">
         <div class="q">否定句：be 動詞後面加 not</div>
         <div class="a">He <b>is not</b> a cook.　→　He <b>isn't</b> a cook.</div>
       </div>
       <div class="s-tip">💡 主詞要用主格：I, you, he, she, it。</div>`},

    {toc:"文法①　Yes/No 問句與簡答", html:
      `<div class="s-kicker">GRAMMAR 1</div>
       <div class="s-h2">Yes / No 問句與簡答</div>
       <div class="s-lead">把 be 動詞移到句首，句點改成問號。</div>
       <div class="s-eg" data-say="He is a cook. Is he a cook?">
         He <u>is</u> a cook.　→　<u>Is</u> he a cook?</div>
       <div class="s-scroll"><table class="s-table">
         <tr><th>問句</th><th>肯定簡答</th><th>否定簡答</th></tr>
         <tr><td>Are you …?</td><td>Yes, I <b>am</b>.</td><td>No, I'm not.</td></tr>
         <tr><td>Is he / she / it …?</td><td>Yes, he <b>is</b>.</td><td>No, he isn't.</td></tr>
       </table></div>
       <div class="s-warn">⚠️ 三個最容易錯的地方<br>
         ① 簡答要用<b>代名詞</b>，不能用人名（✗ Yes, Nick is.）<br>
         ② 肯定簡答<b>不可以縮寫</b>（✗ Yes, I'm. ✗ Yes, he's.）<br>
         ③ <b>am not 不能縮寫</b>，所以是 No, I'm not.（沒有 amn't）</div>`},

    {toc:"文法②　a / an", html:
      `<div class="s-kicker">GRAMMAR 2</div>
       <div class="s-h2">不定冠詞 a / an</div>
       <div class="s-lead">加在單數可數名詞前面，表示「一個」。</div>
       <div class="s-scroll"><table class="s-table">
         <tr><th>用法</th><th>例子</th></tr>
         <tr><td>字首<b>子音</b>發音 → <b>a</b></td><td data-say="a book, a dog, a pen, a table, a watch">a book, a dog, a pen, a table, a watch</td></tr>
         <tr><td>字首<b>母音</b>發音 → <b>an</b></td><td data-say="an apple, an eraser, an igloo, an ox, an umbrella">an apple, an eraser, an igloo, an ox, an umbrella</td></tr>
       </table></div>
       <div class="s-warn">⚠️ a / an 不能和所有格一起用<br>
         （○）Fred is <b>my</b> cousin.　（✗）Fred is my <b>a</b> cousin.</div>
       <div class="s-tip">💡 看的是<b>發音</b>不是字母：an <b>h</b>our（h 不發音）、a <b>u</b>niversity（發 ju 音）。</div>`},

    {toc:"文法②　縮寫", html:
      `<div class="s-kicker">GRAMMAR 2</div>
       <div class="s-h2">人稱代名詞與 be 動詞的縮寫</div>
       <div class="s-scroll"><table class="s-table">
         <tr><th>肯定縮寫</th><th>否定縮寫</th></tr>
         <tr><td>I am → <b>I'm</b></td><td>I am not → <b>I'm not</b></td></tr>
         <tr><td>you are → <b>you're</b></td><td>you're not ／ you aren't</td></tr>
         <tr><td>he is → <b>he's</b></td><td>he's not ／ he isn't</td></tr>
         <tr><td>she is → <b>she's</b></td><td>she's not ／ she isn't</td></tr>
         <tr><td>it is → <b>it's</b></td><td>it's not ／ it isn't</td></tr>
       </table></div>
       <div class="s-warn">⚠️ <b>it's</b> ＝ it is；<b>its</b> ＝ 它的。這兩個最常混淆！</div>`},

    {toc:"文法③　形容詞", html:
      `<div class="s-kicker">GRAMMAR 3</div>
       <div class="s-h2">形容詞的用法</div>
       <div class="s-lead">形容詞用來描述名詞，中文是「……的」。</div>
       <div class="s-scroll"><table class="s-table">
         <tr><th>類型</th><th>例子</th></tr>
         <tr><td>數量</td><td>three puppies 三隻小狗</td></tr>
         <tr><td>顏色</td><td>a green hat 一頂綠色的帽子</td></tr>
         <tr><td>尺寸大小</td><td>a short player 一位矮小的球員</td></tr>
         <tr><td>新舊年齡</td><td>a young teacher 一位年輕的老師</td></tr>
         <tr><td>觀察感受</td><td>a happy student 一位快樂的學生</td></tr>
       </table></div>
       <div class="s-eg">
         <div class="q">形容詞放的位置有兩個</div>
         <div class="a" data-say="The book is new. She is a beautiful girl.">
           ① be 動詞之後：The book <b>is new</b>.<br>
           ② 名詞之前：She is a <b>beautiful girl</b>.</div>
       </div>
       <div class="s-tip">💡 形容詞字首是母音發音時，冠詞要用 an：It's <b>an old</b> car.</div>`},

    {toc:"文法④　Who 的問答", html:
      `<div class="s-kicker">GRAMMAR 4</div>
       <div class="s-h2">Who 的問答</div>
       <div class="s-lead">who 用來問「姓名」或「關係」。<br>句型：<b>Who ＋ be 動詞 ＋ 主詞?</b></div>
       <div class="s-eg" data-say="Who is he? He is Timothy.">
         <div class="q">回答姓名</div>
         <div class="a">A: <b>Who is</b> he?　B: He <b>is Timothy</b>.</div>
       </div>
       <div class="s-eg" data-say="Who is that girl? She is Mr. Chen's daughter.">
         <div class="q">回答關係</div>
         <div class="a">A: <b>Who is</b> that girl?　B: She <b>is Mr. Chen's daughter</b>.</div>
       </div>
       <div class="s-tip">💡 課文裡就出現過：Nick, <b>who's</b> that young man? — He's our new PE teacher.</div>`},

    {toc:"隨堂練習", html:
      `<div class="s-kicker">PRACTICE</div>
       <div class="s-h2">隨堂練習（點選項看答案）</div>
       ${quiz("A: Are you Nick's mom?　B: No, ______.",
         [["A","I amn't"],["B","I'm not"],["C","I am"],["D","I'm"]], "B",
         "am not 不能縮寫成 amn't，否定簡答要說 No, I'm not.")}
       ${quiz("A: Is it your bag?　B: Yes, ______.",
         [["A","it's"],["B","its"],["C","it is"],["D","this is"]], "C",
         "肯定簡答不可以縮寫，而且要用代名詞 it。")}`},
    {html:
      `<div class="s-kicker">PRACTICE</div>
       <div class="s-h2">隨堂練習</div>
       ${quiz("A: Is Mr. Lin a farmer?　B: ______",
         [["A","Yes, he is."],["B","Yes, he is a father."],["C","No, he's a farmer."],["D","No, he isn't a teacher."]], "A",
         "簡答要用代名詞，而且答句內容要和問句相符。")}
       ${quiz("It's ______ old car.",
         [["A","a"],["B","an"],["C","the"],["D","不用冠詞"]], "B",
         "old 的字首是母音發音，冠詞用 an。")}`},
    {html:
      `<div class="s-kicker">PRACTICE</div>
       <div class="s-h2">隨堂練習</div>
       ${quiz("A: Who is that girl?　B: ______",
         [["A","She is beautiful."],["B","Yes, she is."],["C","She is Mr. Chen's daughter."],["D","He is my cousin."]], "C",
         "Who 問的是姓名或關係，要回答她是誰。")}
       ${quiz("She is ______ .（她是個漂亮的女生）",
         [["A","beautiful a girl"],["B","a beautiful girl"],["C","a girl beautiful"],["D","beautiful girl"]], "B",
         "形容詞放名詞前面，單數可數名詞前要加 a。")}`},

    {toc:"結束", html:
      `<div class="s-center" style="text-align:center">
        <div style="font-size:3.4rem">🎉</div>
        <div class="s-h1" style="font-size:1.7rem">Lesson 1 結束</div>
        <div class="s-lead">回到單元頁可以練字卡、考單字，<br>或做這一課的文法練習題。</div>
      </div>`}
  ];

  // ================= Lesson 2 =================
  const s2 = [
    {toc:"封面", html:
      `<div class="s-center" style="text-align:center">
        <div class="s-kicker">LESSON 2</div>
        <div class="s-h1">What Are<br>These?</div>
        <div class="s-lead">這些是什麼？</div>
        <div class="s-tip" style="text-align:left">左右滑動換頁。右上角「目錄」可以跳到想看的段落。</div>
      </div>`},
    {toc:"學習目標", html:
      `<div class="s-kicker">GOALS</div>
       <div class="s-h2">這一課要學會什麼</div>
       <ul class="s-list">
         <li>用 <b>this / that</b> 描述<b>單數</b>物品的遠近</li>
         <li>用 <b>these / those</b> 描述<b>複數</b>物品的遠近</li>
         <li>用疑問詞 <b>what</b> 詢問物品</li>
         <li><b>單數與複數人稱代名詞</b>的用法</li>
         <li><b>單數與複數名詞所有格</b>的用法</li>
       </ul>
       <div class="s-tip">課文情境：Bella 和 Scott 在談論有關生肖的話題。</div>`},

    ...group("s2", "十二生肖與動物", 0, 8),
    ...group("s2", "生肖話題", 8, 20),
    ...group("s2", "描述個性", 20, 27),
    ...group("s2", "其他常用字", 27, 38),

    dialogue("課文　In a movie theater（在電影院裡）",
      "Bella 和 Scott 看到一排娃娃，聊起十二生肖。", [
      ["Bella", "<b>These dolls are cute.</b>", "這些娃娃好可愛。"],
      ["Scott", "<b>What are these?</b> Hey, aren't they the Chinese zodiac animal signs?", "這些是什麼？嘿，它們不是中國十二生肖嗎？"],
      ["Bella", "No, they aren't. The Chinese zodiac animal signs are the rat, ox, tiger, rabbit, dragon, snake, horse, goat, monkey, rooster, dog, and pig.", "不，它們不是。中國十二生肖是鼠、牛、虎、兔、龍、蛇、馬、羊、猴、雞、狗、豬。"],
      ["Scott", "Wow! What's my animal sign?", "哇！我的生肖是什麼呢？"],
      ["Bella", "Your birth year is 2000. You're a dragon. <b>A dragon is smart and energetic.</b>", "你的出生年是 2000 年。你屬龍。龍是聰明且充滿活力的。"],
      ["Scott", "That's true. What's your animal sign, Bella?", "那是真的。妳的生肖是什麼，Bella？"],
      ["Bella", "My birth year is 1999. I'm a rabbit. A rabbit is nice and warm.", "我的出生年是 1999 年。我屬兔。兔是和善且溫暖的。"],
      ["Scott", "No wonder you are a people person. <b>What about Abby the pig?</b>", "難怪妳是個人緣好的人。那麼小豬 Abby 呢？"],
      ["Bella", "Her birth year is 2024. She's a dragon, too.", "她的出生年是 2024 年。她也屬龍。"],
      ["Scott", "No wonder she's smart! Ha ha!", "難怪她很聰明！哈哈！"]
    ]),

    {toc:"文法①　this / that / these / those", html:
      `<div class="s-kicker">GRAMMAR 1</div>
       <div class="s-h2">指示詞：看「遠近」和「單複數」</div>
       <div class="s-scroll"><table class="s-table">
         <tr><th>距離</th><th>單數</th><th>複數</th></tr>
         <tr><td>近（這）</td><td><b>this</b> 這個</td><td><b>these</b> 這些</td></tr>
         <tr><td>遠（那）</td><td><b>that</b> 那個</td><td><b>those</b> 那些</td></tr>
       </table></div>
       <div class="s-eg" data-say="This is a cat. These are cats.">
         <div class="q">be 動詞也要跟著變</div>
         <div class="a">This <b>is</b> a cat.　→　These <b>are</b> cats.<br>
           That <b>is</b> a dog.　→　Those <b>are</b> dogs.</div>
       </div>`},

    {toc:"文法①　問答句", html:
      `<div class="s-kicker">GRAMMAR 1</div>
       <div class="s-h2">Is this…? / Are these…?</div>
       <div class="s-scroll"><table class="s-table">
         <tr><th></th><th>單數</th><th>複數</th></tr>
         <tr><td>問句</td><td>Is this / that a cat?</td><td>Are these / those cats?</td></tr>
         <tr><td>肯定簡答</td><td>Yes, <b>it is</b>.</td><td>Yes, <b>they are</b>.</td></tr>
         <tr><td>否定簡答</td><td>No, it isn't.</td><td>No, they aren't.</td></tr>
       </table></div>
       <div class="s-eg" data-say="Is this a cat? No, it isn't. It's a tiger.">
         A: Is this a cat?<br>
         B1: Yes, it is (a cat).<br>
         B2: No, it isn't. ／ No, it's not a cat. ／ <b>No, it's a tiger.</b></div>
       <div class="s-warn">⚠️ 簡答的代名詞：單數一定用 <b>it</b>，複數一定用 <b>they</b>。<br>
         肯定簡答<b>不可以縮寫</b>（✗ Yes, it's. ✗ Yes, they're.）</div>`},

    {toc:"文法①　What 問句", html:
      `<div class="s-kicker">GRAMMAR 1</div>
       <div class="s-h2">用 What 問「這是什麼」</div>
       <div class="s-scroll"><table class="s-table">
         <tr><th>問句</th><th>答句</th></tr>
         <tr><td>What <b>is</b> this / that / it?</td><td>This / That / <b>It is</b> a picture.</td></tr>
         <tr><td>What <b>are</b> these / those / they?</td><td>These / Those / <b>They are</b> pictures.</td></tr>
       </table></div>
       <div class="s-eg" data-say="What is this? It's a picture. What are those? They're hats.">
         A: What is this?　B: It's a picture.<br>
         A: What are those?　B: They're hats.</div>
       <div class="s-tip">💡 回答不同的東西可以用 and 連接：<br>
         They're my new notebooks <b>and</b> markers.</div>
       <div class="s-warn">⚠️ what is → what's、that is → that's 可以縮寫；<br>
         但 <b>What is it?</b> 和 <b>this is</b> 不可以縮寫。</div>`},

    {toc:"文法②　名詞的複數", html:
      `<div class="s-kicker">GRAMMAR 2</div>
       <div class="s-h2">名詞複數的規則變化</div>
       <div class="s-scroll"><table class="s-table">
         <tr><th>規則</th><th>例子</th></tr>
         <tr><td>直接加 -s</td><td>book → book<b>s</b>；pen → pen<b>s</b></td></tr>
         <tr><td>字尾 s, x, sh, ch → 加 -es</td><td>bus → bus<b>es</b>；box → box<b>es</b>；watch → watch<b>es</b></td></tr>
         <tr><td>子音 + y → 去 y 加 -ies</td><td>baby → bab<b>ies</b>；party → part<b>ies</b></td></tr>
         <tr><td>母音 + y → 直接加 -s</td><td>boy → boy<b>s</b>；day → day<b>s</b></td></tr>
         <tr><td>字尾 f, fe → 去掉加 -ves</td><td>wife → wi<b>ves</b>；leaf → lea<b>ves</b></td></tr>
         <tr><td>單複數同形</td><td>fish → fish；sheep → sheep</td></tr>
       </table></div>`},

    {toc:"文法②　不規則複數與發音", html:
      `<div class="s-kicker">GRAMMAR 2</div>
       <div class="s-h2">不規則變化（要背！）</div>
       <div class="s-grid">
         <div data-say="man, men"><b>man → men</b><span>男人</span></div>
         <div data-say="woman, women"><b>woman → women</b><span>女人</span></div>
         <div data-say="child, children"><b>child → children</b><span>小孩</span></div>
         <div data-say="mouse, mice"><b>mouse → mice</b><span>老鼠</span></div>
         <div data-say="foot, feet"><b>foot → feet</b><span>腳</span></div>
         <div data-say="tooth, teeth"><b>tooth → teeth</b><span>牙齒</span></div>
         <div data-say="ox, oxen"><b>ox → oxen</b><span>公牛</span></div>
         <div data-say="person, people"><b>person → people</b><span>人</span></div>
       </div>
       <div class="s-h2" style="margin-top:18px">-s / -es 怎麼唸</div>
       <div class="s-scroll"><table class="s-table">
         <tr><th>發音</th><th>時機</th><th>例子</th></tr>
         <tr><td>[s]</td><td>原字尾是無聲子音</td><td data-say="cups">cups</td></tr>
         <tr><td>[z]</td><td>原字尾是有聲子音或母音</td><td data-say="pens">pens</td></tr>
         <tr><td>[ɪz]</td><td>原字尾發 s, z, tʃ, dʒ, ʃ, ʒ</td><td data-say="watches">watches</td></tr>
       </table></div>`},

    {toc:"文法③　人稱代名詞與所有格", html:
      `<div class="s-kicker">GRAMMAR 3</div>
       <div class="s-h2">人稱代名詞的主格與所有格</div>
       <div class="s-scroll"><table class="s-table">
         <tr><th colspan="2">單數</th><th colspan="2">複數</th></tr>
         <tr><th>主格</th><th>所有格</th><th>主格</th><th>所有格</th></tr>
         <tr><td>I</td><td><b>my</b></td><td>we</td><td><b>our</b></td></tr>
         <tr><td>you</td><td><b>your</b></td><td>you</td><td><b>your</b></td></tr>
         <tr><td>he</td><td><b>his</b></td><td rowspan="3">they</td><td rowspan="3"><b>their</b></td></tr>
         <tr><td>she</td><td><b>her</b></td></tr>
         <tr><td>it</td><td><b>its</b></td></tr>
       </table></div>
       <div class="s-warn">⚠️ <b>its</b>（它的）沒有撇號；<b>it's</b> 是 it is。</div>`},

    {toc:"文法③　名詞的所有格", html:
      `<div class="s-kicker">GRAMMAR 3</div>
       <div class="s-h2">名詞的所有格</div>
       <div class="s-scroll"><table class="s-table">
         <tr><th>類型</th><th>做法</th><th>例子</th></tr>
         <tr><td>單數名詞</td><td>加 <b>'s</b></td><td>Sam → Sam<b>'s</b> toy</td></tr>
         <tr><td>複數（字尾已有 s）</td><td>只加 <b>'</b></td><td>the girls → the girls<b>'</b> books</td></tr>
         <tr><td>不規則複數</td><td>加 <b>'s</b></td><td>the people → the people<b>'s</b> seats</td></tr>
       </table></div>
       <div class="s-eg">
         <div class="q">共同擁有 vs 各自擁有</div>
         <div class="a">Jack <b>and Ann's</b> dad <b>is</b> tall.<br>
           → 兩人<b>共同</b>的爸爸（只有一位）<br><br>
           Jack<b>'s and Ann's</b> dad<b>s are</b> tall.<br>
           → 兩人<b>各自</b>的爸爸（兩位，後面用複數）</div>
       </div>`},

    {toc:"隨堂練習", html:
      `<div class="s-kicker">PRACTICE</div>
       <div class="s-h2">隨堂練習（點選項看答案）</div>
       ${quiz("A: What ______ it?　B: A ruler.",
         [["A","is"],["B","are"],["C","am"],["D","be"]], "A",
         "it 是單數，用 What is it?（這句不能縮寫成 What's it?）")}
       ${quiz("A: Is that an elephant?　B: No, ______ isn't.",
         [["A","that"],["B","this"],["C","it"],["D","they"]], "C",
         "簡答的代名詞一定要用 it。")}`},
    {html:
      `<div class="s-kicker">PRACTICE</div>
       <div class="s-h2">隨堂練習</div>
       ${quiz("A: What's this?　B: ______",
         [["A","Mr. Lin."],["B","My sister."],["C","An eraser."],["D","Yes, it is."]], "C",
         "What's this? 問的是物品，要回答東西。")}
       ${quiz("______ zebras, not horses.",
         [["A","That is"],["B","They're"],["C","It's"],["D","That's"]], "B",
         "zebras 是複數，主詞要用 They're。")}`},
    {html:
      `<div class="s-kicker">PRACTICE</div>
       <div class="s-h2">隨堂練習</div>
       ${quiz("These ______ eyes are big, and their legs are long.",
         [["A","girl'"],["B","girls'"],["C","girls's"],["D","girls"]], "B",
         "複數 girls 字尾已有 s，所有格只加一撇。")}
       ${quiz("______ new car is cool. I like it.（Ivan 和 Lily 共有的車）",
         [["A","They"],["B","Ivan and Lily"],["C","Ivan's and Lily's"],["D","Ivan and Lily's"]], "D",
         "共同擁有只在最後一個名字加 's。")}`},
    {html:
      `<div class="s-kicker">PRACTICE</div>
       <div class="s-h2">隨堂練習</div>
       ${quiz("Ella and Tina are twins, ______ they are very different.",
         [["A","and"],["B","but"],["C","or"],["D","so"]], "B",
         "前後語意相反，用 but。")}
       ${quiz("Kerr's and John's wives ______ cooks.",
         [["A","is"],["B","are"],["C","am"],["D","be"]], "B",
         "各自的太太是兩位，主詞是複數，動詞用 are。")}`},

    {toc:"結束", html:
      `<div class="s-center" style="text-align:center">
        <div style="font-size:3.4rem">🎉</div>
        <div class="s-h1" style="font-size:1.7rem">Lesson 2 結束</div>
        <div class="s-lead">回到單元頁可以練字卡、考單字，<br>或做這一課的文法練習題。</div>
      </div>`}
  ];

  window.SLIDE_DECKS = {
    s1: {title:"Lesson 1｜Who's That Young Man?", slides:s1},
    s2: {title:"Lesson 2｜What Are These?", slides:s2}
  };
})();

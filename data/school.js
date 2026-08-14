// 學校講義 Unit 1～6（依 Kin 這學期的課本內容）
// ready:true 代表資料已匯入，網站上才會開放點選。
// words 格式：[英文, 中文, 詞性, 例句（英＋中）, KK音標]
// grammar 是文法重點（HTML）；bankId 有值代表有文法練習題（data/grammar/<id>.js）
window.SCHOOL_UNITS = [
{id:"s1", no:1, name:"Lesson 1", icon:"1️⃣", topic:"Who's That Young Man?", ready:true,
 bankId:"s1", deck:"s1",
 words:[
["family","家人；家庭","名","This is a photo of my family. 這是我家人的照片。","ˋfæməlɪ"],
["husband","丈夫","名","Her husband is a cook. 她的丈夫是廚師。","ˋhʌzbənd"],
["wife","妻子","名","Mr. Lin's wife is a nurse. 林先生的太太是護理師。","waɪf"],
["uncle","叔（伯）父；姑（姨）丈；舅舅","名","My uncle is a farmer. 我叔叔是農夫。","ˋʌŋkl"],
["aunt","嬸嬸；伯母；姑（姨）媽；舅媽","名","My aunt is a doctor. 我阿姨是醫生。","ænt"],
["cousin","堂（表）兄弟姐妹","名","He's my cousin. 他是我的堂弟。","ˋkʌzn"],
["son","兒子","名","Their son is in Class 701. 他們的兒子在 701 班。","sʌn"],
["daughter","女兒","名","She is Mr. Chen's daughter. 她是陳先生的女兒。","ˋdɔtɚ"],
["parent","雙親之一","名","My parents are teachers. 我的父母是老師。","ˋpɛrənt"],
["child","孩子（複數 children）","名","That child is very cute. 那個孩子很可愛。","tʃaɪld"],
["young","年輕的","形","He's a young man. 他是個年輕的男人。","jʌŋ"],
["man","男人（複數 men）","名","Who's that young man? 那位年輕男子是誰？","mæn"],
["handsome","英俊的","形","He's tall and handsome. 他又高又帥。","ˋhænsəm"],
["our","我們的","限","He's our new PE teacher. 他是我們新的體育老師。","aʊr"],
["PE","體育","名","We have PE on Monday. 我們星期一有體育課。","ˋpiˋi"],
["really","真地","副","Really? That's great! 真的嗎？太棒了！","ˋrɪəlɪ"],
["classroom","教室","名","Our classroom is very clean. 我們的教室很乾淨。","ˋklæsˏrum"],
["same","一樣的","形","We're in the same class again! 我們又在同一班了！","sem"],
["class","班級；課程","名","He's in Class 701. 他念 701 班。","klæs"],
["again","再一次","副","Say it again, please. 請再說一次。","əˋgɛn"],
["Nice to meet you.","很高興認識你。","片","Nice to meet you, Rita. 很高興認識妳，Rita。","naɪs tə ˋmit ju"],
["too","也；太","副","Nice to meet you, too. 我也很高興認識你。","tu"],
["news","消息；新聞","名","Good news! Bella is our English teacher. 好消息！Bella 是我們的英語老師。","njuz"],
["problem","問題","名","What's the problem? 有什麼問題嗎？","ˋprɑbləm"],
["strict","嚴格的","形","She's a strict teacher. 她是個嚴格的老師。","strɪkt"],
["junior high school","國民中學","名","I'm a junior high school student. 我是國中生。","ˏdʒunjɚ ˋhaɪ ˏskul"],
["warm","溫暖的","形","She is a warm person. 她是個溫暖的人。","wɔrm"],
["farmer","農夫","名","Is Mr. Lin a farmer? 林先生是農夫嗎？","ˋfɑrmɚ"],
["cook","廚師；煮","名/動","He is a cook. 他是廚師。","kuk"],
["nurse","護理師；護士","名","Is your mother a nurse? 你媽媽是護理師嗎？","nɝs"],
["beautiful","漂亮的；美麗的","形","She is a beautiful girl. 她是個漂亮的女生。","ˋbjutəfəl"],
["woman","女人（複數 women）","名","That woman is my aunt. 那位女士是我阿姨。","ˋwʊmən"],
["doctor","醫生","名","No, she's not. She's a doctor. 不，她不是。她是醫生。","ˋdɑktɚ"],
["senior high school","高級中學","名","My brother is in senior high school. 我哥哥念高中。","ˏsinjɚ ˋhaɪ ˏskul"],
["pet","寵物","名","Is that dog your pet? 那隻狗是你的寵物嗎？","pɛt"],
["cute","可愛的","形","Your puppy is so cute. 你的小狗好可愛。","kjut"],
["nice","好的；好心的","形","Jack is a nice boy. Jack 是個好男孩。","naɪs"]
 ],
 grammar:`
<h3>一、be 動詞的直述句與 Yes/No 問句（單數）</h3>
<p><b>1. 直述句</b>（描述職業／身分／物品）：主詞 ＋ be 動詞 ＋ a(n) ＋ 單數名詞。</p>
<table><tr><th>主詞</th><th>be 動詞</th><th>例句</th></tr>
<tr><td>I</td><td><b>am</b></td><td>I <b>am</b> a student.</td></tr>
<tr><td>You</td><td><b>are</b></td><td>You <b>are</b> a student.</td></tr>
<tr><td>He / She / It / Ann</td><td><b>is</b></td><td>She <b>is</b> a nurse. ／ It <b>is</b> a pencil.</td></tr></table>
<p><b>2. 否定句</b>：在 be 動詞後面加 <b>not</b>。<br>He is <b>not</b> a cook.（他不是廚師。）</p>
<p><b>3. Yes / No 問句</b>：把 be 動詞移到句首，句點改問號。<br>
He <u>is</u> a cook. → <u>Is</u> he a cook?</p>
<table><tr><th>問句</th><th>肯定簡答</th><th>否定簡答</th></tr>
<tr><td>Am I …?</td><td>Yes, you are.</td><td>No, you aren't.</td></tr>
<tr><td>Are you …?</td><td>Yes, I am.</td><td>No, I'm not.</td></tr>
<tr><td>Is he / she / it …?</td><td>Yes, he is.</td><td>No, he isn't.</td></tr></table>
<div class="tip">💡 簡答時主詞要用<b>代名詞</b>，不可以直接用人名。<br>
肯定簡答<b>不可以縮寫</b>：Yes, I am.（✓）／ Yes, I'm.（✗）<br>
否定簡答兩種縮寫都可以：No, he's not. ＝ No, he isn't.<br>
只有 am not 不能縮寫，所以是 No, I'm not.</div>

<h3>二、不定冠詞 a / an</h3>
<p>加在<b>單數可數名詞</b>前面，指第一次提到或不特定的「一個」。</p>
<table><tr><th>用法</th><th>例子</th></tr>
<tr><td>名詞字首<b>子音</b>發音 → <b>a</b></td><td>a book, a dog, a pen, a table, a watch</td></tr>
<tr><td>名詞字首<b>母音</b>發音 → <b>an</b></td><td>an apple, an eraser, an igloo, an ox, an umbrella</td></tr></table>
<div class="tip">💡 a / an 不能和所有格一起修飾同一個名詞。<br>
（○）Fred is my cousin.　（✗）Fred is my a cousin.</div>

<h3>三、人稱代名詞與 be 動詞的縮寫</h3>
<table><tr><th>肯定縮寫</th><th>否定縮寫</th></tr>
<tr><td>I am → <b>I'm</b></td><td>I am not → <b>I'm not</b></td></tr>
<tr><td>you are → <b>you're</b></td><td>you are not → you're not / you aren't</td></tr>
<tr><td>he is → <b>he's</b></td><td>he is not → he's not / he isn't</td></tr>
<tr><td>she is → <b>she's</b></td><td>she is not → she's not / she isn't</td></tr>
<tr><td>it is → <b>it's</b></td><td>it is not → it's not / it isn't</td></tr></table>
<div class="tip">💡 <b>it's</b> 是 it is 的縮寫，<b>its</b> 是「它的」，兩個不要搞混！</div>

<h3>四、形容詞的用法</h3>
<p>形容詞用來描述或修飾名詞，中文翻成「……的」。</p>
<table><tr><th>類型</th><th>例字</th><th>例句</th></tr>
<tr><td>數量</td><td>one, two, three…</td><td>three puppies 三隻小狗</td></tr>
<tr><td>顏色</td><td>red, blue, green…</td><td>a green hat 一頂綠色的帽子</td></tr>
<tr><td>尺寸大小</td><td>long, short, tall, small…</td><td>a short player 一位矮小的球員</td></tr>
<tr><td>新舊年齡</td><td>new, old, young…</td><td>a young teacher 一位年輕的老師</td></tr>
<tr><td>觀察感受</td><td>nice, beautiful, happy…</td><td>a happy student 一位快樂的學生</td></tr></table>
<p><b>形容詞放的位置有兩個：</b></p>
<p>① 放在 <b>be 動詞之後</b>：主詞＋be 動詞＋(not)＋形容詞<br>
The book is <b>new</b>.（這本書是新的。）／ I am not <b>happy</b>.（我不開心。）</p>
<p>② 放在 <b>名詞之前</b>：形容詞＋名詞<br>
She is a <b>beautiful</b> girl.（她是個漂亮的女生。）／ The <b>tall</b> boy is my brother.</p>
<div class="tip">💡 若形容詞字首是母音發音，不定冠詞要用 an：It's <b>an old</b> car.（那是一輛舊車。）</div>

<h3>五、Who 的問答</h3>
<p>who 用來問「<b>姓名</b>」或「<b>關係</b>」。</p>
<p>問句句型：<b>Who ＋ be 動詞 ＋ 主詞?</b></p>
<table><tr><th>回答什麼</th><th>句型</th><th>例句</th></tr>
<tr><td>回答姓名</td><td>主詞＋be 動詞＋名字</td><td>A: Who is he?　B: He is Timothy.</td></tr>
<tr><td>回答關係</td><td>主詞＋be 動詞＋所有格＋名詞</td><td>A: Who is that girl?　B: She is Mr. Chen's daughter.</td></tr></table>
<div class="tip">💡 課文例句：Nick, <b>who's</b> that young man? — He's our new PE teacher.</div>`
},
{id:"s2", no:2, name:"Lesson 2", icon:"2️⃣", topic:"What Are These?", ready:true,
 bankId:"s2", deck:"s2",
 words:[
["monkey","猴子","名","The monkey is smart. 那隻猴子很聰明。","ˋmʌŋkɪ"],
["fox","狐狸","名","A fox is clever. 狐狸很聰明。","fɑks"],
["sheep","綿羊（複數形亦為 sheep）","名","Those sheep are white. 那些綿羊是白色的。","ʃip"],
["tiger","老虎","名","No, it's a tiger. 不，牠是老虎。","ˋtaɪgɚ"],
["zebra","斑馬","名","These are zebras, not horses. 這些是斑馬，不是馬。","ˋzibrə"],
["lion","獅子","名","I like bears and lions. 我喜歡熊和獅子。","ˋlaɪən"],
["mouse","老鼠（複數 mice）","名","A mouse is very small. 老鼠很小。","maʊs"],
["bear","熊","名","Bears sleep in winter. 熊冬天睡覺。","bɛr"],
["movie theater","電影院","名","They are in a movie theater. 他們在電影院裡。","ˋmuvɪ ˋθiətɚ"],
["Chinese","中國的；中國人；中文","形/名","These are the Chinese zodiac animal signs. 這些是中國十二生肖。","tʃaɪˋniz"],
["animal","動物","名","What animals do you like? 你喜歡什麼動物？","ˋænəməl"],
["sign","符號","名","What's my animal sign? 我的生肖是什麼？","saɪn"],
["rat","大老鼠","名","The rat is the first animal sign. 鼠是第一個生肖。","ræt"],
["ox","（公）牛（複數 oxen）","名","It is an ox. 牠是一頭牛。","ɑks"],
["rabbit","兔子","名","Rabbits have red eyes. 兔子有紅色的眼睛。","ˋræbɪt"],
["dragon","龍","名","You're a dragon. 你屬龍。","ˋdrægən"],
["snake","蛇","名","Is that a snake? 那是蛇嗎？","snek"],
["horse","馬","名","These are zebras, not horses. 這些是斑馬，不是馬。","hɔrs"],
["goat","山羊","名","A goat is on the hill. 一隻山羊在山丘上。","got"],
["rooster","公雞","名","The rooster wakes us up. 公雞叫我們起床。","ˋrustɚ"],
["smart","聰明的","形","A dragon is smart and energetic. 龍聰明且充滿活力。","smɑrt"],
["energetic","充滿活力的","形","My dog is very energetic. 我的狗充滿活力。","ˏɛnɚˋdʒɛtɪk"],
["true","真的；真實的","形","That's true. 那是真的。","tru"],
["no wonder","難怪","片","No wonder she's smart! 難怪她很聰明！","no ˋwʌndɚ"],
["people","人們（單數 person）","名","Those people are my classmates. 那些人是我的同學。","ˋpipl"],
["What about...?","……怎麼樣？","片","What about Abby the pig? 那麼小豬 Abby 呢？","ˏ(h)wɑt əˋbaʊt"],
["people person","人緣好的人","名","No wonder you are a people person. 難怪妳是個人緣好的人。","ˋpipl ˏpɝsn"],
["picture","照片；圖畫","名","This is a picture of Lily's cousins. 這是 Lily 表親們的照片。","ˋpɪktʃɚ"],
["elephant","大象","名","It's an elephant. 牠是一頭大象。","ˋɛləfənt"],
["or","或者","連","Is John your brother or cousin? John 是你哥哥還是表哥？","ɔr"],
["size","尺寸","名","What size do you wear? 你穿什麼尺寸？","saɪz"],
["different","不同的","形","We are in different classes. 我們在不同班。","ˋdɪfərənt"],
["very","非常","副","They are very different. 他們非常不同。","ˋvɛrɪ"],
["their","他們的；牠們的","限","Their legs are long. 牠們的腿很長。","ðɛr"],
["meter","公尺","名","The pillar is about 1.7 meters tall. 那柱子大約 1.7 公尺高。","ˋmitɚ"],
["but","但是","連","They are twins, but they are very different. 他們是雙胞胎，但非常不同。","bʌt"],
["only","僅僅；只","副","I have only one dollar. 我只有一塊錢。","ˋonlɪ"],
["lifespan","壽命","名","Asian elephants' lifespans are about 60 years. 亞洲象的壽命約 60 年。","ˋlaɪfˏspæn"]
 ],
 grammar:`
<h3>一、指示詞 this / that 及其問答句</h3>
<p>this 和 that 用來指<b>單數</b>名詞，看說話者與物品的<b>距離</b>決定用哪個。</p>
<table><tr><th>距離</th><th>單數</th><th>複數</th></tr>
<tr><td>近（這）</td><td><b>this</b></td><td><b>these</b></td></tr>
<tr><td>遠（那）</td><td><b>that</b></td><td><b>those</b></td></tr></table>
<p><b>Yes / No 問答句型：</b>Is ＋ this / that / it ＋ a / an ＋ 單數名詞?</p>
<table><tr><th></th><th>簡答</th><th>詳答</th></tr>
<tr><td>肯定</td><td>Yes, it is.</td><td>Yes, this / that / it is a(n) ＋ 單數名詞.</td></tr>
<tr><td>否定</td><td>No, it is not.<br>＝ No, it's not.<br>＝ No, it isn't.</td>
<td>① No, it is <b>not</b> a(n) ＋ 名詞.<br>② No, it is a(n) ＋ <b>另一個</b>名詞.</td></tr></table>
<p>例：A: Is this a cat?　B1: Yes, it is (a cat).　B2: No, it isn't. ／ No, it's not a cat. ／ No, it's a tiger.</p>
<div class="tip">💡 簡答時代名詞一定要用 <b>it</b>，而且肯定簡答的 it is <b>不可以縮寫</b>（✗ Yes, it's.）</div>
<p><b>以 what 為首：</b>What ＋ is ＋ this / that / it?　→　答：This / That / It is a(n) ＋ 單數名詞.</p>
<p>例：A: What is this?　B: It's a picture.（它是一張照片。）</p>
<div class="tip">💡 what is → what's、that is → that's 可以縮寫；但 <b>What is it?</b> 和 <b>this is</b> 不可以縮寫。</div>

<h3>二、名詞的複數</h3>
<table><tr><th>規則</th><th>例子</th></tr>
<tr><td>直接加 -s</td><td>book → book<b>s</b>；pen → pen<b>s</b></td></tr>
<tr><td>字尾 -s, -x, -sh, -ch → 加 -es</td><td>bus → bus<b>es</b>；box → box<b>es</b>；watch → watch<b>es</b>；brush → brush<b>es</b></td></tr>
<tr><td>子音 + y → 去 y 加 -ies</td><td>baby → bab<b>ies</b>；party → part<b>ies</b></td></tr>
<tr><td>母音 + y → 直接加 -s</td><td>boy → boy<b>s</b>；day → day<b>s</b></td></tr>
<tr><td>字尾 -f, -fe → 去掉加 -ves</td><td>wife → wi<b>ves</b>；leaf → lea<b>ves</b></td></tr>
<tr><td>單複數同形</td><td>fish → fish；sheep → sheep</td></tr>
<tr><td>不規則變化</td><td>man → <b>men</b>；woman → <b>women</b>；child → <b>children</b>；mouse → <b>mice</b>；
foot → <b>feet</b>；tooth → <b>teeth</b>；ox → <b>oxen</b>；person → <b>people</b></td></tr></table>
<p><b>-s / -es 的發音：</b></p>
<table><tr><th>發音</th><th>時機</th><th>例子</th></tr>
<tr><td>[s]</td><td>原字尾是無聲子音</td><td>cups [kʌps]</td></tr>
<tr><td>[z]</td><td>原字尾是有聲子音或母音</td><td>pens [pɛnz]</td></tr>
<tr><td>[ɪz]</td><td>原字尾發 s, z, tʃ, dʒ, ʃ, ʒ</td><td>watches [ˋwɑtʃɪz]</td></tr></table>

<h3>三、指示詞 these / those 及其問答句</h3>
<p>these 和 those 指<b>複數</b>名詞。近者用 these，遠者用 those。</p>
<p><b>Yes / No 問答句型：</b>Are ＋ these / those / they ＋ 複數名詞?</p>
<table><tr><th></th><th>簡答</th><th>詳答</th></tr>
<tr><td>肯定</td><td>Yes, they are.</td><td>Yes, these / those / they are ＋ 複數名詞.</td></tr>
<tr><td>否定</td><td>No, they are not.<br>＝ No, they're not.<br>＝ No, they aren't.</td>
<td>① No, they are <b>not</b> ＋ 名詞.<br>② No, they are ＋ <b>另一種</b>名詞.</td></tr></table>
<p>例：A: Are those pencils?　B1: Yes, they are (pencils).　B2: No, they aren't pencils. ／ No, they're pens.</p>
<div class="tip">💡 簡答時代名詞一定要用 <b>they</b>，肯定簡答的 they are <b>不可以縮寫</b>。</div>
<p><b>以 what 為首：</b>What ＋ are ＋ these / those / they?　→　答：These / Those / They are ＋ 複數名詞.</p>
<p>例：A: What are those?　B: They're hats.　／　回答不同的東西可以用 and 連接：They're my new notebooks and markers.</p>

<h3>四、單數與複數人稱代名詞及所有格</h3>
<table><tr><th colspan="2">單數</th><th colspan="2">複數</th></tr>
<tr><th>主格</th><th>所有格</th><th>主格</th><th>所有格</th></tr>
<tr><td>I</td><td><b>my</b></td><td>we</td><td><b>our</b></td></tr>
<tr><td>you</td><td><b>your</b></td><td>you</td><td><b>your</b></td></tr>
<tr><td>he</td><td><b>his</b></td><td rowspan="3">they</td><td rowspan="3"><b>their</b></td></tr>
<tr><td>she</td><td><b>her</b></td></tr>
<tr><td>it</td><td><b>its</b></td></tr></table>

<h3>五、名詞的所有格</h3>
<table><tr><th>類型</th><th>做法</th><th>例子</th></tr>
<tr><td>單數名詞</td><td>字尾加 <b>'s</b></td><td>Sam → Sam<b>'s</b> toy；the boy → the boy<b>'s</b></td></tr>
<tr><td>複數名詞（字尾已有 s）</td><td>只加 <b>'</b></td><td>the girls → the girls<b>'</b> books</td></tr>
<tr><td>不規則複數</td><td>字尾加 <b>'s</b></td><td>the people → the people<b>'s</b> seats</td></tr></table>
<div class="tip">💡 <b>共同擁有 vs 各自擁有</b><br>
Jack <b>and Ann's</b> dad is tall.（兩人<b>共同</b>的爸爸，只有一個 → 用單數）<br>
Jack<b>'s and Ann's</b> dad<b>s</b> are tall.（兩人<b>各自</b>的爸爸 → 後面要用複數）<br>
三人各自擁有寫成 A's, B's, and C's。</div>`
},
{id:"s3", no:3, name:"Lesson 3", icon:"3️⃣", topic:"", ready:false, words:[], grammar:"", bankId:null},
{id:"s4", no:4, name:"Lesson 4", icon:"4️⃣", topic:"", ready:false, words:[], grammar:"", bankId:null},
{id:"s5", no:5, name:"Lesson 5", icon:"5️⃣", topic:"", ready:false, words:[], grammar:"", bankId:null},
{id:"s6", no:6, name:"Lesson 6", icon:"6️⃣", topic:"", ready:false, words:[], grammar:"", bankId:null}
];

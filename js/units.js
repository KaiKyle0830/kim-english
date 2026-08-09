// 8 個文法單元：標題與複習內容（HTML）
window.UNITS = [
{id:"u1",no:1,name:"be 動詞",icon:"🅰️",brief:"am / is / are 的用法",review:`
<h3>be 動詞是什麼？</h3>
<p>be 動詞（am／is／are）表示「是、在、處於某種狀態」。中文說「我<b>是</b>學生」「他<b>很</b>高」「書<b>在</b>桌上」，英文都用 be 動詞。</p>
<h3>怎麼選？看主詞！</h3>
<table><tr><th>主詞</th><th>be 動詞</th><th>例句</th></tr>
<tr><td>I</td><td><b>am</b></td><td>I <b>am</b> a student. 我是學生。</td></tr>
<tr><td>He / She / It<br>單數名詞（Tom, my dog…）</td><td><b>is</b></td><td>She <b>is</b> happy. 她很開心。<br>The dog <b>is</b> cute. 這隻狗很可愛。</td></tr>
<tr><td>You / We / They<br>複數名詞（the boys…）</td><td><b>are</b></td><td>They <b>are</b> at school. 他們在學校。</td></tr></table>
<h3>否定句：be 動詞後面加 not</h3>
<p>I am <b>not</b> tired. ／ He <b>isn't</b>(= is not) a teacher. ／ We <b>aren't</b>(= are not) busy.</p>
<h3>疑問句：把 be 動詞搬到最前面</h3>
<p>You are hungry. → <b>Are</b> you hungry?　回答：Yes, I am. / No, I'm not.</p>
<h3>There is / There are（有…）</h3>
<p>後面的名詞是單數用 is、複數用 are：There <b>is</b> a cat on the sofa. ／ There <b>are</b> two dogs in the park.</p>
<div class="tip">💡 小提醒：一個句子只要有 be 動詞，就不要再加 do／does 了！</div>`},
{id:"u2",no:2,name:"現在簡單式",icon:"📅",brief:"每天的習慣：動詞加不加 s？",review:`
<h3>什麼時候用現在簡單式？</h3>
<p>表達<b>習慣、常常做的事、事實</b>。常跟這些字一起出現：every day（每天）、usually（通常）、often（常常）、on Sundays（每週日）。</p>
<h3>核心規則：第三人稱單數，動詞要加 s／es</h3>
<table><tr><th>主詞</th><th>動詞</th><th>例句</th></tr>
<tr><td>I / You / We / They</td><td>原形</td><td>They <b>play</b> basketball every day.</td></tr>
<tr><td>He / She / It / Tom</td><td>加 s／es</td><td>He <b>plays</b> basketball every day.</td></tr></table>
<p>加 s 的變化：<b>watch → watches</b>（ch 結尾加 es）、<b>go → goes</b>、<b>study → studies</b>（子音+y 改 ies）、<b>have → has</b>（特殊）。</p>
<h3>否定句：don't / doesn't ＋ 原形動詞</h3>
<p>I <b>don't</b> like coffee. ／ She <b>doesn't</b> like coffee.（注意：doesn't 後面用原形 like，不是 likes！）</p>
<h3>疑問句：Do / Does 開頭 ＋ 原形動詞</h3>
<p><b>Do</b> you play the piano? ／ <b>Does</b> he play the piano?　回答：Yes, he does. / No, he doesn't.</p>
<div class="tip">💡 口訣：s 只出現一次——肯定句給動詞（plays），否定疑問給 does，動詞就變回原形。</div>`},
{id:"u3",no:3,name:"現在進行式",icon:"🏃",brief:"正在做的事：be + V-ing",review:`
<h3>什麼時候用現在進行式？</h3>
<p>表達<b>現在正在做</b>的動作。常見信號字：now（現在）、right now、Look!（你看！）、Listen!（你聽！）。</p>
<h3>句型：be 動詞 ＋ V-ing</h3>
<table><tr><th>主詞</th><th>句型</th><th>例句</th></tr>
<tr><td>I</td><td>am + V-ing</td><td>I <b>am doing</b> my homework now.</td></tr>
<tr><td>He / She / It</td><td>is + V-ing</td><td>Look! He <b>is running</b>.</td></tr>
<tr><td>You / We / They</td><td>are + V-ing</td><td>They <b>are watching</b> TV.</td></tr></table>
<h3>V-ing 的拼法</h3>
<p>① 直接加 ing：play → play<b>ing</b>　② 字尾 e 去掉加 ing：write → writ<b>ing</b>、dance → danc<b>ing</b>　③ 短母音+子音，重複字尾再加 ing：run → run<b>ning</b>、swim → swim<b>ming</b>、sit → sit<b>ting</b></p>
<h3>否定與疑問</h3>
<p>否定：He <b>isn't sleeping</b>.　疑問：<b>Are</b> you listening? — Yes, I am.</p>
<div class="tip">💡 比一比：He <b>plays</b> basketball every day.（習慣）↔ He <b>is playing</b> basketball now.（現在正在打）</div>`},
{id:"u4",no:4,name:"過去式",icon:"⏪",brief:"昨天發生的事：was/were 與動詞過去式",review:`
<h3>什麼時候用過去式？</h3>
<p>說<b>過去發生</b>的事。信號字：yesterday（昨天）、last night（昨晚）、last week、two days ago（兩天前）。</p>
<h3>be 動詞的過去式</h3>
<table><tr><th>現在</th><th>過去</th><th>例句</th></tr>
<tr><td>am / is</td><td><b>was</b></td><td>I <b>was</b> tired last night. ／ He <b>was</b> at home.</td></tr>
<tr><td>are</td><td><b>were</b></td><td>They <b>were</b> happy yesterday.</td></tr></table>
<h3>一般動詞的過去式</h3>
<p><b>規則變化</b>：字尾加 ed → play<b>ed</b>、watch<b>ed</b>；y 結尾改 ied → stud<b>ied</b>；重複字尾 → stop<b>ped</b>。</p>
<p><b>不規則變化</b>（要背！）：go→<b>went</b>、eat→<b>ate</b>、have→<b>had</b>、see→<b>saw</b>、buy→<b>bought</b>、take→<b>took</b>、make→<b>made</b>、write→<b>wrote</b>、do→<b>did</b>、get→<b>got</b>、come→<b>came</b>、drink→<b>drank</b>。</p>
<h3>否定與疑問：didn't / Did ＋ 原形</h3>
<p>He <b>didn't go</b> to school yesterday.（不是 didn't went！）<br><b>Did</b> you <b>see</b> the movie? — Yes, I did.</p>
<div class="tip">💡 didn't 和 Did 已經表達「過去」了，後面的動詞要變回原形。</div>`},
{id:"u5",no:5,name:"未來式",icon:"⏩",brief:"明天要做的事：will 與 be going to",review:`
<h3>什麼時候用未來式？</h3>
<p>說<b>之後才會發生</b>的事。信號字：tomorrow（明天）、next week（下週）、tonight（今晚）、this weekend。</p>
<h3>兩種說法</h3>
<table><tr><th>句型</th><th>例句</th></tr>
<tr><td><b>will</b> + 原形動詞</td><td>I <b>will call</b> you tomorrow. 我明天會打給你。</td></tr>
<tr><td><b>be going to</b> + 原形動詞</td><td>We <b>are going to visit</b> Taipei next week.</td></tr></table>
<p>注意：will 不用隨主詞變化（He will…），但 be going to 的 be 要變：I <b>am</b> / He <b>is</b> / They <b>are</b> going to…</p>
<h3>否定句</h3>
<p>will not = <b>won't</b>：I <b>won't</b> be late. ／ be 動詞加 not：She <b>isn't going to</b> buy it.</p>
<h3>疑問句</h3>
<p><b>Will</b> you come to the party? — Yes, I will. / No, I won't.<br><b>Is</b> he <b>going to</b> play baseball? — Yes, he is.</p>
<div class="tip">💡 不管 will 還是 going to，後面的動詞永遠用原形！</div>`},
{id:"u6",no:6,name:"助動詞",icon:"🔧",brief:"can / may / must / should",review:`
<h3>助動詞是動詞的好幫手</h3>
<p>放在動詞前面，增加「會、可以、必須、應該」的意思。<b>後面的動詞一律用原形</b>，而且助動詞不隨主詞變化（不加 s）。</p>
<table><tr><th>助動詞</th><th>意思</th><th>例句</th></tr>
<tr><td><b>can</b></td><td>會、能</td><td>She <b>can swim</b>. 她會游泳。</td></tr>
<tr><td><b>could</b></td><td>can 的過去式</td><td>He <b>could read</b> when he was five.</td></tr>
<tr><td><b>may</b></td><td>可以（請求）；可能</td><td><b>May</b> I come in? 我可以進來嗎？</td></tr>
<tr><td><b>must</b></td><td>必須；一定</td><td>Students <b>must wear</b> uniforms.</td></tr>
<tr><td><b>should</b></td><td>應該（建議）</td><td>You <b>should go</b> to bed early.</td></tr></table>
<h3>否定與疑問</h3>
<p>否定直接加 not：can't（不會）、mustn't（絕對不可以）、shouldn't（不應該）。<br>疑問把助動詞搬到句首：<b>Can</b> you help me? — Sure!</p>
<h3>must 和 have to</h3>
<p>意思接近，但寫法不同：must ＋ 原形（不加 to）；have/has <b>to</b> ＋ 原形。<br>He <b>must</b> get up early. ＝ He <b>has to</b> get up early.</p>
<div class="tip">💡 常錯：She can <b>speaks</b>(✗) → She can <b>speak</b>(✓)。助動詞後面永遠原形！</div>`},
{id:"u7",no:7,name:"比較級與最高級",icon:"📊",brief:"更高、最高：-er / -est、more / most",review:`
<h3>比較兩個 → 比較級 + than</h3>
<p>Tom is <b>taller than</b> his brother. 湯姆比他哥哥高。</p>
<h3>三個以上比 → the + 最高級</h3>
<p>Tom is <b>the tallest</b> in his class. 湯姆是班上最高的。（最高級前面要加 <b>the</b>）</p>
<h3>變化規則</h3>
<table><tr><th>類型</th><th>比較級</th><th>最高級</th></tr>
<tr><td>短的形容詞：加 er / est</td><td>tall → tall<b>er</b></td><td>tall<b>est</b></td></tr>
<tr><td>字尾 y → i：加 er / est</td><td>happy → happ<b>ier</b></td><td>happ<b>iest</b></td></tr>
<tr><td>短母音+子音：重複字尾</td><td>big → big<b>ger</b>、hot → hot<b>ter</b></td><td>big<b>gest</b>、hot<b>test</b></td></tr>
<tr><td>長的形容詞：more / most</td><td><b>more</b> beautiful</td><td><b>most</b> beautiful</td></tr>
<tr><td>不規則（要背）</td><td>good → <b>better</b>、bad → <b>worse</b>、many → <b>more</b></td><td><b>best</b>、<b>worst</b>、<b>most</b></td></tr></table>
<h3>一樣…：as ＋ 原級 ＋ as</h3>
<p>Tom is <b>as tall as</b> his brother. 湯姆跟他哥哥一樣高。（中間放原本的形容詞，不變化）</p>
<div class="tip">💡 常錯：more taller(✗)——er 和 more 只能選一個！than 不要拼成 then。</div>`},
{id:"u8",no:8,name:"疑問詞",icon:"❓",brief:"What / Who / Where / When / Why / How",review:`
<h3>用疑問詞問出你想知道的事</h3>
<table><tr><th>疑問詞</th><th>問什麼</th><th>例句</th></tr>
<tr><td><b>What</b></td><td>什麼</td><td><b>What</b> is this? — It's a robot.</td></tr>
<tr><td><b>Who</b></td><td>誰（人）</td><td><b>Who</b> is that girl? — She's my sister.</td></tr>
<tr><td><b>Where</b></td><td>哪裡（地點）</td><td><b>Where</b> is my bag? — It's under the desk.</td></tr>
<tr><td><b>When</b></td><td>何時（時間）</td><td><b>When</b> is your birthday? — On May 5th.</td></tr>
<tr><td><b>Why</b></td><td>為什麼（原因）</td><td><b>Why</b> are you late? — <b>Because</b> I missed the bus.</td></tr>
<tr><td><b>How</b></td><td>如何（方法／狀態）</td><td><b>How</b> do you go to school? — By bus.</td></tr>
<tr><td><b>Which</b></td><td>哪一個（範圍內選）</td><td><b>Which</b> one do you want, the red one or the blue one?</td></tr>
<tr><td><b>Whose</b></td><td>誰的（所有）</td><td><b>Whose</b> jacket is this? — It's Mary's.</td></tr></table>
<h3>How 家族</h3>
<p><b>How many</b> + 可數（多少個）／<b>How much</b>（多少錢；不可數）／<b>How old</b>（幾歲）／<b>How long</b>（多久）／<b>How often</b>（多常）／<b>How tall</b>（多高）</p>
<h3>疑問詞後面接什麼？</h3>
<p>① be 動詞：Where <b>is</b> he?　② do/does/did：Where <b>does</b> he live?（動詞用原形）</p>
<div class="tip">💡 訣竅：先看「回答」——回答地點就問 Where、回答時間就問 When、有 Because 就問 Why。</div>`}
];

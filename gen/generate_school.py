# -*- coding: utf-8 -*-
"""產生學校講義各課的文法題庫，輸出 data/grammar/<id>.js"""
import json, random, os

random.seed(20260814)
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "grammar")

def mk(q, correct, wrongs, exp):
    opts = [correct] + [w for w in dict.fromkeys(wrongs) if w != correct][:3]
    if len(opts) < 4: return None
    random.shuffle(opts)
    return {"q": q, "opts": opts, "a": opts.index(correct), "exp": exp}

def finish(unit_id, title, pool, n):
    seen, bank = set(), []
    random.shuffle(pool)
    for it in pool:
        if it is None or it["q"] in seen: continue
        seen.add(it["q"]); bank.append(it)
        if len(bank) >= n: break
    assert len(bank) >= n, f"{unit_id} 只有 {len(bank)} 題"
    path = os.path.join(OUT, f"{unit_id}.js")
    with open(path, "w", encoding="utf-8") as f:
        f.write("window.GRAMMAR_BANKS = window.GRAMMAR_BANKS || {};\n")
        f.write(f'window.GRAMMAR_BANKS["{unit_id}"] = ')
        json.dump(bank, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    print(unit_id, title, len(bank), "題 ->", os.path.relpath(path))

# ---------- Lesson 1：be 動詞（單數）／a, an／縮寫／形容詞／Who ----------
def lesson1():
    pool = []

    HE = ["He", "Nick", "Scott", "My uncle", "Her husband", "Mr. Lin", "That young man",
          "His cousin", "Your son", "The cook"]
    SHE = ["She", "Ann", "Rita", "Bella", "My aunt", "Ms. Chang", "That woman",
           "Her daughter", "My wife", "The nurse"]
    IT = ["It", "This", "That"]
    JOB_C = ["a cook", "a nurse", "a doctor", "a farmer", "a teacher", "a student",
             "a singer", "a police officer"]
    ADJ = ["young", "strict", "cute", "nice", "warm", "tall"]          # 男女都適用
    ADJ_M = ADJ + ["handsome"]                                          # 用於男性主詞
    ADJ_F = ADJ + ["beautiful"]                                         # 用於女性主詞

    # 1) am / is / are（單數）
    for s in HE:
        for c in random.sample(JOB_C + ADJ_M, 5):
            pool.append(mk(f"{s} ___ {c}.", "is", ["am", "are", "be"],
                           f"{s} 是第三人稱單數，be 動詞用 is。"))
    for s in SHE:
        for c in random.sample(JOB_C + ADJ_F, 5):
            pool.append(mk(f"{s} ___ {c}.", "is", ["am", "are", "be"],
                           f"{s} 是第三人稱單數，be 動詞用 is。"))
    for c in random.sample(JOB_C + ADJ, 10):
        pool.append(mk(f"I ___ {c}.", "am", ["is", "are", "be"],
                       "主詞是 I，be 動詞用 am。"))
        pool.append(mk(f"You ___ {c}.", "are", ["am", "is", "be"],
                       "主詞是 You，be 動詞用 are。"))
    for c in ["a pen", "a pencil", "a bag", "an eraser", "a watch", "an apple"]:
        for s in IT:
            pool.append(mk(f"{s} ___ {c}.", "is", ["am", "are", "be"],
                           f"{s} 指單一物品，be 動詞用 is。"))

    # 2) 否定句
    for s in random.sample(HE, 6):
        c = random.choice(JOB_C + ADJ_M)
        pool.append(mk(f"{s} ___ {c}. (否定句)", "isn't", ["am not", "aren't", "not is"],
                       f"{s} 用 is，否定是 is not，縮寫 isn't。"))
    for s in random.sample(SHE, 6):
        c = random.choice(JOB_C + ADJ_F)
        pool.append(mk(f"{s} ___ {c}. (否定句)", "isn't", ["am not", "aren't", "not is"],
                       f"{s} 用 is，否定是 is not，縮寫 isn't。"))
    for i in range(6):
        c = random.choice(JOB_C + ADJ)
        pool.append(mk(f"I ___ {c}. (否定句)", "am not", ["isn't", "aren't", "amn't"],
                       "I 的否定是 am not；沒有 amn't 這種縮寫。"))
        pool.append(mk(f"You ___ {c}. (否定句)", "aren't", ["am not", "isn't", "not are"],
                       "You 用 are，否定縮寫是 aren't。"))

    # 3) Yes / No 問句
    for s in ["he", "she", "it", "Nick", "Ann", "your mother", "Mr. Lin", "that man", "this girl"]:
        for c in random.sample(JOB_C + ADJ, 3):
            pool.append(mk(f"___ {s} {c}?", "Is", ["Am", "Are", "Be"],
                           f"{s} 是第三人稱單數，問句開頭用 Is（把 be 動詞移到句首）。"))
    for c in random.sample(JOB_C + ADJ, 8):
        pool.append(mk(f"___ you {c}?", "Are", ["Am", "Is", "Be"],
                       "問 you 的時候用 Are 開頭。"))

    # 4) 簡答
    SHORT = [
        ("A: Are you a student? B: Yes, ___.", "I am", ["I'm", "you are", "I do"],
         "肯定簡答不可以縮寫，要說 Yes, I am."),
        ("A: Are you Nick's mom? B: No, ___.", "I'm not", ["I amn't", "I am", "I'm"],
         "am not 不能縮寫成 amn't；否定簡答用 No, I'm not."),
        ("A: Is it your bag? B: Yes, ___.", "it is", ["it's", "its", "this is"],
         "肯定簡答不縮寫，說 Yes, it is."),
        ("A: Is Mr. Lin a farmer? B: ___", "Yes, he is.",
         ["Yes, he is a father.", "No, he's a farmer.", "No, he isn't a teacher."],
         "簡答要用代名詞，而且答句內容要和問句相符。"),
        ("A: Is she your aunt? B: No, ___.", "she isn't", ["she not is", "she's", "her isn't"],
         "否定簡答用 No, she isn't.（也可以說 No, she's not.）"),
        ("A: Is he your cousin? B: Yes, ___.", "he is", ["he's", "his is", "he does"],
         "肯定簡答不可以縮寫成 Yes, he's."),
        ("A: Am I late? B: No, ___.", "you aren't", ["I'm not", "you not are", "I aren't"],
         "問 Am I…? 要用 you 回答：No, you aren't."),
        ("A: Is that dog your pet? B: Yes, ___.", "it is", ["he is", "it's", "that is"],
         "動物或物品用 it 回答，肯定簡答不縮寫。"),
    ]
    for q, c, w, e in SHORT:
        pool.append(mk(q, c, w, e))

    # 5) a / an
    # 物品用 It is…；人物用 He / She is…，語意才自然
    A_OBJ = ["book", "dog", "pen", "table", "watch", "cat", "pet", "car", "bag", "cup",
             "house", "problem", "classroom", "cute pet", "new bike"]
    AN_OBJ = ["apple", "eraser", "igloo", "ox", "umbrella", "egg", "orange", "elephant",
              "ant", "old car", "easy question"]
    # (名詞, 性別)：m 男性、f 女性、n 男女皆可
    A_PERSON = [("boy","m"), ("son","m"), ("husband","m"), ("young man","m"), ("nice boy","m"),
                ("tall boy","m"), ("girl","f"), ("woman","f"), ("daughter","f"), ("wife","f"),
                ("beautiful girl","f"), ("cook","n"), ("nurse","n"), ("doctor","n"),
                ("farmer","n"), ("teacher","n"), ("student","n"), ("cousin","n"),
                ("strict teacher","n"), ("good student","n")]
    AN_PERSON = [("uncle","m"), ("old man","m"), ("aunt","f"), ("angry woman","f"),
                 ("actor","n"), ("artist","n"), ("engineer","n"), ("English teacher","n")]
    def subj(g): return "He" if g == "m" else "She" if g == "f" else random.choice(["He", "She"])

    for w in A_OBJ:
        pool.append(mk(f"It is ___ {w}.", "a", ["an", "the", "×（不用冠詞）"],
                       f"{w} 的字首是子音發音，用 a。"))
    for w in AN_OBJ:
        pool.append(mk(f"It is ___ {w}.", "an", ["a", "the", "×（不用冠詞）"],
                       f"{w} 的字首是母音發音，用 an。"))
    for w, g in A_PERSON:
        pool.append(mk(f"{subj(g)} is ___ {w}.", "a", ["an", "the", "×（不用冠詞）"],
                       f"{w} 的字首是子音發音，用 a。"))
    for w, g in AN_PERSON:
        pool.append(mk(f"{subj(g)} is ___ {w}.", "an", ["a", "the", "×（不用冠詞）"],
                       f"{w} 的字首是母音發音，用 an。"))
    # 用職業造句（人物主詞只搭配職業，語意才通順）
    JOBS_BARE = ["cook", "nurse", "doctor", "farmer", "teacher", "student", "singer"]
    for w in JOBS_BARE:
        s = random.choice(HE + SHE)
        pool.append(mk(f"{s} is ___ {w}.", "a", ["an", "the", "×（不用冠詞）"],
                       f"{w} 的字首是子音發音，用 a。"))
    for w in ["actor", "artist", "engineer"]:
        s = random.choice(HE + SHE)
        pool.append(mk(f"{s} is ___ {w}.", "an", ["a", "the", "×（不用冠詞）"],
                       f"{w} 的字首是母音發音，用 an。"))
    # a/an 不能和所有格併用
    for n in ["cousin", "uncle", "teacher", "friend", "aunt"]:
        pool.append(mk(f"Fred is ___ {n}. (他是「我的」{n})", f"my", [f"my a", f"a my", f"an my"],
                       "a / an 不能和所有格一起修飾同一個名詞，所以只說 my cousin。"))

    # 6) 縮寫
    CONTRACT = [
        ("I am → ___", "I'm", ["Im", "I're", "I's"], "I am 縮寫成 I'm。"),
        ("you are → ___", "you're", ["your", "you'are", "youre"], "you are 縮寫成 you're；your 是「你的」。"),
        ("he is → ___", "he's", ["his", "he're", "hes"], "he is 縮寫成 he's；his 是「他的」。"),
        ("she is → ___", "she's", ["shes", "her's", "she're"], "she is 縮寫成 she's。"),
        ("it is → ___", "it's", ["its", "it're", "its'"], "it is 縮寫成 it's；its 是「它的」。"),
        ("I am not → ___", "I'm not", ["I amn't", "I'mn't", "I not am"], "am not 不能縮寫，只能說 I'm not。"),
        ("he is not → ___", "he isn't", ["he'sn't", "he not is", "his not"], "he is not ＝ he's not ＝ he isn't。"),
        ("The dog wags ___ tail.", "its", ["it's", "it is", "its'"], "「它的」用 its，沒有撇號。"),
        ("___ a nice day today.", "It's", ["Its", "It", "Its'"], "這裡是 It is 的縮寫，要用 It's。"),
    ]
    for q, c, w, e in CONTRACT:
        pool.append(mk(q, c, w, e))

    # 7) 形容詞的位置
    for adj in ADJ_M:
        s = random.choice(HE)
        pool.append(mk(f"{s} is ___ .", adj, [f"a {adj}", f"an {adj}", f"{adj}s"],
                       f"形容詞放在 be 動詞後面時，後面不接名詞就不加冠詞：is {adj}。"))
    for adj in ADJ_F:
        s = random.choice(SHE)
        pool.append(mk(f"{s} is ___ .", adj, [f"a {adj}", f"an {adj}", f"{adj}s"],
                       f"形容詞放在 be 動詞後面時，後面不接名詞就不加冠詞：is {adj}。"))
    for adj in ADJ_M:
        for n in ["boy", "teacher", "student", "man"]:
            pool.append(mk(f"He is ___ .", f"a {adj} {n}",
                           [f"{adj} a {n}", f"a {n} {adj}", f"{adj} {n}"],
                           f"形容詞放名詞前面：a ＋ {adj} ＋ {n}。"))
    for adj in ADJ_F:
        for n in ["girl", "teacher", "student", "woman"]:
            pool.append(mk(f"She is ___ .", f"a {adj} {n}",
                           [f"{adj} a {n}", f"a {n} {adj}", f"{adj} {n}"],
                           f"形容詞放名詞前面：a ＋ {adj} ＋ {n}。"))
    ADJ_Q = [
        ("Are you ___ ?", "sad", ["sad girl", "a sad", "sad a girl"],
         "be 動詞後面可以直接接形容詞：Are you sad?"),
        ("A: Is Emily's father young? B: ___", "No, he isn't.",
         ["He is young.", "Yes, he's old.", "No, he is young."],
         "否定簡答沿用問句中的形容詞：No, he isn't.（也可說 No, he's old.）"),
        ("She is ___ .", "a beautiful girl", ["beautiful a girl", "a girl beautiful", "beautiful girl"],
         "形容詞放在名詞前面，單數可數名詞前要加 a。"),
        ("The ___ boy is my brother.", "tall", ["tall's", "a tall", "talls"],
         "形容詞直接放名詞前面修飾，不加冠詞或 s。"),
        ("It's ___ old car.", "an", ["a", "the", "×（不用冠詞）"],
         "old 的字首是母音發音，冠詞要用 an。"),
        ("That is ___ young teacher.", "a", ["an", "the", "×（不用冠詞）"],
         "young 的字首 y 是子音發音，用 a。"),
    ]
    for q, c, w, e in ADJ_Q:
        pool.append(mk(q, c, w, e))

    # 8) Who 的問答
    WHO = [
        ("___ is that young man? — He's our new PE teacher.", "Who", ["What", "Where", "How"],
         "問「人」是誰，用 Who。"),
        ("___ is she? — She is Mr. Chen's daughter.", "Who", ["What", "Whose", "When"],
         "問姓名或關係用 Who。"),
        ("A: That actor is so handsome. Who is he? B: ___", "He is Timothy.",
         ["He is handsome.", "Yes, he is.", "He is my."],
         "Who 問姓名時，答句是「主詞＋be 動詞＋名字」。"),
        ("A: Who is that girl? B: ___", "She is Mr. Chen's daughter.",
         ["She is beautiful.", "Yes, she is.", "He is my cousin."],
         "Who 也可以問關係，答句用「所有格＋名詞」。"),
        ("Who ___ that man? — He is my uncle.", "is", ["are", "am", "be"],
         "Who 後面接 be 動詞，問單數用 is。"),
        ("A: Who is Ms. Chang? B: ___", "She is my cousin.",
         ["She is nice.", "Yes, she is.", "He is my cousin."],
         "回答關係要用正確的代名詞，Ms. Chang 是女性，用 She。"),
        ("The boy is Kevin's son. → ___ is Kevin's son?", "Who", ["What", "Whose", "Which"],
         "畫線部分是人，改問句用 Who。"),
        ("I'm Eva Green. → ___ are you?", "Who", ["What", "Whose", "How"],
         "問對方是誰，用 Who are you?"),
    ]
    for q, c, w, e in WHO:
        pool.append(mk(q, c, w, e))

    # 9) 課文相關的綜合題
    TEXT = [
        ("Nick, who's that young man? He's ___ new PE teacher.", "our",
         ["us", "we", "ours"], "「我們的」＋名詞要用所有格 our。"),
        ("Ann, we're in the ___ class again!", "same", ["strict", "warm", "cute"],
         "「又在同一班」用 same。"),
        ("Nice to meet you, ___ .", "too", ["to", "two", "also"],
         "回應「很高興認識你」用 Nice to meet you, too."),
        ("Good ___ ! Bella is our English teacher.", "news", ["new", "problem", "class"],
         "「好消息」是 good news。"),
        ("What's the ___ ? She's a great teacher.", "problem", ["news", "class", "cousin"],
         "「有什麼問題嗎」是 What's the problem?"),
        ("She's a ___ teacher. She has many rules.", "strict", ["warm", "cute", "young"],
         "規定很多代表老師很嚴格 strict。"),
        ("He's my ___ . His father is my uncle.", "cousin", ["son", "husband", "parent"],
         "叔叔的兒子是堂（表）兄弟 cousin。"),
        ("My mother's sister is my ___ .", "aunt", ["uncle", "cousin", "wife"],
         "媽媽的姊妹是 aunt。"),
        ("My father's brother is my ___ .", "uncle", ["aunt", "son", "husband"],
         "爸爸的兄弟是 uncle。"),
        ("Mr. and Mrs. Wang have a son and a ___ .", "daughter", ["wife", "husband", "parent"],
         "兒子和女兒：son and daughter。"),
    ]
    for q, c, w, e in TEXT:
        pool.append(mk(q, c, w, e))

    finish("s1", "Lesson 1", pool, 200)

# ---------- Lesson 2：this/that/these/those／名詞複數／人稱代名詞與所有格 ----------
def lesson2():
    pool = []

    def art(n):
        return ("an " if n[0].lower() in "aeiou" else "a ") + n

    SING = ["cat", "dog", "pen", "book", "ruler", "picture", "eraser", "elephant", "ox",
            "snake", "horse", "goat", "monkey", "rabbit", "tiger", "bear", "rat", "dragon"]
    PLUR = ["cats", "dogs", "pens", "books", "rulers", "pictures", "erasers", "elephants",
            "snakes", "horses", "goats", "monkeys", "rabbits", "tigers", "bears", "zebras"]

    # 1) this / that / these / those（距離＋單複數）
    for n in SING:
        pool.append(mk(f"___ is {art(n)}.（近的，單數）", "This", ["These", "Those", "That"],
                       "近的用 this，單數用 this。"))
        pool.append(mk(f"___ is {art(n)}.（遠的，單數）", "That", ["This", "These", "Those"],
                       "遠的用 that，單數用 that。"))
    for n in PLUR:
        pool.append(mk(f"___ are {n}.（近的，複數）", "These", ["This", "That", "Those"],
                       "近的複數用 these。"))
        pool.append(mk(f"___ are {n}.（遠的，複數）", "Those", ["This", "That", "These"],
                       "遠的複數用 those。"))

    # 2) be 動詞要跟著單複數
    for n in random.sample(SING, 10):
        pool.append(mk(f"This ___ {art(n)}.", "is", ["are", "am", "be"],
                       "this 是單數，be 動詞用 is。"))
        pool.append(mk(f"That ___ {art(n)}.", "is", ["are", "am", "be"],
                       "that 是單數，be 動詞用 is。"))
    for n in random.sample(PLUR, 10):
        pool.append(mk(f"These ___ {n}.", "are", ["is", "am", "be"],
                       "these 是複數，be 動詞用 are。"))
        pool.append(mk(f"Those ___ {n}.", "are", ["is", "am", "be"],
                       "those 是複數，be 動詞用 are。"))

    # 3) Yes / No 簡答
    SHORT = [
        ("A: Is this a cat? B: Yes, ___.", "it is", ["it's", "this is", "they are"],
         "簡答一定用 it，而且肯定簡答不可以縮寫成 it's。"),
        ("A: Is that an elephant? B: No, ___ isn't.", "it", ["that", "this", "they"],
         "簡答的代名詞一定要用 it。"),
        ("A: Are those pencils? B: Yes, ___.", "they are", ["they're", "those are", "it is"],
         "複數簡答用 they，肯定簡答不可縮寫成 they're。"),
        ("A: Are these your rulers? B: Yes, ___.", "they are", ["these are", "they're", "it is"],
         "複數的簡答用 they are，不縮寫。"),
        ("A: Is this your bag? B: No, ___.", "it isn't", ["it's", "this isn't", "they aren't"],
         "否定簡答可以說 No, it isn't. 或 No, it's not."),
        ("A: Are they your pet cats? B: No, ___.", "they aren't", ["it isn't", "they're", "those aren't"],
         "否定簡答用 No, they aren't. 或 No, they're not."),
        ("A: Aren't the books great? B: ___ I like them.", "Yes, they are.",
         ["Yes, they aren't.", "No, they aren't.", "No, they are."],
         "喜歡它們代表肯定，用 Yes, they are."),
        ("A: What is this? B: ___", "It's a picture.",
         ["Yes, it is.", "They're pictures.", "It's pictures."],
         "What is this? 要回答東西是什麼，用 It's a ＋ 單數名詞."),
        ("A: What's this? B: ___", "An eraser.", ["Mr. Lin.", "My sister.", "Yes, it is."],
         "What's this? 問的是物品，答案要是東西。"),
        ("A: What are these? B: ___", "They're my pet cats.",
         ["It's my pet cat.", "Yes, they are.", "He's my pet cat."],
         "What are these? 用 They're ＋ 複數名詞 回答。"),
        ("___ zebras, not horses.", "They're", ["That is", "It's", "That's"],
         "後面是複數名詞 zebras，主詞要用複數的 They're。"),
    ]
    for q, c, w, e in SHORT:
        pool.append(mk(q, c, w, e))

    # 4) What is / What are
    for n in random.sample(SING, 6):
        pool.append(mk(f"What ___ this? — It's {art(n)}.", "is", ["are", "am", "be"],
                       "this 是單數，用 What is this?"))
    for n in random.sample(PLUR, 6):
        pool.append(mk(f"What ___ these? — They're {n}.", "are", ["is", "am", "be"],
                       "these 是複數，用 What are these?"))
    pool.append(mk("A: What ___ it? B: A ruler.", "is", ["are", "am", "be"],
                   "it 是單數，用 What is it?（這句不可以縮寫成 What's it?）"))

    # 5) 名詞複數形
    PL = [("book","books","直接加 s"), ("pen","pens","直接加 s"), ("toy","toys","母音+y，直接加 s"),
          ("boy","boys","母音+y，直接加 s"), ("day","days","母音+y，直接加 s"),
          ("monkey","monkeys","母音+y，直接加 s"),
          ("bus","buses","字尾 s，加 es"), ("box","boxes","字尾 x，加 es"),
          ("watch","watches","字尾 ch，加 es"), ("brush","brushes","字尾 sh，加 es"),
          ("class","classes","字尾 s，加 es"), ("fox","foxes","字尾 x，加 es"),
          ("dish","dishes","字尾 sh，加 es"), ("baby","babies","子音+y，去 y 加 ies"),
          ("party","parties","子音+y，去 y 加 ies"), ("city","cities","子音+y，去 y 加 ies"),
          ("story","stories","子音+y，去 y 加 ies"), ("family","families","子音+y，去 y 加 ies"),
          ("puppy","puppies","子音+y，去 y 加 ies"), ("candy","candies","子音+y，去 y 加 ies"),
          ("wife","wives","字尾 fe，去掉加 ves"), ("leaf","leaves","字尾 f，去掉加 ves"),
          ("knife","knives","字尾 fe，去掉加 ves"), ("life","lives","字尾 fe，去掉加 ves"),
          ("shelf","shelves","字尾 f，去掉加 ves"), ("housewife","housewives","字尾 fe，去掉加 ves"),
          ("fish","fish","單複數同形"), ("sheep","sheep","單複數同形"), ("deer","deer","單複數同形"),
          ("man","men","不規則變化"), ("woman","women","不規則變化"),
          ("child","children","不規則變化"), ("mouse","mice","不規則變化"),
          ("foot","feet","不規則變化"), ("tooth","teeth","不規則變化"),
          ("ox","oxen","不規則變化"), ("person","people","不規則變化")]
    def naive(s):
        if s.endswith(("s","x","sh","ch")): return s + "es"
        if s.endswith("y") and s[-2] not in "aeiou": return s[:-1] + "ies"
        return s + "s"
    for sg, pl, note in PL:
        wrongs = [w for w in [sg + "s", sg + "es", naive(sg), sg] if w != pl][:3]
        while len(wrongs) < 3:
            cand = sg + random.choice(["'s", "ies", "en"])
            if cand != pl and cand not in wrongs: wrongs.append(cand)
        pool.append(mk(f"{sg} 的複數形是 ___ ？", pl, wrongs, f"{sg} → {pl}（{note}）。"))
        pool.append(mk(f"There are two ___ .（{sg}）", pl, wrongs,
                       f"two 後面接複數：{sg} → {pl}（{note}）。"))

    # 6) 人稱代名詞的所有格
    POSS = [("I","my"), ("you","your"), ("he","his"), ("she","her"),
            ("it","its"), ("we","our"), ("they","their")]
    for sub, po in POSS:
        others = [p for _, p in POSS if p != po]
        n = random.choice(["book", "bag", "dog", "picture", "classroom"])
        pool.append(mk(f"This is ___ {n}.（{sub} 的）", po, random.sample(others, 3),
                       f"{sub} 的所有格是 {po}。"))
    pool.append(mk("Their legs are long. → ___ 的意思是？", "他們的",
                   ["他們", "他們的東西", "它是"], "their 是所有格，意思是「他們的」。"))
    pool.append(mk("The dog wags ___ tail.", "its", ["it's", "it is", "their"],
                   "「牠的」用 its，沒有撇號；it's 是 it is。"))

    # 7) 名詞的所有格
    NPOSS = [
        ("Sam ___ toy is new.", "Sam's", ["Sams", "Sams'", "Sam"], "單數名詞的所有格加 's：Sam's。"),
        ("This is the boy ___ bag.", "boy's", ["boys'", "boys", "boy"], "單數名詞加 's：the boy's。"),
        ("These ___ eyes are big, and their legs are long.", "girls'",
         ["girl'", "girls's", "girls"], "複數名詞字尾已有 s，所有格只加一撇：girls'。"),
        ("Those are the ___ books.（那些女孩的書）", "girls'", ["girl's", "girls", "girls's"],
         "複數 girls 的所有格是 girls'。"),
        ("She's these ___ English teacher.（那些女人的）", "women's",
         ["womens'", "woman's", "womans'"], "women 是不規則複數，所有格加 's：women's。"),
        ("The ___ seats are over there.（那些人的座位）", "people's",
         ["peoples'", "people'", "peoples"], "people 是不規則複數，所有格加 's。"),
        ("My ___ school is big.（我父母的學校）", "parents'",
         ["parent's", "parents", "parents's"], "parents 字尾有 s，所有格只加一撇。"),
        ("These are my ___ photos.（我姐姐們的照片）", "sisters'",
         ["sister's", "sisters", "sisters's"], "複數 sisters 的所有格是 sisters'。"),
        ("Asian ___ lifespans are about 60 years.", "elephants'",
         ["elephant's", "elephants", "elephants's"], "複數字尾有 s，所有格只加一撇。"),
        ("This is the ___ room.（那些孩子的房間）", "children's",
         ["childrens'", "childs'", "children'"], "children 是不規則複數，所有格加 's。"),
    ]
    for q, c, w, e in NPOSS:
        pool.append(mk(q, c, w, e))

    # 8) 共同擁有 / 各自擁有
    SHARE = [
        ("___ new car is cool. I like it.（Ivan 和 Lily 共有的一台車）", "Ivan and Lily's",
         ["Ivan's and Lily's", "Ivan and Lily", "They"],
         "共同擁有只在最後一個名字加 's：A and B's。"),
        ("___ dads are tall.（Jack 和 Ann 各自的爸爸）", "Jack's and Ann's",
         ["Jack and Ann's", "Jack and Ann", "Jacks and Anns"],
         "各自擁有兩個名字都要加 's，後面名詞用複數。"),
        ("Jack and Ann's dad ___ tall.", "is", ["are", "am", "be"],
         "共同的爸爸只有一位，所以用單數動詞 is。"),
        ("Kerr's and John's wives ___ cooks.", "are", ["is", "am", "be"],
         "各自的太太是兩位，主詞是複數，用 are。"),
        ("This is a picture of ___ . She's beautiful, right?", "Nick and Lily's mom",
         ["Nick and Lily's moms", "Nick's and Lily's moms", "Nick's and Lily's mom"],
         "She 表示只有一位媽媽，是兩人共同的媽媽：Nick and Lily's mom。"),
    ]
    for q, c, w, e in SHARE:
        pool.append(mk(q, c, w, e))

    # 9) 課文與字彙
    TEXT = [
        ("Ella and Tina are twins, ___ they are very different.", "but",
         ["and", "or", "so"], "前後語意相反（雙胞胎卻很不同），用 but。"),
        ("That young man is ___ 170 cm tall.", "about", ["at", "on", "from"],
         "「大約」用 about。"),
        ("Kate: ___ John your brother or cousin? Gina: ___ is my brother.", "Is; He",
         ["Is; No, he", "Are; No, he", "Are; He"],
         "John 是單數用 Is；選擇疑問句不能用 Yes/No 回答，要直接說 He is my brother."),
        ("Rabbits have red eyes. They like ___ .", "carrots", ["carrot", "carrotes", "carroties"],
         "複數 they 對應複數名詞 carrots。"),
        ("Believe it or not, the news is ___ .", "true", ["smart", "different", "energetic"],
         "「信不信由你，這消息是真的」用 true。"),
        ("This is a ___ of Lily's cousins.", "picture", ["sign", "size", "meter"],
         "照片是 picture。"),
        ("A: What ___ do you like? B: I like bears and lions.", "animals",
         ["animal", "animales", "animalies"], "後面回答是多種動物，用複數 animals。"),
        ("I'm in Class 404. You're in Class 401. We are in ___ classes.", "different",
         ["same", "true", "smart"], "不同班用 different。"),
        ("A dragon is smart and ___ .", "energetic", ["different", "only", "true"],
         "課文說龍是聰明且充滿活力的：smart and energetic。"),
        ("No ___ you are a people person.", "wonder", ["only", "very", "but"],
         "「難怪」是 no wonder。"),
        ("___ about Abby the pig?", "What", ["Who", "Where", "How"],
         "「那麼……呢？」用 What about...?"),
        ("The Chinese zodiac animal ___ are the rat, ox, and tiger.", "signs",
         ["sign", "signes", "signies"], "十二生肖有很多個，用複數 signs。"),
    ]
    for q, c, w, e in TEXT:
        pool.append(mk(q, c, w, e))

    finish("s2", "Lesson 2", pool, 200)

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    lesson1()
    lesson2()
    print("完成")

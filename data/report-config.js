// 學習報告要寄到哪裡（老師設定）
//
// method 有三種：
//  "web3forms"  推薦。到 https://web3forms.com 輸入 email 拿一組 access key 貼到下面。
//               信箱不會出現在程式碼裡，比較不會被垃圾信爬走。免費每月 250 封。
//  "formsubmit" 不用註冊，直接填 email。第一次寄出時會先收到一封確認信，點一下啟用即可。
//  "mailto"     不透過任何服務，直接打開手機的郵件 App 並帶好內容，學生按「寄出」。
//
window.REPORT_CONFIG = {
  method: "web3forms",
  accessKey: "",                 // ← 把 web3forms.com 給的 access key 貼在這裡就會生效
  teacherEmail: "",              // formsubmit / mailto 用
  studentName: "Kin",
  subject: "Kin 的英文學習回報"
};

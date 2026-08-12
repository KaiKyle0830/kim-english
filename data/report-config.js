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
  accessKey: "f1e375ac-bccd-4fb2-80b2-35bd06703c84",   // web3forms 的公開金鑰（可放在前端）
  teacherEmail: "",              // formsubmit / mailto 用
  studentName: "Kin",
  subject: "Kin 的英文學習回報",

  // 自動回報：學生打開或關掉 App 時，若有新的學習紀錄就在背景寄出
  // （iOS 不允許網頁在關閉狀態下自己執行，所以無法固定在 00:00 寄）
  auto: true,
  minHours: 6        // 兩次自動回報至少間隔幾小時；跨到隔天則不受此限制
};

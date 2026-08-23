import type { HomepageCopy } from "./types";

export const zh: HomepageCopy = {
  nav: [
    { id: "explore", en: "Explore METC", zh: "探索 METC" },
    { id: "teaching", en: "Teaching Design", zh: "教学设计" },
    { id: "activities", en: "Classroom Activities", zh: "课堂活动" },
    { id: "voices", en: "Student Voices", zh: "听 TA 们说" }
  ],
  hero: {
    eyebrow: "Math and Engineering Teaching Club",
    title: "把问题带进课堂，",
    titleAccent: "让好奇心动手发生",
    body: "由学生创造、面向学生的数学与工程教学社团，我们把抽象概念变成能触摸、能讨论、能继续追问的课堂现场",
    primaryCta: "开始探索",
    secondaryCta: "查看教学设计",
    scroll: "向下翻开课堂"
  },
  explore: {
    eyebrow: "01 — 探索 METC",
    title: "不是把答案讲完，而是把问题交给学生",
    body: "METC 由高中生教学者共同发起。我们相信，最好的学习不是旁观一次正确示范，而是亲手经历猜想、制作、失败和重新解释。",
    missionLabel: "Teaching Mission",
    mission: "让更多学生在数学与工程里，看见自己的想法有重量。",
    philosophyLabel: "Educational Philosophy",
    philosophy: "学生为学生设计课堂：用真实问题连接知识，用作品留下学习的证据。",
    principle: "Curiosity becomes a question. A question becomes something we can build.",
    steps: [
      { number: "01", title: "Curiosity", detail: "从一个值得追问的现象开始" },
      { number: "02", title: "Discovery", detail: "允许猜测、试错与重新观察" },
      { number: "03", title: "Teaching", detail: "把理解转化为能分享的表达" },
      { number: "04", title: "Connection", detail: "让同伴、学科与真实世界相遇" }
    ],
    community: {
      label: "社团联系",
      joinLabel: "加入我们",
      contactLabel: "联系我们",
      join: {
        eyebrow: "微信",
        title: "加入 METC",
        body: "扫描微信二维码，与社团取得联系。",
        qrAlt: "METC 微信二维码",
        qrUnavailable: "社团联系二维码即将在这里提供。"
      },
      contact: {
        eyebrow: "联系",
        title: "联系 METC",
        body: "如需咨询 METC 相关事项，欢迎通过邮件联系学生管理团队成员。",
        officers: [
          { role: "Leader（社长）", name: "Gloria Wu", email: "s24634.wu@stu.scie.com.cn" },
          { role: "Vice Leader（副社长）", name: "Leo Zhao", email: "s23178.zhao@stu.scie.com.cn" },
          { role: "Vice Leader（副社长）", name: "Sheryl Xu", email: "s24670.xu@stu.scie.com.cn" }
        ]
      },
      close: "关闭"
    }
  },
  teaching: {
    eyebrow: "02 — 教学设计",
    title: "一堂课，先在纸上被认真设计",
    body: "从 syllabus 到课堂 PPT，再到学生手里的材料包，每一页都围绕同一个问题组织：学生会在哪里产生真正的发现？",
    edition: "METC COURSE NOTES · 2026",
    chapter: "UNIT 08 / 气体压力与反作用力",
    question: "小苏打和白醋，如何让瓶子飞起来？",
    objective: "Learning objective",
    objectiveBody: "通过安全的瓶子火箭，观察二氧化碳气压与牛顿第三定律如何共同推动火箭。",
    materials: "材料",
    materialItems: ["500ml 耐压塑料瓶 × 1", "白醋 · 50–100ml", "小苏打 · 不超过 2 勺", "厚纸巾或滤纸", "胶塞与细线", "护目镜与手套"],
    timeline: [
      { time: "01", label: "向瓶内倒入白醋" },
      { time: "02", label: "把小苏打包悬在瓶口" },
      { time: "03", label: "密封瓶口、倒置并固定" },
      { time: "04", label: "摇晃触发，退至 3 米外观察" }
    ],
    note: "批注：密封前别让小苏打提前碰到醋。戴好护目镜，在安全线外观察。",
    demoCta: "进入课程大纲图书馆"
  },
  activities: {
    eyebrow: "03 — 课堂活动",
    title: "知识不是被展示，而是在桌面上发生",
    body: "教学者和学生围在同一张桌子边。每一次讨论、每一个歪掉的模型、每一轮重新测试，都是课堂真正的内容。",
    photoCaption: "上步小学 · 课堂活动",
    demoCta: "进入成果展览"
  },
  voices: {
    eyebrow: "04 — 听 TA 们说",
    title: "一次课堂以后，他们把什么带走？",
    leadQuote: "在我看来，这次 ECA 非常适合我们，也很棒。它教给我们许多主题中独特而不同的知识。",
    sideStories: [
      { quote: "我们回答问题时，他们会给我们小零食。这种教学方式给了我们更多鼓励，也让我们更有信心回答问题。" },
      { quote: "他们的声音很清晰，讲解也很清楚，让复杂的句子变得更简单。" }
    ],
    closing: "Learning leaves a voice. / 学习会留下声音。",
    demoCta: "进入反馈"
  },
  footer: {
    eyebrow: "Keep the question open.",
    title: "下一堂课，从一个好问题开始",
    body: "METC · Math and Engineering Teaching Club\nStudent-created. Student-centered.",
    statementLabel: "声明",
    statements: {
      privacy: {
        label: "隐私声明",
        title: "隐私声明",
        body: [
          "浏览本网站无需创建账户或提交个人信息。",
          "如未来新增联系或报名服务，METC 会在收集前说明信息用途与处理方式。"
        ]
      },
      copyright: {
        label: "版权信息",
        title: "版权信息",
        body: [
          "© 2026 METC。除非另有说明，网站设计、文字内容及原创教学材料均受版权保护。",
          "如需转载、传播或改编本站内容，请先取得授权。"
        ]
      },
      website: {
        label: "网站声明",
        title: "网站声明",
        body: [
          "本网站为 METC（Math and Engineering Teaching Club）官方网站。",
          "教学资源与课堂记录用于教育分享，并会随着资料归档持续更新。"
        ]
      }
    },
    copyright: "© 2026 METC。保留所有权利。"
  },
  noticeMessage: "更多课堂记录正在整理归档。"
};

import type { Language } from "../types";

export const voicesPageCopy: Record<Language, {
  eyebrow: string;
  title: string;
  body: string;
  guideKicker: string;
  guideTitle: string;
  guideBody: string;
  start: string;
  continue: string;
  revisit: string;
  nextUp: string;
  explored: string;
  unopened: string;
  visited: string;
  reset: string;
  resetAria: string;
  open: string;
  reopen: string;
  opened: string;
  close: string;
  previous: string;
  next: string;
  archive: string;
  voice: string;
}> = {
  zh: {
    eyebrow: "STUDENT VOICES · METC MEMORIES",
    title: "每一句话，都留在这里发光",
    body: "这些手写留言，记录了学生对课堂的感受和建议。",
    guideKicker: "阅读方式",
    guideTitle: "拆开一封发光的信",
    guideBody: "点击信封阅读留言，也可以从下一封未拆的信开始。",
    start: "从第一封信开始",
    continue: "打开下一封未拆的信",
    revisit: "重新浏览反馈",
    nextUp: "从这里开始",
    explored: "已拆",
    unopened: "未拆封",
    visited: "已拆封",
    reset: "重置已读状态",
    resetAria: "将所有反馈信标记为未拆封",
    open: "拆开这封信",
    reopen: "查看这封已拆信件",
    opened: "已拆封",
    close: "关闭反馈",
    previous: "上一份反馈",
    next: "下一份反馈",
    archive: "反馈信箱",
    voice: "学生反馈"
  },
  en: {
    eyebrow: "STUDENT VOICES · METC MEMORIES",
    title: "Every voice leaves a little light",
    body: "These handwritten notes share students' thoughts and suggestions about the classes.",
    guideKicker: "HOW TO EXPLORE",
    guideTitle: "Unseal a glowing letter",
    guideBody: "Choose an envelope, or start with the next unopened letter.",
    start: "Open the first letter",
    continue: "Open the next sealed letter",
    revisit: "Read the letters again",
    nextUp: "Start here",
    explored: "opened",
    unopened: "Sealed",
    visited: "Opened",
    reset: "Reset read status",
    resetAria: "Mark all feedback letters as unopened",
    open: "Unseal this letter",
    reopen: "Read this opened letter",
    opened: "Opened",
    close: "Close feedback",
    previous: "Previous feedback",
    next: "Next feedback",
    archive: "VOICES MAILBOX",
    voice: "Student feedback"
  }
};

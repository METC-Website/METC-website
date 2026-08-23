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
    body: "那些写在纸上的感受、课堂后的留言和没有被忘记的瞬间，都成为这里的一封信",
    guideKicker: "HOW TO EXPLORE",
    guideTitle: "拆开一封发光的信",
    guideBody: "点击密封信封阅读留言，或从第一封未拆反馈开始。",
    start: "从第一封信开始",
    continue: "继续下一封未拆反馈",
    revisit: "重新浏览反馈",
    nextUp: "从这里开始",
    explored: "已拆",
    unopened: "未拆封",
    visited: "已拆封",
    reset: "重置已读状态",
    resetAria: "清除所有已查看的学生反馈状态",
    open: "拆开这封信",
    reopen: "查看这封已拆信件",
    opened: "已拆封",
    close: "关闭反馈",
    previous: "上一份反馈",
    next: "下一份反馈",
    archive: "声音信箱",
    voice: "学生反馈"
  },
  en: {
    eyebrow: "STUDENT VOICES · METC MEMORIES",
    title: "Every voice leaves a little light",
    body: "Notes written after class, small reflections, and moments worth remembering become letters in this archive",
    guideKicker: "HOW TO EXPLORE",
    guideTitle: "Unseal a glowing letter",
    guideBody: "Choose a sealed envelope, or begin with the next unopened reflection.",
    start: "Open the first letter",
    continue: "Open the next sealed letter",
    revisit: "Browse the voices again",
    nextUp: "Start here",
    explored: "opened",
    unopened: "Sealed",
    visited: "Opened",
    reset: "Reset viewed",
    resetAria: "Clear all viewed student feedback states",
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

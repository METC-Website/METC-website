export type Language = "zh" | "en";

export type HomepageCopy = {
  nav: Array<{ id: string; en: string; zh: string }>;
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    scroll: string;
  };
  explore: {
    eyebrow: string;
    title: string;
    body: string;
    missionLabel: string;
    mission: string;
    philosophyLabel: string;
    philosophy: string;
    principle: string;
    steps: Array<{ number: string; title: string; detail: string }>;
    community: {
      label: string;
      joinLabel: string;
      contactLabel: string;
      join: { eyebrow: string; title: string; body: string; qrAlt: string; qrUnavailable: string };
      contact: {
        eyebrow: string;
        title: string;
        body: string;
        officers: Array<{ role: string; name: string; email: string }>;
      };
      close: string;
    };
  };
  teaching: {
    eyebrow: string;
    title: string;
    body: string;
    edition: string;
    chapter: string;
    question: string;
    objective: string;
    objectiveBody: string;
    materials: string;
    materialItems: string[];
    timeline: Array<{ time: string; label: string }>;
    note: string;
    demoCta: string;
  };
  activities: {
    eyebrow: string;
    title: string;
    body: string;
    photoCaption: string;
    demoCta: string;
  };
  voices: {
    eyebrow: string;
    title: string;
    leadQuote: string;
    sideStories: Array<{ quote: string }>;
    closing: string;
    demoCta: string;
  };
  footer: {
    eyebrow: string;
    title: string;
    body: string;
    statementLabel: string;
    statements: Record<
      "privacy" | "copyright" | "website",
      { label: string; title: string; body: string[] }
    >;
    copyright: string;
  };
  noticeMessage: string;
};

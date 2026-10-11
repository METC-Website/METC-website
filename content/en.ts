import type { HomepageCopy } from "./types";

export const en: HomepageCopy = {
  nav: [
    { id: "explore", en: "Explore METC", zh: "探索 METC" },
    { id: "teaching", en: "Teaching Design", zh: "教学设计" },
    { id: "activities", en: "Classroom Activities", zh: "课堂活动" },
    { id: "voices", en: "Student Voices", zh: "听 TA 们说" }
  ],
  hero: {
    eyebrow: "Math and Engineering Teaching Club",
    title: "Bring questions into class",
    titleAccent: "Let curiosity get its hands dirty",
    body: "A math and engineering teaching club run by students, for students. We build, discuss, and test ideas together.",
    primaryCta: "Start exploring",
    secondaryCta: "See teaching design",
    scroll: "Turn the page"
  },
  explore: {
    eyebrow: "01 — Explore METC",
    title: "We give students questions, not just answers",
    body: "METC was started by high school students. We believe students learn by making predictions, building, trying again when things go wrong, and explaining what they find.",
    missionLabel: "Teaching Mission",
    mission: "Help more students see how their ideas can help solve problems in mathematics and engineering.",
    philosophyLabel: "Educational Philosophy",
    philosophy: "Students design classes for students. We use real questions to connect concepts and student work to see what they have learned.",
    principle: "Curiosity becomes a question. A question becomes something we can build.",
    steps: [
      { number: "01", title: "Curiosity", detail: "Begin with a phenomenon worth asking about" },
      { number: "02", title: "Discovery", detail: "Make room for guesses, failure, and another look" },
      { number: "03", title: "Teaching", detail: "Turn understanding into something shareable" },
      { number: "04", title: "Connection", detail: "Bring peers, disciplines, and the real world together" }
    ],
    community: {
      label: "Community links",
      joinLabel: "Join us",
      contactLabel: "Contact us",
      join: {
        eyebrow: "WeChat",
        title: "Join METC",
        body: "Scan the WeChat QR code to connect with the club.",
        qrAlt: "METC WeChat QR code",
        qrUnavailable: "The WeChat group QR code is temporarily unavailable. Please use “Contact us” to reach the team.",
        qrExpired: "The WeChat group QR code has expired. Please use “Contact us” to reach the team.",
        qrExpiresLabel: "Valid through"
      },
      contact: {
        eyebrow: "Contact",
        title: "Contact METC",
        body: "For questions about METC, please write to a member of the student leadership team.",
        officers: [
          { role: "Leader", name: "Gloria Wu", email: "s24634.wu@stu.scie.com.cn" },
          { role: "Vice Leader", name: "Leo Zhao", email: "s23178.zhao@stu.scie.com.cn" },
          { role: "Vice Leader", name: "Sheryl Xu", email: "s24670.xu@stu.scie.com.cn" }
        ]
      },
      close: "Close"
    }
  },
  teaching: {
    eyebrow: "02 — Teaching Design",
    title: "A good class starts with careful planning",
    body: "From syllabi and slides to classroom materials, we plan each lesson around what students can explore for themselves.",
    edition: "METC COURSE NOTES · 2026",
    chapter: "UNIT 08 / GAS PRESSURE & REACTION FORCES",
    question: "How can baking soda and vinegar launch a bottle rocket?",
    objective: "Learning objective",
    objectiveBody: "Use a safe bottle rocket to observe how carbon-dioxide pressure and Newton's third law work together.",
    materials: "Materials",
    materialItems: ["500 ml pressure-safe plastic bottle", "white vinegar · 50–100 ml", "baking soda · up to 2 scoops", "paper towel or filter paper", "rubber stopper and string", "goggles and gloves"],
    timeline: [
      { time: "01", label: "Pour vinegar into the bottle" },
      { time: "02", label: "Hang the baking-soda packet at the mouth" },
      { time: "03", label: "Seal, invert, and secure the bottle" },
      { time: "04", label: "Shake, stand 3 m back, observe launch" }
    ],
    note: "Margin note: keep the soda dry until the bottle is sealed. Goggles on; observe from the safety line.",
    demoCta: "Enter the Curriculum Library"
  },
  activities: {
    eyebrow: "03 — Classroom Activities",
    title: "Put ideas on the table and test them together",
    body: "Teachers and students gather around the same table. Every discussion, wobbly model, and retest is part of the class.",
    photoCaption: "Shangbu Primary School · Classroom activity",
    demoCta: "Browse classroom albums"
  },
  voices: {
    eyebrow: "04 — Student Voices",
    title: "After one class, what stays with them?",
    leadQuote: "In my opinion, this ECA was very suitable and great for us. It teaches us unique and different information on many topics.",
    sideStories: [
      { quote: "They gave us treats when we answered a question. This teaching style gave us more encouragement and made us more confident to answer questions." },
      { quote: "Their voices are clear and explain it clearly. Making complex sentences more simple." }
    ],
    closing: "What students say after class. / 听听学生课后的话。",
    demoCta: "Read student feedback"
  },
  footer: {
    eyebrow: "Keep the question open.",
    title: "The next class begins with a good question",
    body: "METC · Math and Engineering Teaching Club\nStudent-created. Student-centered.",
    statementLabel: "Statements",
    statements: {
      privacy: {
        label: "Privacy",
        title: "Privacy statement",
        body: [
          "METC does not require visitors to create an account or submit personal information to browse this website.",
          "This browser stores your language preference and uses a cookie to record the IDs of feedback letters you have opened.",
          "If a future contact or registration service collects information, its purpose and handling will be stated before submission."
        ]
      },
      copyright: {
        label: "Copyright",
        title: "Copyright notice",
        body: [
          "© 2026 METC. Unless stated otherwise, the website design, written content, and original teaching materials are protected by copyright.",
          "Please request permission before reproducing, distributing, or adapting content from this website."
        ]
      },
      website: {
        label: "Website statement",
        title: "Website statement",
        body: [
          "This is the official website of METC — Math and Engineering Teaching Club.",
          "Teaching resources and classroom records are published for educational sharing and may be updated as the archive grows.",
          "Photo and feedback privacy: Classroom photographs, activity images, and feedback shown on this website are used only for educational sharing and club documentation. If any photograph or feedback concerns your image rights or personal privacy, please contact us through “Contact us” and identify the relevant content. We will verify and remove it promptly."
        ],
        developers: {
          label: "Developers",
          members: [
            { name: "Hank Chen", email: "s22230.chen@stu.scie.com.cn" },
            { name: "Sheryl Xu", email: "s24670.xu@stu.scie.com.cn" }
          ]
        }
      }
    },
    copyright: "© 2026 METC. All rights reserved."
  },
  noticeMessage: "Additional classroom records are being added to the archive."
};

import type { Language } from "../../content";
import { homepageCopy } from "../../content";
import { CommunityActions } from "./community-actions";

type ExploreSectionProps = { language: Language };

export function ExploreSection({ language }: ExploreSectionProps) {
  const { explore } = homepageCopy[language];

  return (
    <section className="explore-section section-pad" id="explore">
      <div className="section-shell">
        <div className="section-intro reveal">
          <div className="explore-topline">
            <p className="section-eyebrow">{explore.eyebrow}</p>
            <CommunityActions language={language} />
          </div>
          <nav className="explore-jumps" aria-label={language === "zh" ? "探索 METC 内容" : "Explore METC sections"}>
            {[
              { id: "teaching", number: "01", label: language === "zh" ? "教学设计" : "Teaching Design" },
              { id: "activities", number: "02", label: language === "zh" ? "课堂活动" : "Classroom Activities" },
              { id: "voices", number: "03", label: language === "zh" ? "听 TA 们说" : "Student Voices" }
            ].map((item) => (
              <a href={`#${item.id}`} key={item.id}>
                <span>{item.number}</span><strong>{item.label}</strong><i aria-hidden="true">↘</i>
              </a>
            ))}
          </nav>
          <div className="explore-copy">
            <h2 className="section-title preserve-lines">{explore.title}</h2>
            <p className="section-body">{explore.body}</p>
          </div>
        </div>

        <div className="mission-spread reveal">
          <div className="mission-statement">
            <span>{explore.missionLabel}</span>
            <p>{explore.mission}</p>
          </div>
          <div className="philosophy-statement">
            <span>{explore.philosophyLabel}</span>
            <p>{explore.philosophy}</p>
            <em>{explore.principle}</em>
          </div>
          <svg className="mission-pencil-line" viewBox="0 0 760 128" aria-hidden="true">
            <path d="M12 88 C155 32 228 120 355 67 C478 16 564 105 746 38" pathLength="1" />
          </svg>
        </div>

        <ol className="principle-line reveal">
          {explore.steps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

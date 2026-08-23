import type { Language } from "../../content";
import { homepageCopy } from "../../content";

type VoicesSectionProps = { language: Language; onVoicesEnter: () => void };

export function VoicesSection({ language, onVoicesEnter }: VoicesSectionProps) {
  const { voices } = homepageCopy[language];

  return (
    <section className="voices-section section-pad" id="voices">
      <div className="section-shell">
        <div className="voices-heading reveal">
          <p className="section-eyebrow">{voices.eyebrow}</p>
          <div className="voices-heading-main">
            <h2 className="section-title preserve-lines">{voices.title}</h2>
            <button type="button" className="button button-coral section-entry-button" onClick={onVoicesEnter}>
              {voices.demoCta}<span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="editorial-quote reveal">
          <span className="quote-mark" aria-hidden="true">“</span>
          <blockquote>{voices.leadQuote}</blockquote>
          <svg className="quote-underline" viewBox="0 0 540 38" aria-hidden="true"><path d="M8 27 C124 5 337 33 529 13" /></svg>
        </div>

        <div className="voice-margins reveal">
          {voices.sideStories.map((story) => (
            <article key={story.quote}>
              <blockquote>“{story.quote}”</blockquote>
            </article>
          ))}
        </div>

        <p className="voices-closing reveal">{voices.closing}</p>
      </div>
    </section>
  );
}

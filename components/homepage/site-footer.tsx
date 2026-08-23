"use client";

import { useEffect, useRef, useState } from "react";
import type { Language } from "../../content";
import { homepageCopy } from "../../content";

type SiteFooterProps = { language: Language };
type StatementKey = "privacy" | "copyright" | "website";

export function SiteFooter({ language }: SiteFooterProps) {
  const { footer } = homepageCopy[language];
  const [activeStatement, setActiveStatement] = useState<StatementKey | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!activeStatement) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveStatement(null);
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };

    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeStatement]);

  const closeStatement = () => {
    setActiveStatement(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const activeContent = activeStatement ? footer.statements[activeStatement] : null;

  return (
    <>
      <footer className="site-footer">
        <div className="footer-line-art" aria-hidden="true">
          <svg viewBox="0 0 1200 190"><path d="M-10 153 C159 42 322 174 493 87 C649 8 789 151 947 79 C1057 29 1133 55 1212 20" /></svg>
        </div>
        <div className="footer-inner">
          <div className="footer-lead">
            <p className="section-eyebrow">{footer.eyebrow}</p>
            <h2>{footer.title}</h2>
            <p className="preserve-lines">{footer.body}</p>
          </div>
          <div className="footer-nav">
            <div>
              <p>{footer.statementLabel}</p>
              {(Object.keys(footer.statements) as StatementKey[]).map((key) => (
                <button
                  type="button"
                  onClick={(event) => {
                    triggerRef.current = event.currentTarget;
                    setActiveStatement(key);
                  }}
                  key={key}
                >
                  {footer.statements[key].label}
                </button>
              ))}
            </div>
          </div>
          <div className="footer-bottom"><span>{footer.copyright}</span></div>
        </div>
      </footer>

      {activeContent ? (
        <div className="statement-dialog-layer" role="presentation">
          <button className="statement-dialog-backdrop" type="button" aria-label="Close statement" onClick={closeStatement} />
          <section className="statement-dialog" role="dialog" aria-modal="true" aria-labelledby="statement-dialog-title">
            <button ref={closeRef} className="statement-dialog-close" type="button" onClick={closeStatement} aria-label="Close">
              ×
            </button>
            <p className="section-eyebrow">METC · {footer.statementLabel}</p>
            <h2 id="statement-dialog-title">{activeContent.title}</h2>
            {activeContent.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {activeContent.developers ? (
              <div className="statement-developers">
                <h3>{activeContent.developers.label}</h3>
                <ul>
                  {activeContent.developers.members.map((developer) => (
                    <li key={developer.email}>
                      <span>{developer.name}</span>
                      <a href={`mailto:${developer.email}`}>{developer.email}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { homepageCopy, type Language } from "../../content";
import { withSiteBasePath } from "../../lib/site-path";
import contactQr from "../../src/data/resources/generated/contact-qr.json";

type CommunityAction = "join" | "contact";
type QrStatus = "checking" | "available" | "expired" | "error";

const JOIN_QR_CODE_SRC = withSiteBasePath(contactQr.imageSrc);
const JOIN_QR_CODE_EXPIRY = Date.parse(contactQr.expiresAt);
const MAX_TIMEOUT_MILLISECONDS = 2_147_483_647;

export function CommunityActions({ language }: { language: Language }) {
  const community = homepageCopy[language].explore.community;
  const [activeAction, setActiveAction] = useState<CommunityAction | null>(null);
  const [qrStatus, setQrStatus] = useState<QrStatus>("checking");
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const closeDialog = () => {
    setActiveAction(null);
    requestAnimationFrame(() => openerRef.current?.focus());
  };

  useEffect(() => {
    let expiryTimer: ReturnType<typeof setTimeout> | undefined;
    const refreshQrStatus = () => {
      const remaining = JOIN_QR_CODE_EXPIRY - Date.now();
      if (!Number.isFinite(JOIN_QR_CODE_EXPIRY) || remaining <= 0) {
        setQrStatus("expired");
        return;
      }
      setQrStatus((current) => current === "error" ? current : "available");
      expiryTimer = setTimeout(refreshQrStatus, Math.min(remaining, MAX_TIMEOUT_MILLISECONDS));
    };

    refreshQrStatus();
    return () => clearTimeout(expiryTimer);
  }, []);

  useEffect(() => {
    if (!activeAction) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
    };

    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeAction]);

  const openDialog = (action: CommunityAction, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setActiveAction(action);
  };

  return (
    <>
      <div className="explore-community-actions" aria-label={community.label}>
        <button type="button" onClick={(event) => openDialog("join", event.currentTarget)}>{community.joinLabel}<span aria-hidden="true">↗</span></button>
        <button type="button" onClick={(event) => openDialog("contact", event.currentTarget)}>{community.contactLabel}<span aria-hidden="true">↗</span></button>
      </div>

      {activeAction ? (
        <div className="community-dialog-layer" role="presentation">
          <button className="community-dialog-backdrop" type="button" onClick={closeDialog} aria-label={community.close} />
          <section className="community-dialog" role="dialog" aria-modal="true" aria-labelledby="community-dialog-title">
            <button className="community-dialog-close" type="button" onClick={closeDialog} ref={closeRef} aria-label={community.close}>×</button>
            {activeAction === "join" ? (
              <>
                <p className="section-eyebrow">METC · {community.join.eyebrow}</p>
                <h2 id="community-dialog-title">{community.join.title}</h2>
                <p>{community.join.body}</p>
                <div className="join-qr-frame">
                  {qrStatus === "available" ? (
                    <>
                      <img src={JOIN_QR_CODE_SRC} alt={community.join.qrAlt} onError={() => setQrStatus("error")} />
                      <p className="join-qr-expiry">
                        {community.join.qrExpiresLabel}{" "}
                        <time dateTime={contactQr.expiresAt}>
                          {new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-GB", {
                            dateStyle: "medium",
                            timeZone: "Asia/Shanghai",
                          }).format(JOIN_QR_CODE_EXPIRY)}
                        </time>
                      </p>
                    </>
                  ) : (
                    <span>{qrStatus === "expired" ? community.join.qrExpired : community.join.qrUnavailable}</span>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="section-eyebrow">METC · {community.contact.eyebrow}</p>
                <h2 id="community-dialog-title">{community.contact.title}</h2>
                <p>{community.contact.body}</p>
                <ul className="community-contact-list">
                  {community.contact.officers.map((officer) => (
                    <li key={officer.email}>
                      <span>{officer.role}</span>
                      <strong>{officer.name}</strong>
                      <a href={`mailto:${officer.email}`}>{officer.email}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { Language } from "../../content";
import { albums, activitiesCopy, type ActivityAlbum, type GalleryPhoto } from "../../content/activities";
import { SiteFooter } from "../homepage/site-footer";
import { SiteHeader } from "../homepage/site-header";

const LANGUAGE_STORAGE_KEY = "metc-language";

function localized(language: Language, value: Record<Language, string>) {
  return value[language];
}

function Atmosphere() {
  return <div className="site-atmosphere gallery-atmosphere" aria-hidden="true">
    <i className="atmosphere-snow snow-1" /><i className="atmosphere-snow snow-3" /><i className="atmosphere-snow snow-5" />
    <i className="atmosphere-rain rain-2" /><i className="atmosphere-rain rain-5" /><i className="atmosphere-meteor meteor-2" />
  </div>;
}

function GalleryHero({ language }: { language: Language }) {
  const copy = activitiesCopy[language].hero;
  return <section className="gallery-hero" aria-labelledby="gallery-title">
    <div className="gallery-hero-graph-paper" aria-hidden="true" />
    <div className="gallery-hero-corner gallery-corner-one" aria-hidden="true" />
    <div className="gallery-hero-corner gallery-corner-two" aria-hidden="true" />
    <svg className="gallery-hero-sketch gallery-hero-ruler" viewBox="0 0 270 100" aria-hidden="true"><path d="M11 68 250 15l10 43L21 90zM44 61l7 28m19-35 7 28m19-35 7 28m19-35 7 28m19-35 7 28m19-35 7 28m19-35 7 28" /></svg>
    <svg className="gallery-hero-sketch gallery-hero-stars" viewBox="0 0 210 180" aria-hidden="true"><path d="m56 21 6 16 16 6-16 6-6 16-6-16-16-6 16-6zm75 42 4 11 11 4-11 4-4 11-4-11-11-4 11-4zm-50 61 8 21 21 8-21 8-8 21-8-21-21-8 21-8z" /><path d="M136 145c20-34 39-42 62-45M151 143l-1-16m1 16 14-7" /></svg>
    <div className="gallery-hero-content">
      <p className="gallery-eyebrow">{copy.eyebrow}</p>
      <p className="gallery-hero-mark" aria-hidden="true">METC</p>
      <h1 id="gallery-title">{copy.title}</h1>
      <p className="gallery-hero-body">{copy.body}</p>
      <p className="gallery-hero-stats">{copy.stats}</p>
    </div>
    <a className="gallery-browse" href="#album-exhibition"><span>{copy.browse}</span><i aria-hidden="true">↓</i></a>
  </section>;
}

function AlbumCard({ album, index, language, onOpen }: { album: ActivityAlbum; index: number; language: Language; onOpen: (album: ActivityAlbum, trigger: HTMLButtonElement) => void }) {
  const copy = activitiesCopy[language].hall;
  const main = album.photos.find((photo) => photo.id === album.coverPhotoId) ?? album.photos[0];
  const supporting = album.photos.filter((photo) => photo.id !== main.id).slice(0, 3);
  return <div className={`album-slot album-slot-${album.accent}`}>
    <button className="wooden-album" type="button" onClick={(event) => onOpen(album, event.currentTarget)} aria-label={`${copy.open}: ${localized(language, album.title)}`}>
      <span className="album-binding" aria-hidden="true"><i /><i /><i /></span>
      <span className="album-cover-photos" aria-hidden="true">
        {supporting.map((photo, photoIndex) => <img key={photo.id} className={`album-cover-photo album-cover-photo-${photoIndex + 1}`} src={photo.src} alt="" fetchPriority={index === 0 ? "high" : "low"} style={{ objectPosition: photo.position }} />)}
        <span className="album-main-photo"><img src={main.src} alt="" fetchPriority={index === 0 ? "high" : "low"} style={{ objectPosition: main.position }} /></span>
        <span className="album-photo-tape tape-left" /><span className="album-photo-tape tape-right" />
      </span>
      <span className="album-plaque">
        <small>0{index + 1} · {album.year}</small>
        <strong>{localized(language, album.title)}</strong>
        <em>{localized(language, album.subtitle)}</em>
        <i className="plaque-pin plaque-pin-left" aria-hidden="true" /><i className="plaque-pin plaque-pin-right" aria-hidden="true" />
      </span>
      <span className="album-open-cta">{copy.open} <b aria-hidden="true">→</b></span>
    </button>
  </div>;
}

function AlbumExhibition({ language, onOpen }: { language: Language; onOpen: (album: ActivityAlbum, trigger: HTMLButtonElement) => void }) {
  const copy = activitiesCopy[language].hall;
  return <section className="album-exhibition" id="album-exhibition" aria-labelledby="album-exhibition-title">
    <div className="album-exhibition-intro">
      <p className="gallery-eyebrow">{copy.eyebrow}</p>
      <h2 id="album-exhibition-title">{copy.title}</h2>
      <p>{copy.body}</p>
    </div>
    <div className="album-exhibition-grid" role="list">
      <span className="shelf-decoration shelf-decoration-ruler" aria-hidden="true">15 cm</span>
      <span className="shelf-decoration shelf-decoration-pencil" aria-hidden="true" />
      {albums.map((album, index) => <div role="listitem" key={album.id}><AlbumCard album={album} index={index} language={language} onOpen={onOpen} /></div>)}
      <span className="shelf-archive-label" aria-hidden="true">{copy.shelf}</span>
    </div>
  </section>;
}

function PhotoTile({ photo, language, onOpen }: { photo: GalleryPhoto; language: Language; onOpen: (trigger: HTMLButtonElement) => void }) {
  return <button className={`scrapbook-photo scrapbook-photo-${photo.size}`} type="button" onClick={(event) => onOpen(event.currentTarget)} aria-label={localized(language, photo.alt)}>
    <span className="scrapbook-photo-image"><img src={photo.src} alt={localized(language, photo.alt)} decoding="async" style={{ objectPosition: photo.position }} /></span>
    {photo.caption && <span className="scrapbook-caption">{localized(language, photo.caption)}</span>}
    <i className="photo-corner photo-corner-a" aria-hidden="true" /><i className="photo-corner photo-corner-b" aria-hidden="true" />
  </button>;
}

function ExpandedAlbum({ album, language, phase, onClose, onOpenPhoto }: { album: ActivityAlbum; language: Language; phase: "opening" | "open" | "closing"; onClose: () => void; onOpenPhoto: (index: number, trigger: HTMLButtonElement) => void }) {
  const copy = activitiesCopy[language].viewer;
  const useHorizontalSpread = album.id === "school-6bc17c17";
  return <section className={`expanded-album-layer expanded-album-${phase}`} role="dialog" aria-modal="true" aria-label={localized(language, album.title)}>
    <div className="expanded-album-backdrop" onClick={onClose} aria-hidden="true" />
    <button className="album-back-button" type="button" onClick={onClose}>← {copy.back}</button>
    <article className={`expanded-album expanded-album-${album.accent}${useHorizontalSpread ? " expanded-album-horizontal" : ""}`}>
      <div className="expanded-album-cover" aria-hidden="true"><span>{copy.archive}</span><strong>{localized(language, album.title)}</strong><i>{album.year}</i></div>
      <div className="expanded-album-paper">
        <header className="album-viewer-header">
          <p>{String(albums.findIndex((item) => item.id === album.id) + 1).padStart(2, "0")} / {copy.archive}</p>
          <button type="button" onClick={onClose} aria-label={copy.close}>×</button>
        </header>
        <div className="album-viewer-intro">
          <span>{localized(language, album.category)} · {album.year}</span>
          <h2>{localized(language, album.title)}</h2>
          <p>{localized(language, album.subtitle)}</p>
          <p className="album-viewer-description">{localized(language, album.description)}</p>
          <small>{album.photos.length} {copy.photographs}</small>
        </div>
        <div className="scrapbook-grid">
          {album.photos.map((photo, index) => <PhotoTile key={photo.id} photo={photo} language={language} onOpen={(trigger) => onOpenPhoto(index, trigger)} />)}
        </div>
      </div>
    </article>
  </section>;
}

function PhotoLightbox({ album, photoIndex, language, onClose, onPrevious, onNext, initialFocusRef }: { album: ActivityAlbum; photoIndex: number; language: Language; onClose: () => void; onPrevious: () => void; onNext: () => void; initialFocusRef: React.RefObject<HTMLButtonElement | null> }) {
  const photo = album.photos[photoIndex];
  const copy = activitiesCopy[language].lightbox;
  const frameRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !frameRef.current) return;
      const focusable = Array.from(frameRef.current.querySelectorAll<HTMLElement>("button:not([disabled])"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", trapFocus);
    return () => window.removeEventListener("keydown", trapFocus);
  }, []);
  return <section className="photo-lightbox" role="dialog" aria-modal="true" aria-label={`${localized(language, album.title)} — ${copy.photo} ${photoIndex + 1}`}>
    <div className="photo-lightbox-backdrop" onClick={onClose} aria-hidden="true" />
    <div className="photo-lightbox-frame" ref={frameRef}>
      <button className="lightbox-close" type="button" onClick={onClose} ref={initialFocusRef} aria-label={copy.close}>×</button>
      <button className="lightbox-nav lightbox-previous" type="button" onClick={onPrevious} aria-label={copy.previous}>←</button>
      <figure>
        <img src={photo.src} alt={localized(language, photo.alt)} style={{ objectPosition: photo.position }} />
        <figcaption><span>{localized(language, album.title)}</span>{photo.caption && <strong>{localized(language, photo.caption)}</strong>}<small>{photoIndex + 1} / {album.photos.length}</small></figcaption>
      </figure>
      <button className="lightbox-nav lightbox-next" type="button" onClick={onNext} aria-label={copy.next}>→</button>
    </div>
  </section>;
}

export function ActivitiesPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [languageReady, setLanguageReady] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<ActivityAlbum | null>(null);
  const [albumPhase, setAlbumPhase] = useState<"opening" | "open" | "closing">("opening");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showEntryFlash, setShowEntryFlash] = useState(false);
  const albumTriggerRef = useRef<HTMLButtonElement | null>(null);
  const photoTriggerRef = useRef<HTMLButtonElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => { const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY); setLanguage(saved === "zh" || saved === "en" ? saved : "en"); setLanguageReady(true); }, []);
  useEffect(() => { if (!languageReady) return; document.documentElement.lang = language === "zh" ? "zh-CN" : "en"; window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language); }, [language, languageReady]);
  useEffect(() => { if (window.sessionStorage.getItem("metc-gallery-entry") !== "flash") return; window.sessionStorage.removeItem("metc-gallery-entry"); setShowEntryFlash(true); const timer = window.setTimeout(() => setShowEntryFlash(false), 220); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { if (selectedPhotoIndex === null) return; lightboxCloseRef.current?.focus(); }, [selectedPhotoIndex]);
  useEffect(() => {
    if (!selectedAlbum) return;
    const handleKey = (event: KeyboardEvent) => {
      if (selectedPhotoIndex !== null) {
        if (event.key === "Escape") { event.preventDefault(); setSelectedPhotoIndex(null); }
        if (event.key === "ArrowLeft") { event.preventDefault(); setSelectedPhotoIndex((index) => index === null ? null : (index - 1 + selectedAlbum.photos.length) % selectedAlbum.photos.length); }
        if (event.key === "ArrowRight") { event.preventDefault(); setSelectedPhotoIndex((index) => index === null ? null : (index + 1) % selectedAlbum.photos.length); }
      } else if (event.key === "Escape") closeAlbum();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedAlbum, selectedPhotoIndex]);

  function openAlbum(album: ActivityAlbum, trigger: HTMLButtonElement) { albumTriggerRef.current = trigger; setSelectedPhotoIndex(null); setSelectedAlbum(album); setAlbumPhase("opening"); window.setTimeout(() => setAlbumPhase("open"), 760); }
  function closeAlbum() { if (!selectedAlbum || albumPhase === "closing") return; setSelectedPhotoIndex(null); setAlbumPhase("closing"); window.setTimeout(() => { setSelectedAlbum(null); albumTriggerRef.current?.focus(); }, 620); }
  function openPhoto(index: number, trigger: HTMLButtonElement) { photoTriggerRef.current = trigger; setSelectedPhotoIndex(index); }
  function closePhoto() { setSelectedPhotoIndex(null); window.setTimeout(() => photoTriggerRef.current?.focus(), 0); }
  function previousPhoto() { if (!selectedAlbum) return; setSelectedPhotoIndex((index) => index === null ? null : (index - 1 + selectedAlbum.photos.length) % selectedAlbum.photos.length); }
  function nextPhoto() { if (!selectedAlbum) return; setSelectedPhotoIndex((index) => index === null ? null : (index + 1) % selectedAlbum.photos.length); }

  return <><Atmosphere />{showEntryFlash && <div className="teaching-entry-flash" aria-hidden="true" />}<SiteHeader language={language} onToggleLanguage={() => setLanguage((current) => current === "zh" ? "en" : "zh")} variant="secondary" activePage="activities" /><main className={`activities-page${selectedAlbum ? " album-is-open" : ""}`}><GalleryHero language={language} /><AlbumExhibition language={language} onOpen={openAlbum} /></main>{selectedAlbum && <ExpandedAlbum album={selectedAlbum} language={language} phase={albumPhase} onClose={closeAlbum} onOpenPhoto={openPhoto} />}{selectedAlbum && selectedPhotoIndex !== null && <PhotoLightbox album={selectedAlbum} photoIndex={selectedPhotoIndex} language={language} onClose={closePhoto} onPrevious={previousPhoto} onNext={nextPhoto} initialFocusRef={lightboxCloseRef} />}<SiteFooter language={language} /></>;
}

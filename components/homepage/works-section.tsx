"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Language } from "../../content";
import { homepageCopy } from "../../content";
import { localizedSchoolName } from "../../content/activities/albums";
import { withSiteBasePath } from "../../lib/site-path";
import { resourceAlbums } from "../../src/data/resources";

type ActivitySectionProps = {
  language: Language;
  onGalleryEnter: () => void;
};

const AUTOPLAY_DELAY = 2750;
const activityEntranceFocus: Record<string, string> = {
  "school-760d99a4-004": "50% 75%"
};

const homepageFeaturePhotos = resourceAlbums.flatMap((album) => {
  const photo = album.photos.find((item) => item.id === album.homepageFeaturePhotoId);
  return photo ? [{
    ...photo,
    school: localizedSchoolName(album.id, album.school),
    objectPosition: activityEntranceFocus[photo.id] ?? "center"
  }] : [];
});

const fallbackFeaturePhoto = {
  src: withSiteBasePath("/images/metc-classroom-workshop.png"),
  alt: "METC classroom activity",
  school: { zh: "METC", en: "METC" },
  objectPosition: "center"
};

export function ActivitySection({ language, onGalleryEnter }: ActivitySectionProps) {
  const { activities } = homepageCopy[language];
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isCarouselVisible, setIsCarouselVisible] = useState(false);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [leavingPhotoIndex, setLeavingPhotoIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<"next" | "previous">("next");
  const carouselRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const featurePhotos = homepageFeaturePhotos.length ? homepageFeaturePhotos : [fallbackFeaturePhoto];
  const activePhoto = featurePhotos[activePhotoIndex] ?? featurePhotos[0];
  const totalPhotos = featurePhotos.length;
  const photoSource = language === "zh"
    ? `${activePhoto.school.zh} · 课堂活动`
    : `${activePhoto.school.en} · Classroom activity`;
  const changePhoto = useCallback((direction: "next" | "previous") => {
    setLeavingPhotoIndex(activePhotoIndex);
    setSlideDirection(direction);
    setActivePhotoIndex((index) => direction === "next" ? (index + 1) % totalPhotos : (index - 1 + totalPhotos) % totalPhotos);
  }, [activePhotoIndex, totalPhotos]);
  const previousPhoto = () => changePhoto("previous");
  const nextPhoto = () => changePhoto("next");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    if (!("IntersectionObserver" in window)) {
      setIsCarouselVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setIsCarouselVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(carousel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (totalPhotos < 2 || !isCarouselVisible || isCarouselHovered || prefersReducedMotion) return;
    const timer = window.setTimeout(() => changePhoto("next"), AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [changePhoto, isCarouselHovered, isCarouselVisible, prefersReducedMotion, totalPhotos]);

  const finishSwipe = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const offset = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(offset) < 36) return;
    offset > 0 ? previousPhoto() : nextPhoto();
  };

  const leavingPhoto = leavingPhotoIndex === null ? null : featurePhotos[leavingPhotoIndex];

  return (
    <section className="activity-section section-pad" id="activities">
      <div className="section-shell">
        <div className="activity-intro reveal">
          <p className="section-eyebrow">{activities.eyebrow}</p>
          <h2 className="section-title preserve-lines">{activities.title}</h2>
          <div className="section-action-copy">
            <p className="section-body">{activities.body}</p>
            <div className="activity-entry-actions">
              <button type="button" className="button button-coral section-entry-button" onClick={onGalleryEnter}>
                {activities.demoCta}<span>↗</span>
              </button>
            </div>
          </div>
        </div>

        <figure ref={carouselRef} className="classroom-stage reveal" aria-roledescription="carousel" aria-label={language === "zh" ? "课堂活动精选照片" : "Featured classroom photographs"}>
          <div
            className="classroom-photo-wrap"
            tabIndex={0}
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
            onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
            onTouchEnd={finishSwipe}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") previousPhoto();
              if (event.key === "ArrowRight") nextPhoto();
            }}
          >
            {leavingPhoto ? <img key={`leaving-${leavingPhoto.src}`} className={`classroom-photo classroom-photo-leaving classroom-photo-${slideDirection}`} src={leavingPhoto.src} alt="" aria-hidden="true" style={{ objectPosition: leavingPhoto.objectPosition }} onAnimationEnd={() => setLeavingPhotoIndex(null)} /> : null}
            <img key={`active-${activePhoto.src}`} className={`classroom-photo${leavingPhoto ? ` classroom-photo-entering classroom-photo-${slideDirection}` : " classroom-photo-static"}`} src={activePhoto.src} alt={activePhoto.alt} fetchPriority="high" style={{ objectPosition: activePhoto.objectPosition }} />
            <span className="photo-counter">{String(activePhotoIndex + 1).padStart(2, "0")} / {String(totalPhotos).padStart(2, "0")}</span>
            {totalPhotos > 1 ? <>
              <button className="classroom-carousel-control classroom-carousel-previous" type="button" onClick={previousPhoto} aria-label={language === "zh" ? "上一张照片" : "Previous photo"}>←</button>
              <button className="classroom-carousel-control classroom-carousel-next" type="button" onClick={nextPhoto} aria-label={language === "zh" ? "下一张照片" : "Next photo"}>→</button>
            </> : null}
          </div>
          <figcaption>{photoSource}</figcaption>
          <svg className="photo-arrow" viewBox="0 0 170 90" aria-hidden="true"><path d="M7 72 C65 15 111 17 157 48 M143 35 L158 48 L143 59" /></svg>
        </figure>
      </div>
    </section>
  );
}

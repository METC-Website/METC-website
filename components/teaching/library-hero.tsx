import type { Language } from "../../content";

type LibraryHeroProps = { language: Language };

export function LibraryHero({ language }: LibraryHeroProps) {
  const copy = language === "zh"
    ? { eyebrow: "教学设计 · 课程档案", title: "METC 课程图书馆", body: "每一本书，都收录了一门 METC 课程的教学材料。", browse: "浏览书架" }
    : { eyebrow: "Teaching Design · Curriculum Archive", title: "The METC Curriculum Library", body: "Each book brings together the materials for a METC course.", browse: "Browse the shelves" };

  return (
    <section className="library-hero" aria-labelledby="library-title">
      <div className="library-hero-grid" aria-hidden="true" />
      <svg className="library-hero-sketch hero-sketch-ruler" viewBox="0 0 290 88" aria-hidden="true"><path d="M10 60 272 10l8 42L18 82zM38 53l6 28m20-34 6 28m20-34 6 28m20-34 6 28m20-34 6 28m20-34 6 28m20-34 6 28m20-34 6 28" /></svg>
      <svg className="library-hero-sketch hero-sketch-bridge" viewBox="0 0 440 190" aria-hidden="true"><path d="M20 152h400M39 152l74-91 84 91 85-91 119 91M39 152l158-91 85 91M113 61h169" /><circle cx="197" cy="31" r="16" /><path d="M197 47v38m-11-10 11 12 11-12" /></svg>
      <svg className="library-hero-sketch hero-sketch-compass" viewBox="0 0 140 185" aria-hidden="true"><path d="M67 21 19 163M75 21l47 142M51 68h40M55 28l14-14 17 14M17 164h16M106 164h17" /><circle cx="70" cy="18" r="9" /></svg>
      <div className="library-hero-content">
        <p className="library-eyebrow">{copy.eyebrow}</p>
        <p className="library-mark" aria-hidden="true">METC</p>
        <h1 id="library-title">{copy.title}</h1>
        <p className="library-hero-body">{copy.body}</p>
      </div>
      <a className="library-browse" href="#course-library"><span>{copy.browse}</span><i aria-hidden="true">↓</i></a>
    </section>
  );
}

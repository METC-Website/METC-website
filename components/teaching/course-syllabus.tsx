"use client";

import { useEffect, useState } from "react";
import type { Language } from "../../content";
import type { ResourceCourse } from "../../src/data/resources";

type Props = { course: ResourceCourse; language: Language };
type CourseSectionKey = "about" | "contains" | "syllabus";
const courseSectionKeys: CourseSectionKey[] = ["about", "contains", "syllabus"];

function resolveSyllabusAssets(markup: string, syllabusUrl: string) {
  const baseUrl = new URL(syllabusUrl, window.location.origin);
  return markup.replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'])/gi, (_match, prefix, src, suffix) => {
    return `${prefix}${new URL(src, baseUrl).toString()}${suffix}`;
  });
}

function createSyllabusDocument(markup: string, syllabusUrl: string, language: Language) {
  const content = resolveSyllabusAssets(markup, syllabusUrl);
  return `<!doctype html>
<html lang="${language === "zh" ? "zh-CN" : "en"}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      :root { color-scheme: light; }
      body { margin: 22px; color: #52615b; font: 16px/1.62 Arial, "Microsoft YaHei", sans-serif; }
      h1, h2, h3, h4 { margin: 24px 0 9px; color: #19372f; line-height: 1.18; }
      h1 { font-size: 1.7rem; } h2 { font-size: 1.35rem; } h3 { font-size: 1.08rem; }
      p { margin: 0 0 10px; } ul, ol { padding-left: 21px; } li { margin: 4px 0; }
      table { width: 100%; margin: 14px 0; border-collapse: collapse; font-size: .86rem; }
      th, td { padding: 7px; border: 1px solid rgba(25,55,47,.22); vertical-align: top; }
      th { background: rgba(243,200,79,.2); color: #19372f; }
      img { max-width: 100%; height: auto; }
      pre, code { max-width: 100%; overflow-x: auto; }
    </style>
  </head>
  <body>${content}</body>
</html>`;
}

export function CourseSyllabus({ course, language }: Props) {
  const title = course.title[language];
  const category = course.category[language];
  const summary = course.summary[language];
  const topics = course.contains[language];
  const syllabusUrl = course.syllabus[language] ?? course.syllabus.zh ?? course.syllabus.en;
  const [syllabus, setSyllabus] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openSections, setOpenSections] = useState<Set<CourseSectionKey>>(() => new Set(courseSectionKeys));
  useEffect(() => {
    setSyllabus("");
    setLoadFailed(false);
    if (!syllabusUrl) return;
    fetch(syllabusUrl)
      .then(async (response) => {
        if (!response.ok) throw new Error(`Syllabus request failed: ${response.status}`);
        const bytes = await response.arrayBuffer();
        return createSyllabusDocument(new TextDecoder("utf-8").decode(bytes), syllabusUrl, language);
      })
      .then(setSyllabus)
      .catch(() => setLoadFailed(true));
  }, [syllabusUrl]);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const syncViewport = (matches: boolean) => {
      setIsMobile(matches);
      setOpenSections(new Set(matches ? [] : courseSectionKeys));
    };
    syncViewport(media.matches);
    const handleChange = (event: MediaQueryListEvent) => syncViewport(event.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);
  function toggleSection(key: CourseSectionKey) {
    const closingMobileSection = isMobile && openSections.has(key);
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    if (closingMobileSection) {
      window.requestAnimationFrame(() => document.getElementById(`course-${course.id}-${key}-toggle`)?.focus());
    }
  }
  function renderDisclosure(key: CourseSectionKey, title: string, children: React.ReactNode) {
    const open = openSections.has(key);
    const panelId = `course-${course.id}-${key}-panel`;
    const buttonId = `course-${course.id}-${key}-toggle`;
    return <section className={`book-copy-section book-disclosure book-disclosure-${key}`} data-open={open}>
      <button className="book-disclosure-trigger book-disclosure-trigger-inline" type="button" id={buttonId} aria-expanded={isMobile ? open : true} aria-controls={panelId} onClick={() => toggleSection(key)}>
        <span>{title}</span><b aria-hidden="true">{open ? "−" : "+"}</b>
      </button>
      <h3 className="book-disclosure-heading">{title}</h3>
      <div className="book-disclosure-panel" id={panelId} aria-labelledby={buttonId} hidden={isMobile && !open}>{children}</div>
    </section>;
  }
  const copy = language === "zh" ? { archive: "课程档案", category: "课程领域", about: "课程介绍", contains: "包含课程", syllabus: "课程大纲预览", loading: "正在打开课程大纲…", unavailable: "课程大纲暂时无法加载。" } : { archive: "Course archive", category: "Subject", about: "About this course", contains: "Included topics", syllabus: "Syllabus preview", loading: "Opening the syllabus…", unavailable: "The syllabus preview is unavailable." };
  return <div className="book-left-content" tabIndex={0} aria-label={copy.archive} data-mobile-disclosures={isMobile}>
    <div className="book-page-meta"><span>{copy.archive}</span><span>{course.catalog}</span></div><p className="book-course-category">{category}</p><h2>{title}</h2><p className="book-subtitle">{summary}</p>
    <dl className="book-metadata"><div><dt>{copy.category}</dt><dd>{category}</dd></div><div><dt>{language === "zh" ? "课件" : "Decks"}</dt><dd>{course.lessons.length}</dd></div></dl>
    {renderDisclosure("about", copy.about, <p>{summary}</p>)}
    {renderDisclosure("contains", copy.contains, <ol className="book-objectives-list">{topics.map((item, index) => <li key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></li>)}</ol>)}
    {course.hasSyllabus && syllabusUrl && renderDisclosure("syllabus", copy.syllabus, syllabus ? <iframe srcDoc={syllabus} title={`${title} — ${copy.syllabus}`} loading="eager" width="100%" height="520" sandbox="" /> : <p className="syllabus-loading">{loadFailed ? copy.unavailable : copy.loading}</p>)}
  </div>;
}

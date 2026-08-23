"use client";

import { useEffect, useState } from "react";
import type { Language } from "../../content";
import type { ResourceCourse } from "../../src/data/resources";

type Props = { course: ResourceCourse; language: Language };
type CourseSectionKey = "about" | "contains" | "syllabus";
const courseSectionKeys: CourseSectionKey[] = ["about", "contains", "syllabus"];

export function CourseSyllabus({ course, language }: Props) {
  const title = course.title[language];
  const category = course.category[language];
  const summary = course.summary[language];
  const topics = course.contains[language];
  const syllabusUrl = course.syllabus[language] ?? course.syllabus.zh ?? course.syllabus.en;
  const [isMobile, setIsMobile] = useState(false);
  const [openSections, setOpenSections] = useState<Set<CourseSectionKey>>(() => new Set(courseSectionKeys));
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
  const copy = language === "zh" ? { archive: "课程档案", category: "课程领域", about: "课程介绍", contains: "包含课程", syllabus: "课程大纲预览" } : { archive: "Course archive", category: "Subject", about: "About this course", contains: "Included topics", syllabus: "Syllabus preview" };
  return <div className="book-left-content" tabIndex={0} aria-label={copy.archive} data-mobile-disclosures={isMobile}>
    <div className="book-page-meta"><span>{copy.archive}</span><span>{course.catalog}</span></div><p className="book-course-category">{category}</p><h2>{title}</h2><p className="book-subtitle">{summary}</p>
    <dl className="book-metadata"><div><dt>{copy.category}</dt><dd>{category}</dd></div><div><dt>{language === "zh" ? "课件" : "Decks"}</dt><dd>{course.lessons.length}</dd></div></dl>
    {renderDisclosure("about", copy.about, <p>{summary}</p>)}
    {renderDisclosure("contains", copy.contains, <ol className="book-objectives-list">{topics.map((item, index) => <li key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></li>)}</ol>)}
    {course.hasSyllabus && syllabusUrl && renderDisclosure("syllabus", copy.syllabus, <iframe src={syllabusUrl} title={`${title} — ${copy.syllabus}`} loading="eager" width="100%" height="520" />)}
  </div>;
}

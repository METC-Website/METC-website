"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { homepageCopy, type Language } from "../content";
import { TeachingSection } from "./homepage/archive-section";
import { ExploreSection } from "./homepage/explore-section";
import { HeroSection } from "./homepage/hero-section";
import { SiteFooter } from "./homepage/site-footer";
import { SiteHeader } from "./homepage/site-header";
import { VoicesSection } from "./homepage/voices-section";
import { ActivitySection } from "./homepage/works-section";

const LANGUAGE_STORAGE_KEY = "metc-language";

export function MetcHomePage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");
  const [languageReady, setLanguageReady] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === "zh" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    } else {
      setLanguage("en");
    }
    setLanguageReady(true);
  }, []);

  useEffect(() => {
    if (!languageReady) return;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, languageReady]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
      return;
    }

    document.documentElement.classList.add("reveal-enabled");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -6%" }
    );

    document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-enabled");
    };
  }, []);

  useEffect(() => {
    if (!noticeVisible) return;
    const timer = window.setTimeout(() => setNoticeVisible(false), 2300);
    return () => window.clearTimeout(timer);
  }, [noticeVisible]);

  function handleAnchorClick(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function enterLibrary() {
    window.sessionStorage.setItem("metc-library-entry", "flash");
    router.push("/teaching", { scroll: true });
  }

  function enterGallery() {
    window.sessionStorage.setItem("metc-gallery-entry", "flash");
    router.push("/activities", { scroll: true });
  }

  function enterVoices() {
    window.sessionStorage.setItem("metc-voices-entry", "flash");
    router.push("/voices", { scroll: true });
  }

  return (
    <>
      <div className="site-atmosphere" aria-hidden="true">
        <i className="atmosphere-snow snow-1" /><i className="atmosphere-snow snow-2" /><i className="atmosphere-snow snow-3" /><i className="atmosphere-snow snow-4" />
        <i className="atmosphere-snow snow-5" /><i className="atmosphere-snow snow-6" /><i className="atmosphere-snow snow-7" />
        <i className="atmosphere-rain rain-1" /><i className="atmosphere-rain rain-2" /><i className="atmosphere-rain rain-3" /><i className="atmosphere-rain rain-4" />
        <i className="atmosphere-rain rain-5" /><i className="atmosphere-rain rain-6" /><i className="atmosphere-rain rain-7" />
        <i className="atmosphere-meteor meteor-1" /><i className="atmosphere-meteor meteor-2" /><i className="atmosphere-meteor meteor-3" />
      </div>
      <SiteHeader
        language={language}
        onToggleLanguage={() => setLanguage((current) => current === "zh" ? "en" : "zh")}
        onAnchorClick={handleAnchorClick}
      />
      <main className="page-shell">
        <HeroSection language={language} onAnchorClick={handleAnchorClick} />
        <ExploreSection language={language} />
        <TeachingSection language={language} onLibraryEnter={enterLibrary} />
        <ActivitySection language={language} onGalleryEnter={enterGallery} />
        <VoicesSection language={language} onVoicesEnter={enterVoices} />
      </main>
      <SiteFooter language={language} />
      <div className={`site-notice${noticeVisible ? " show" : ""}`} role="status" aria-live="polite">
        {homepageCopy[language].noticeMessage}
      </div>
    </>
  );
}

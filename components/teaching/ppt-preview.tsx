"use client";

import { useEffect, useRef, useState } from "react";
import type { WheelEvent as ReactWheelEvent } from "react";
import type { Language } from "../../content";
import type { ResourceDeck } from "../../src/data/resources";

type Props = { deck: ResourceDeck; language: Language; color: "coral" | "blue" | "mint"; currentSlide: number; onPrevious: () => void; onNext: () => void; onSelect: (index: number) => void; onClose: () => void };

export function PptPreview({ deck, language, color, currentSlide, onPrevious, onNext, onSelect, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const copy = language === "zh" ? { previous: "上一页", next: "下一页", close: "关闭课件预览", slides: "张幻灯片", fullscreen: "全屏查看", exitFullscreen: "退出全屏" } : { previous: "Previous slide", next: "Next slide", close: "Close slide preview", slides: "slides", fullscreen: "View fullscreen", exitFullscreen: "Exit fullscreen" };
  useEffect(() => { closeRef.current?.focus(); const sync = () => setFullscreen(document.fullscreenElement === stageRef.current); document.addEventListener("fullscreenchange", sync); return () => document.removeEventListener("fullscreenchange", sync); }, []);
  async function toggleFullscreen() { if (!stageRef.current) return; if (document.fullscreenElement) await document.exitFullscreen(); else await stageRef.current.requestFullscreen(); }
  function handleModalWheel(event: ReactWheelEvent<HTMLDivElement>) {
    const target = event.target;
    if (target instanceof Element && target.closest(".ppt-stage")) return;
    const spread = document.querySelector<HTMLElement>(".open-book-spread");
    const layer = document.querySelector<HTMLElement>(".open-book-layer");
    const spreadStyle = spread ? getComputedStyle(spread) : null;
    const manualScroller = spread && spreadStyle && ["auto", "scroll"].includes(spreadStyle.overflowY) && spread.scrollHeight > spread.clientHeight ? spread : layer;
    if (!manualScroller) return;
    event.preventDefault();
    manualScroller.scrollBy({ top: event.deltaY, left: event.deltaX, behavior: "auto" });
  }
  return <div className="ppt-modal" role="dialog" aria-modal="true" aria-label={`${deck.title} ${language === "zh" ? "课件预览" : "slide preview"}`} onWheel={handleModalWheel}><div className="ppt-modal-backdrop" onClick={onClose} aria-hidden="true" /><section className={`ppt-viewer ppt-viewer-${color}`}><header><div><p>{deck.title}</p><span>{deck.slideCount} {copy.slides}</span></div><div className="ppt-header-actions"><button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? copy.exitFullscreen : copy.fullscreen}>⛶</button><button ref={closeRef} type="button" onClick={onClose} aria-label={copy.close}>×</button></div></header><div className="ppt-stage ppt-image-stage" ref={stageRef}><img src={deck.slides[currentSlide]} alt={`${deck.title} — ${language === "zh" ? "第" : "Slide "}${currentSlide + 1}${language === "zh" ? "页" : ""}`} /><span className="ppt-slide-number">{String(currentSlide + 1).padStart(2, "0")}</span></div><footer className="ppt-controls"><button type="button" onClick={onPrevious} disabled={currentSlide === 0} aria-label={copy.previous}>←</button><div><span>{currentSlide + 1} / {deck.slides.length}</span><div className="ppt-thumbnails">{deck.slides.map((slide, index) => <button type="button" aria-label={`${language === "zh" ? "前往第" : "Go to slide "}${index + 1}${language === "zh" ? "页" : ""}`} onClick={() => onSelect(index)} className={index === currentSlide ? "active" : ""} key={slide}><img src={slide} alt="" /></button>)}</div></div><button type="button" onClick={onNext} disabled={currentSlide === deck.slides.length - 1} aria-label={copy.next}>→</button></footer></section></div>;
}

import type { Language } from "../types";

export const activitiesCopy: Record<Language, {
  hero: { eyebrow: string; title: string; body: string; stats: string; browse: string };
  hall: { eyebrow: string; title: string; body: string; shelf: string; open: string; photos: string };
  viewer: { archive: string; back: string; photographs: string; close: string; previous: string; next: string };
  lightbox: { close: string; previous: string; next: string; photo: string };
}> = {
  zh: {
    hero: { eyebrow: "CLASSROOM ACTIVITIES · PHOTO ARCHIVE", title: "把课堂留下来", body: "每一次搭建、讨论、失败、重新尝试，都值得被保存。", stats: "课堂 · 项目 · 学生作品 · 教学瞬间", browse: "浏览课堂相册" },
    hall: { eyebrow: "METC CLASSROOM ARCHIVE · 2025—2026", title: "课程相册陈列馆", body: "从陈列架上取下一本相册，重新走进那一次课堂。", shelf: "METC 课堂档案", open: "打开相册", photos: "张照片" },
    viewer: { archive: "METC 课堂档案", back: "返回相册陈列馆", photographs: "张照片", close: "关闭相册", previous: "上一张", next: "下一张" },
    lightbox: { close: "关闭大图", previous: "上一张照片", next: "下一张照片", photo: "照片" }
  },
  en: {
    hero: { eyebrow: "CLASSROOM ACTIVITIES · PHOTO ARCHIVE", title: "Classroom moments to keep", body: "Every build, discussion, failure, and second attempt deserves a place in the archive.", stats: "Classes · Projects · Student Work · Teaching Moments", browse: "Browse the albums" },
    hall: { eyebrow: "METC CLASSROOM ARCHIVE · 2025—2026", title: "Classroom Album Gallery", body: "Take an album from the shelf and step back into that classroom.", shelf: "METC classroom archive", open: "Open album", photos: "photographs" },
    viewer: { archive: "METC Classroom Archive", back: "Back to Gallery", photographs: "photographs", close: "Close album", previous: "Previous", next: "Next" },
    lightbox: { close: "Close photo", previous: "Previous photo", next: "Next photo", photo: "Photo" }
  }
};

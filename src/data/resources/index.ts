import courseData from "./generated/courses.json";
import albumData from "./generated/albums.json";
import { withResourceBaseUrl } from "../../../lib/site-path";

export type ResourceDeck = {
  id: string;
  title: string;
  source: string;
  pdf: string | null;
  slideCount: number;
  slides: string[];
};

export type LocalizedCourseTitle = {
  zh: string;
  en: string;
};

export type LocalizedCourseItems = {
  zh: string[];
  en: string[];
};

export type LocalizedResourcePath = {
  zh: string | null;
  en: string | null;
};

export type ResourceCourse = {
  id: string;
  catalog: string;
  title: LocalizedCourseTitle;
  school: string;
  category: LocalizedCourseTitle;
  color: "coral" | "blue" | "mint";
  icon: "market" | "light" | "spark";
  summary: LocalizedCourseTitle;
  contains: LocalizedCourseItems;
  hasSyllabus: boolean;
  syllabus: LocalizedResourcePath;
  syllabusAssets?: Record<"zh" | "en", string[]>;
  syllabusSource: LocalizedResourcePath;
  lessons: ResourceDeck[];
};

export type ResourcePhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string | null;
  width: number | null;
  height: number | null;
  size: "wide" | "portrait" | "standard";
};

export type ResourceAlbum = {
  id: string;
  school: string;
  title: string;
  subtitle: string;
  description: string;
  accent: "coral" | "sky" | "mint";
  coverPhotoId: string | null;
  homepageFeaturePhotoId?: string;
  photos: ResourcePhoto[];
};

const normalizeResourcePath = withResourceBaseUrl;

export const resourceCourses = (courseData as ResourceCourse[]).map((course) => ({
  ...course,
  syllabus: {
    zh: normalizeResourcePath(course.syllabus.zh),
    en: normalizeResourcePath(course.syllabus.en),
  },
  syllabusAssets: {
    zh: (course.syllabusAssets?.zh ?? []).map((asset) => withResourceBaseUrl(asset) ?? asset),
    en: (course.syllabusAssets?.en ?? []).map((asset) => withResourceBaseUrl(asset) ?? asset),
  },
  lessons: course.lessons.map((lesson) => ({
    ...lesson,
    pdf: normalizeResourcePath(lesson.pdf),
    slides: lesson.slides.map((slide) => withResourceBaseUrl(slide) ?? slide),
  })),
}));

export const resourceAlbums = (albumData as ResourceAlbum[]).map((album) => ({
  ...album,
  photos: album.photos.map((photo) => ({
    ...photo,
    src: withResourceBaseUrl(photo.src) ?? photo.src,
  })),
}));

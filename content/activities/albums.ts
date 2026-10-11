import { resourceAlbums } from "../../src/data/resources";
import type { ActivityAlbum, GalleryPhoto, LocalizedText } from "./types";

const local = (text: string): LocalizedText => ({ zh: text, en: text });

const schoolNames: Record<string, LocalizedText> = {
  "school-98ccc29e": { zh: "上步小学", en: "Shangbu Primary School" },
  "school-6bc17c17": { zh: "太阳村小学（线上）", en: "Taiyangcun Primary School (Online)" },
  "school-b3dc235f": { zh: "普林云海", en: "Princeton Skylake International School" },
  "school-025a2992": { zh: "梅丽小学", en: "Meili Primary School" },
  "school-1a60436e": { zh: "城市绿洲", en: "Green Oasis School" },
  "school-760d99a4": { zh: "靖轩小学", en: "Jingxuan Primary School" }
};

const albumTitles: Record<string, LocalizedText> = {
  "school-1a60436e": {
    zh: "城市绿洲（2026-S2）",
    en: "Green Oasis School (2026-S2)"
  }
};

export function localizedSchoolName(albumId: string, fallback: string): LocalizedText {
  return schoolNames[albumId] ?? local(fallback);
}

function localizedAlbumTitle(album: (typeof resourceAlbums)[number]): LocalizedText {
  return albumTitles[album.id] ?? localizedSchoolName(album.id, album.school);
}

function toPhoto(photo: (typeof resourceAlbums)[number]["photos"][number], title: LocalizedText): GalleryPhoto {
  return {
    id: photo.id,
    src: photo.src,
    alt: title,
    caption: photo.caption ? local(photo.caption) : undefined,
    size: photo.size === "wide" ? "wide" : photo.size === "portrait" ? "portrait" : "standard"
  };
}

export const albums: ActivityAlbum[] = resourceAlbums.filter((album) => album.photos.length > 0).map((album) => {
  const title = localizedAlbumTitle(album);

  return {
    id: album.id,
    title,
    subtitle: { zh: album.subtitle, en: "METC classroom activities" },
    description: { zh: album.description, en: "Classroom moments of students discussing, experimenting, creating, and sharing." },
    year: "METC",
    category: { zh: "活动成果", en: "Classroom activities" },
    coverPhotoId: album.coverPhotoId ?? album.photos[0].id,
    accent: album.accent,
    photos: album.photos.map((photo) => toPhoto(photo, title))
  };
});

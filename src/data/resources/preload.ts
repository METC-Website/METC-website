import { feedbacks } from "../../../content/voices";
import { resourceAlbums, resourceCourses } from ".";

export type PreloadResourceGroup = {
  images: string[];
  syllabi: string[];
};

export type RouteResourceManifest = {
  critical: PreloadResourceGroup;
  page: PreloadResourceGroup;
};

function unique(values: Array<string | null | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

function group(images: Array<string | null | undefined> = [], syllabi: Array<string | null | undefined> = []): PreloadResourceGroup {
  return { images: unique(images), syllabi: unique(syllabi) };
}

const activityImages = unique(resourceAlbums.flatMap((album) => album.photos.map((photo) => photo.src)));
const activityCoverImages = unique(resourceAlbums.flatMap((album) => {
  const cover = album.photos.find((photo) => photo.id === album.coverPhotoId) ?? album.photos[0];
  if (!cover) return [];
  return [cover.src, ...album.photos.filter((photo) => photo.id !== cover.id).slice(0, 3).map((photo) => photo.src)];
}));
const homepageImages = unique(resourceAlbums.flatMap((album) => {
  const feature = album.photos.find((photo) => photo.id === album.homepageFeaturePhotoId);
  return feature?.src ? [feature.src] : [];
}));
const feedbackImages = unique(feedbacks.map((feedback) => feedback.imageSrc));
const syllabusImages = unique(resourceCourses.flatMap((course) => [
  ...(course.syllabusAssets?.zh ?? []),
  ...(course.syllabusAssets?.en ?? []),
]));
const syllabi = unique(resourceCourses.flatMap((course) => [course.syllabus.zh, course.syllabus.en]));

export const allResourceManifest = group(
  [...activityImages, ...feedbackImages, ...syllabusImages],
  syllabi,
);

/**
 * Resources are ordered by how likely the visitor is to need them on the
 * current route. Critical items begin immediately; the rest of that page is
 * loaded before unrelated site resources.
 */
export const routeResourceManifest: Record<string, RouteResourceManifest> = {
  "/": {
    critical: group(homepageImages.slice(0, 1)),
    page: group(homepageImages.slice(1)),
  },
  "/activities": {
    critical: group(activityCoverImages.slice(0, 4)),
    page: group(activityImages.filter((url) => !activityCoverImages.slice(0, 4).includes(url))),
  },
  "/teaching": {
    critical: group([], syllabi.slice(0, 1)),
    page: group(syllabusImages, syllabi.slice(1)),
  },
  "/voices": {
    critical: group(feedbackImages.slice(0, 1)),
    page: group(feedbackImages.slice(1)),
  },
};

export function resourcesForRoute(pathname: string) {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const route = routeResourceManifest[normalizedPath] ?? routeResourceManifest["/"];
  const prioritized = new Set([
    ...route.critical.images,
    ...route.critical.syllabi,
    ...route.page.images,
    ...route.page.syllabi,
  ]);

  return {
    ...route,
    background: group(
      allResourceManifest.images.filter((url) => !prioritized.has(url)),
      allResourceManifest.syllabi.filter((url) => !prioritized.has(url)),
    ),
  };
}

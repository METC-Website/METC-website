import type { StudentFeedback } from "./types";
import generatedFeedbacks from "../../src/data/resources/generated/feedbacks.json";
import { withResourceBaseUrl } from "../../lib/site-path";

const publishedFeedbacks = (generatedFeedbacks as Array<StudentFeedback & { objectKey: string }>).map(({ objectKey: _objectKey, ...feedback }) => ({
  ...feedback,
  imageSrc: withResourceBaseUrl(feedback.imageSrc) ?? feedback.imageSrc,
}));

export const feedbacks: StudentFeedback[] = publishedFeedbacks;

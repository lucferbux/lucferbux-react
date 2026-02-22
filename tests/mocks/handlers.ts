/**
 * MSW handlers for mocking Firestore REST API responses.
 * Used in integration tests to simulate Firestore data.
 */
import { http, HttpResponse } from "msw";

const FIRESTORE_BASE =
  "https://firestore.googleapis.com/v1/projects/*/databases/(default)/documents";

// Sample data
export const mockNewsData = [
  {
    name: "projects/test/databases/(default)/documents/intro/1",
    fields: {
      title: { stringValue: "Noticia Test" },
      title_en: { stringValue: "Test News" },
      description: { stringValue: "Desc test" },
      description_en: { stringValue: "Test desc" },
      url: { stringValue: "https://example.com" },
      image: { stringValue: "https://example.com/img.png" },
      timestamp: { timestampValue: "2024-01-15T10:00:00Z" },
      loaded: { booleanValue: true },
    },
  },
];

export const mockPostData = [
  {
    name: "projects/test/databases/(default)/documents/patent/1",
    fields: {
      title: { stringValue: "Post Test" },
      title_en: { stringValue: "Test Post" },
      description: { stringValue: "Desc test" },
      description_en: { stringValue: "Test desc" },
      link: { stringValue: "https://example.com/post" },
      image: { stringValue: "https://example.com/post.png" },
      date: { timestampValue: "2024-01-15T10:00:00Z" },
      loaded: { booleanValue: true },
    },
  },
];

export const mockProjectData = [
  {
    name: "projects/test/databases/(default)/documents/project/1",
    fields: {
      title: { stringValue: "Proyecto Test" },
      title_en: { stringValue: "Test Project" },
      description: { stringValue: "Desc test" },
      description_en: { stringValue: "Test desc" },
      link: { stringValue: "https://github.com/test" },
      tags: { stringValue: "React, TypeScript" },
      featured: { booleanValue: true },
      date: { timestampValue: "2024-01-15T10:00:00Z" },
      version: { stringValue: "1.0" },
    },
  },
];

export const mockWorkData = [
  {
    name: "projects/test/databases/(default)/documents/team/1",
    fields: {
      avatar: { stringValue: "https://example.com/avatar.png" },
      icon: { stringValue: "https://example.com/icon.png" },
      name: { stringValue: "Test Worker" },
      name_en: { stringValue: "Test Worker EN" },
      description: { stringValue: "Desc test" },
      description_en: { stringValue: "Test desc" },
      job: { stringValue: "Dev" },
      job_en: { stringValue: "Developer" },
      loaded: { booleanValue: true },
      importance: { integerValue: "1" },
    },
  },
];

export const handlers = [
  http.get(`${FIRESTORE_BASE}/intro`, () => {
    return HttpResponse.json({ documents: mockNewsData });
  }),
  http.get(`${FIRESTORE_BASE}/patent`, () => {
    return HttpResponse.json({ documents: mockPostData });
  }),
  http.get(`${FIRESTORE_BASE}/project`, () => {
    return HttpResponse.json({ documents: mockProjectData });
  }),
  http.get(`${FIRESTORE_BASE}/team`, () => {
    return HttpResponse.json({ documents: mockWorkData });
  }),
];

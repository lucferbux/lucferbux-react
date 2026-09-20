import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadTask,
} from "firebase/storage";
import { storage } from "../firebase";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export class UploadError extends Error {
  constructor(
    message: string,
    readonly code: "too-large" | "wrong-type" | "failed"
  ) {
    super(message);
    this.name = "UploadError";
  }
}

/** Keep object names predictable and URL-safe. */
function sanitize(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function buildObjectPath(prefix: string, filename: string): string {
  return `${prefix}/${Date.now()}-${sanitize(filename)}`;
}

/**
 * Upload an image and return its public download URL.
 *
 * The URL is what gets stored on the document, so the read path is unchanged
 * and existing third-party image URLs keep working alongside uploaded ones.
 *
 * Shared with `scripts/` so generated post banners upload through exactly the
 * same code as manual admin uploads.
 */
export async function uploadImage(
  file: Blob & { name?: string; type: string; size: number },
  prefix: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new UploadError("Only image files can be uploaded", "wrong-type");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadError("Images must be smaller than 5 MB", "too-large");
  }

  const objectPath = buildObjectPath(prefix, file.name ?? "upload.png");
  const task: UploadTask = uploadBytesResumable(
    ref(storage, objectPath),
    file,
    {
      contentType: file.type,
    }
  );

  await new Promise<void>((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) =>
        onProgress?.(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        ),
      (error) => reject(new UploadError(error.message, "failed")),
      () => resolve()
    );
  });

  return getDownloadURL(task.snapshot.ref);
}

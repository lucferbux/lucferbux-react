import { useRef, useState } from "react";
import { MAX_IMAGE_BYTES, UploadError, uploadImage } from "@/lib/storage";
import type { Locale } from "@/i18n/locales";

interface ImageFieldProps {
  id: string;
  describedBy?: string;
  storagePath: string;
  value: string;
  uiLocale: Locale;
  onChange: (value: string) => void;
}

const COPY = {
  en: {
    upload: "Upload image",
    uploading: "Uploading",
    orPasteUrl: "or paste a URL",
    remove: "Remove",
    tooLarge: "Images must be smaller than 5 MB",
    wrongType: "Only image files can be uploaded",
    failed: "Upload failed. Try again.",
  },
  es: {
    upload: "Subir imagen",
    uploading: "Subiendo",
    orPasteUrl: "o pega una URL",
    remove: "Quitar",
    tooLarge: "Las imágenes deben pesar menos de 5 MB",
    wrongType: "Sólo se pueden subir archivos de imagen",
    failed: "La subida ha fallado. Inténtalo de nuevo.",
  },
} satisfies Record<Locale, Record<string, string>>;

/**
 * Uploads to Firebase Storage and stores the resulting download URL, so the
 * read path is unchanged and the existing third-party image URLs in Firestore
 * keep working. Pasting a URL directly is still supported.
 */
export default function ImageField({
  id,
  describedBy,
  storagePath,
  value,
  uiLocale,
  onChange,
}: ImageFieldProps) {
  const t = COPY[uiLocale];
  const fileInput = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploadError(null);
    setProgress(0);
    try {
      const url = await uploadImage(file, storagePath, setProgress);
      onChange(url);
    } catch (error) {
      if (error instanceof UploadError) {
        setUploadError(
          error.code === "too-large"
            ? t.tooLarge
            : error.code === "wrong-type"
              ? t.wrongType
              : t.failed
        );
      } else {
        setUploadError(t.failed);
      }
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="grid gap-2">
      <input
        id={id}
        type="url"
        inputMode="url"
        aria-describedby={describedBy}
        placeholder={t.orPasteUrl}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input"
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={progress !== null}
          className="admin-btn admin-btn-ghost px-3 py-1.5 text-sm"
        >
          {progress === null ? t.upload : `${t.uploading} ${progress}%`}
        </button>

        {value && (
          <>
            <img
              src={value}
              alt=""
              className="h-10 w-10 rounded object-cover"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="admin-btn admin-btn-danger px-3 py-1.5 text-sm"
            >
              {t.remove}
            </button>
          </>
        )}
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {progress !== null && (
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-admin-border)]"
        >
          <div
            className="h-full bg-[var(--color-primary)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {uploadError && (
        <p
          role="alert"
          className="text-xs font-medium text-[var(--color-danger)]"
        >
          {uploadError}
        </p>
      )}

      <p className="sr-only">{`Maximum ${MAX_IMAGE_BYTES / 1024 / 1024} MB`}</p>
    </div>
  );
}

import { useEffect, useRef } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import type { Locale } from "@/i18n/locales";

const COPY = {
  en: { confirm: "Delete", cancel: "Cancel", title: "Delete this entry?" },
  es: {
    confirm: "Eliminar",
    cancel: "Cancelar",
    title: "¿Eliminar esta entrada?",
  },
} satisfies Record<Locale, Record<string, string>>;

interface ConfirmDialogProps {
  open: boolean;
  /** Name of the thing being deleted, shown so the row is unambiguous. */
  subject: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Replaces `window.confirm`, which cannot be styled, cannot be tested without
 * stubbing a global, and is blocked outright in some embedded contexts.
 */
export default function ConfirmDialog({
  open,
  subject,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { locale } = useTranslation();
  const t = COPY[locale];
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={t.title}
        className="surface-card w-full max-w-[420px] rounded-xl p-6"
      >
        <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
          {t.title}
        </h2>
        <p className="mb-5 text-sm break-words opacity-70 dark:text-white">
          {subject}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-black/15 px-4 py-2 transition hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            {t.cancel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

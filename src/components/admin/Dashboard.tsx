import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { SCHEMAS } from "@/data/schema";
import { useTranslation } from "@/i18n/LanguageContext";
import type { Locale } from "@/i18n/locales";
import { KNOWN_POST_SLUGS } from "@/pages/BlogPostPage";

const COPY = {
  en: {
    heading: "Dashboard",
    signedInAs: "Signed in as",
    signOut: "Sign out",
    entries: "entries",
    entry: "entry",
    counting: "…",
    countFailed: "—",
    manage: "Manage",
    blogTitle: "Blog posts",
    blogBody: (n: number) =>
      `${n} markdown ${n === 1 ? "post" : "posts"} in the repository. Link one from a post entry instead of an external URL.`,
  },
  es: {
    heading: "Panel",
    signedInAs: "Sesión iniciada como",
    signOut: "Cerrar sesión",
    entries: "entradas",
    entry: "entrada",
    counting: "…",
    countFailed: "—",
    manage: "Gestionar",
    blogTitle: "Artículos del blog",
    blogBody: (n: number) =>
      `${n} ${n === 1 ? "artículo" : "artículos"} markdown en el repositorio. Enlaza uno desde una entrada en vez de usar una URL externa.`,
  },
} satisfies Record<Locale, Record<string, unknown>>;

type Counts = Record<string, number | "error" | undefined>;

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { locale } = useTranslation();
  const t = COPY[locale];
  const [counts, setCounts] = useState<Counts>({});

  useEffect(() => {
    let cancelled = false;

    // Firestore aggregation: one read per collection, not one per document.
    Promise.all(
      Object.values(SCHEMAS).map(async (schema) => {
        try {
          const snapshot = await getCountFromServer(
            collection(db, schema.path)
          );
          return [schema.key, snapshot.data().count] as const;
        } catch {
          return [schema.key, "error"] as const;
        }
      })
    ).then((entries) => {
      if (!cancelled) setCounts(Object.fromEntries(entries));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* Sits on the teal part of the wave, so it is white like the public
          section headings rather than a dark block on a dark background. */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] leading-[1.1] font-bold text-white drop-shadow-sm max-xs:text-[32px]">
            {t.heading}
          </h1>
          {user?.email && (
            <p className="mt-1 text-[14px] text-white/75">
              {t.signedInAs} {user.email}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="admin-btn admin-btn-danger bg-white/90 hover:bg-[var(--color-danger)]"
        >
          {t.signOut}
        </button>
      </div>

      <ul className="grid list-none grid-cols-2 gap-4 p-0 max-md:grid-cols-1">
        {Object.values(SCHEMAS).map((schema) => {
          const count = counts[schema.key];
          return (
            <li key={schema.key}>
              <Link
                to={`/admin/${schema.key}`}
                className="admin-panel admin-panel-interactive flex items-center gap-4 p-5 no-underline"
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(200.44deg, #c98c31 13.57%, #eabe7d 98.38%)",
                  }}
                >
                  <img
                    src={`/images/icons/${schema.icon}.svg`}
                    alt=""
                    className="h-6 w-6"
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-semibold text-[var(--color-admin-text)]">
                    {schema.label[locale]}
                  </span>
                  <span className="block text-[13px] text-[var(--color-admin-muted)]">
                    {t.manage}
                  </span>
                </span>

                <span className="text-right">
                  <span className="block text-[26px] leading-none font-bold text-[var(--color-admin-text)]">
                    {count === undefined
                      ? t.counting
                      : count === "error"
                        ? t.countFailed
                        : count}
                  </span>
                  <span className="block text-[12px] text-[var(--color-admin-muted)]">
                    {count === 1 ? t.entry : t.entries}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="admin-panel mt-4 p-5">
        <p className="text-[17px] font-semibold text-[var(--color-admin-text)]">
          {t.blogTitle}
        </p>
        <p className="mt-1 text-[14px] text-[var(--color-admin-muted)]">
          {t.blogBody(KNOWN_POST_SLUGS.length)}
        </p>
      </div>
    </div>
  );
}

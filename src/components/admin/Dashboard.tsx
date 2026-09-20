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
    signOut: "Sign out",
    entries: "entries",
    counting: "counting…",
    countFailed: "count unavailable",
    linkCheck: "Blog links",
    linkCheckOk: (n: number) => `${n} markdown posts available`,
  },
  es: {
    heading: "Panel",
    signOut: "Cerrar sesión",
    entries: "entradas",
    counting: "contando…",
    countFailed: "recuento no disponible",
    linkCheck: "Enlaces del blog",
    linkCheckOk: (n: number) => `${n} artículos markdown disponibles`,
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            {t.heading}
          </h1>
          {user?.email && (
            <p className="text-sm opacity-60 dark:text-white">{user.email}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded-lg border border-black/15 px-4 py-2 text-sm transition hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
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
                className="surface-card flex items-center gap-4 rounded-xl p-5 no-underline transition"
              >
                <img
                  src={`/images/icons/${schema.icon}.svg`}
                  alt=""
                  className="h-8 w-8"
                />
                <div>
                  <p className="font-semibold text-black dark:text-white">
                    {schema.label[locale]}
                  </p>
                  <p className="text-sm opacity-60 dark:text-white">
                    {count === undefined
                      ? t.counting
                      : count === "error"
                        ? t.countFailed
                        : `${count} ${t.entries}`}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="surface-card mt-4 rounded-xl p-5">
        <p className="font-semibold text-black dark:text-white">
          {t.linkCheck}
        </p>
        <p className="text-sm opacity-60 dark:text-white">
          {t.linkCheckOk(KNOWN_POST_SLUGS.length)}
        </p>
      </div>
    </div>
  );
}

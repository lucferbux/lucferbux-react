import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const collections = [
  {
    name: "News",
    path: "/admin/news",
    collection: "intro",
    description: "Manage news items and announcements",
    icon: "📰",
  },
  {
    name: "Posts",
    path: "/admin/posts",
    collection: "patent",
    description: "Manage blog posts and articles",
    icon: "📝",
  },
  {
    name: "Projects",
    path: "/admin/projects",
    collection: "project",
    description: "Manage portfolio projects",
    icon: "🚀",
  },
  {
    name: "Work",
    path: "/admin/work",
    collection: "team",
    description: "Manage work experience entries",
    icon: "💼",
  },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-sm">
            Dashboard
          </h2>
          <p className="text-sm text-white/70">
            Signed in as {user?.email}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="rounded-lg border border-white/20 bg-[rgba(66,66,66,0.3)] px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-[rgba(66,66,66,0.5)]"
        >
          Sign Out
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {collections.map((c) => (
          <Link
            key={c.path}
            to={c.path}
            className="group rounded-xl border border-white/10 bg-[rgba(66,66,66,0.3)] p-6 backdrop-blur-[40px] transition hover:bg-[rgba(66,66,66,0.45)] hover:shadow-lg"
          >
            <div className="mb-2 text-3xl">{c.icon}</div>
            <h3 className="mb-1 text-lg font-semibold text-white">
              {c.name}
            </h3>
            <p className="mb-2 text-sm text-white/70">
              {c.description}
            </p>
            <span className="font-mono text-xs text-white/40">
              Collection: {c.collection}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

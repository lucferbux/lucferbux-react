import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const collections = [
  {
    name: "News",
    path: "/admin/news",
    collection: "intro",
    description: "Manage news items and announcements",
  },
  {
    name: "Posts",
    path: "/admin/posts",
    collection: "patent",
    description: "Manage blog posts and articles",
  },
  {
    name: "Projects",
    path: "/admin/projects",
    collection: "project",
    description: "Manage portfolio projects",
  },
  {
    name: "Work",
    path: "/admin/work",
    collection: "team",
    description: "Manage work experience entries",
  },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Signed in as {user?.email}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Sign Out
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {collections.map((c) => (
          <Link
            key={c.path}
            to={c.path}
            className="rounded-xl border border-gray-200 bg-white p-6 transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {c.name}
            </h3>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              {c.description}
            </p>
            <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
              Collection: {c.collection}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

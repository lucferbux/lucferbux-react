import { useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import type { Project, ProjectId } from "@/data/model/project";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const COLLECTION = "project";

const emptyProject: Project = {
  title: "",
  title_en: "",
  description: "",
  description_en: "",
  link: "",
  tags: "",
  featured: false,
  date: new Date(),
  version: "",
};

export default function ProjectEditor() {
  const { data, loading, error } = useFirestoreCollection<ProjectId>(
    COLLECTION,
    [orderBy("date", "desc")]
  );
  const [editing, setEditing] = useState<ProjectId | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Project>(emptyProject);
  const [saving, setSaving] = useState(false);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyProject);
    setCreating(true);
  };

  const startEdit = (item: ProjectId) => {
    setCreating(false);
    setEditing(item);
    setForm({
      title: item.title,
      title_en: item.title_en,
      description: item.description,
      description_en: item.description_en,
      link: item.link,
      tags: item.tags,
      featured: item.featured,
      date: item.date,
      version: item.version,
    });
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
    setForm(emptyProject);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, date: Timestamp.now() };
      if (creating) {
        await addDoc(collection(db, COLLECTION), payload);
      } else if (editing) {
        await updateDoc(doc(db, COLLECTION, editing.id), payload);
      }
      cancel();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteDoc(doc(db, COLLECTION, id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  if (creating || editing) {
    return (
      <div className="rounded-xl border border-white/10 bg-[rgba(66,66,66,0.3)] p-6 backdrop-blur-[40px]">
        <h2 className="mb-4 text-xl font-bold text-white">
          {creating ? "Create Project" : "Edit Project"}
        </h2>
        <div className="space-y-4">
          {(["title", "title_en", "description", "description_en", "link", "tags", "version"] as const).map(
            (field) => (
              <div key={field}>
                <label className="mb-1 block text-sm font-medium text-white/80">
                  {field}{field === "tags" ? " (comma separated)" : ""}
                </label>
                <input
                  type="text"
                  value={String(form[field])}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/40 backdrop-blur-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )
          )}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white/80">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 accent-primary"
              />
              Featured
            </label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primaryDark disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={cancel}
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white drop-shadow-sm">
          Projects ({data.length})
        </h2>
        <button
          onClick={startCreate}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primaryDark"
        >
          + Add Project
        </button>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[rgba(66,66,66,0.3)] p-4 backdrop-blur-[40px] transition hover:bg-[rgba(66,66,66,0.45)]"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-white">
                  {item.title_en || item.title}
                </p>
                {item.featured && (
                  <span className="rounded bg-primary/20 px-2 py-0.5 text-xs text-primary">
                    Featured
                  </span>
                )}
                {item.version && (
                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/60">
                    v{item.version}
                  </span>
                )}
              </div>
              <p className="truncate text-sm text-white/60">
                {item.tags}
              </p>
            </div>
            <div className="ml-4 flex gap-2">
              <button
                onClick={() => startEdit(item)}
                className="rounded px-3 py-1 text-sm text-primary hover:bg-primary/10"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="rounded px-3 py-1 text-sm text-red-400 hover:bg-red-900/20"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

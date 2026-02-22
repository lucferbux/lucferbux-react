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
import type { News, NewsId } from "@/data/model/news";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const COLLECTION = "intro";

const emptyNews: News = {
  title: "",
  title_en: "",
  description: "",
  description_en: "",
  url: "",
  image: "",
  timestamp: new Date(),
  loaded: true,
};

export default function NewsEditor() {
  const { data, loading, error } = useFirestoreCollection<NewsId>(
    COLLECTION,
    [orderBy("timestamp", "desc")]
  );
  const [editing, setEditing] = useState<NewsId | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<News>(emptyNews);
  const [saving, setSaving] = useState(false);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyNews);
    setCreating(true);
  };

  const startEdit = (item: NewsId) => {
    setCreating(false);
    setEditing(item);
    setForm({
      title: item.title,
      title_en: item.title_en,
      description: item.description,
      description_en: item.description_en,
      url: item.url,
      image: item.image,
      timestamp: item.timestamp,
      loaded: item.loaded,
    });
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
    setForm(emptyNews);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, timestamp: Timestamp.now() };
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
          {creating ? "Create News" : "Edit News"}
        </h2>
        <div className="space-y-4">
          {(["title", "title_en", "description", "description_en", "url", "image"] as const).map(
            (field) => (
              <div key={field}>
                <label className="mb-1 block text-sm font-medium text-white/80">
                  {field}
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
          News ({data.length})
        </h2>
        <button
          onClick={startCreate}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primaryDark"
        >
          + Add News
        </button>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[rgba(66,66,66,0.3)] p-4 backdrop-blur-[40px] transition hover:bg-[rgba(66,66,66,0.45)]"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">
                {item.title_en || item.title}
              </p>
              <p className="truncate text-sm text-white/60">
                {item.url}
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

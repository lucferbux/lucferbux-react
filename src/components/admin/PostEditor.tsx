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
import type { Post, PostId } from "@/data/model/post";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const COLLECTION = "patent";

const emptyPost: Post = {
  title: "",
  title_en: "",
  description: "",
  description_en: "",
  link: "",
  image: "",
  date: new Date(),
  loaded: true,
  internalLink: "",
};

export default function PostEditor() {
  const { data, loading, error } = useFirestoreCollection<PostId>(
    COLLECTION,
    [orderBy("date", "desc")]
  );
  const [editing, setEditing] = useState<PostId | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Post>(emptyPost);
  const [saving, setSaving] = useState(false);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyPost);
    setCreating(true);
  };

  const startEdit = (item: PostId) => {
    setCreating(false);
    setEditing(item);
    setForm({
      title: item.title,
      title_en: item.title_en,
      description: item.description,
      description_en: item.description_en,
      link: item.link,
      image: item.image,
      date: item.date,
      loaded: item.loaded,
      internalLink: item.internalLink || "",
    });
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
    setForm(emptyPost);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        date: Timestamp.now(),
        internalLink: form.internalLink || null,
      };
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
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {creating ? "Create Post" : "Edit Post"}
        </h2>
        <div className="space-y-4">
          {(["title", "title_en", "description", "description_en", "link", "image", "internalLink"] as const).map(
            (field) => (
              <div key={field}>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field}{field === "internalLink" ? " (optional, e.g. /blog/my-slug)" : ""}
                </label>
                <input
                  type="text"
                  value={String(form[field] ?? "")}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 dark:border-gray-600 dark:text-gray-300"
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Posts ({data.length})
        </h2>
        <button
          onClick={startCreate}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primaryDark"
        >
          + Add Post
        </button>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                {item.title_en || item.title}
              </p>
              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                {item.link}
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
                className="rounded px-3 py-1 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
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

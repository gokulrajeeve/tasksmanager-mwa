"use client";

import { useState } from "react";
import { Task } from "@/utils/types";

type TaskFormProps = {
  onSubmit: (task: {
    title: string;
    description: string;
    assigned_to?: string | null;
    category: Task["category"];
  }) => Promise<void>;
  users?: { id: string; email: string }[];
  variant?: "admin" | "user";   // 👈 controls whether to show assignee
  currentUserId?: string;       // 👈 used in user mode
};

export default function TaskForm({
  onSubmit,
  users = [],
  variant = "admin",
  currentUserId,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [category, setCategory] = useState<Task["category"] | "">("");
  const [loading, setLoading] = useState(false);

  const isUserMode = variant === "user";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await onSubmit({
      title,
      description,
      category: category as Task["category"],
      assigned_to: isUserMode
        ? (currentUserId ?? null)
        : (assignedTo || null),
    });

    setTitle("");
    setDescription("");
    setAssignedTo("");
    setCategory("");
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white"
    >
      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        {isUserMode ? "Create My Task" : "Create a New Task"}
      </h3>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            type="text"
            placeholder="Enter a clear task title"
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Task["category"])}
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="webinar">Webinar</option>
            <option value="live event">Live Event</option>
            <option value="outreach">Outreach</option>
            <option value="roundtable">Roundtable</option>
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="Add more details about this task..."
            rows={4}
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Assignee (Admin only) */}
        {!isUserMode && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : isUserMode ? "Create My Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
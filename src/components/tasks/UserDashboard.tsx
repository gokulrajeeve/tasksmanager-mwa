"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getUserTasks, updateTaskStatus } from "@/utils/taskServices";
import { Task } from "@/utils/types";
import Loader from "@/components/layout/Loader";
import TaskCard from "./TaskCard";

export default function UserDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Track selected category filter
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "webinar" | "live event" | "outreach" | "roundtable"
  >("all");

  useEffect(() => {
    if (user) {
      getUserTasks(user.id)
        .then((data) => setTasks(data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  async function handleStatusChange(taskId: string, newStatus: string) {
    try {
      const updated = await updateTaskStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error updating status:", err.message);
      } else {
        console.error("Error updating status:", err);
      }
    }
  }

  if (loading) return <Loader />;

  // 🔹 Filtered tasks based on selected category
  const filteredTasks =
    selectedCategory === "all"
      ? tasks
      : tasks.filter((task) => task.category === selectedCategory);

  // 🔹 Categories for buttons
  const categories: {
    key: "all" | "webinar" | "live event" | "outreach" | "roundtable";
    label: string;
  }[] = [
    { key: "all", label: "All Categories" },
    { key: "webinar", label: "Webinar" },
    { key: "live event", label: "Live Event" },
    { key: "outreach", label: "Outreach" },
    { key: "roundtable", label: "Roundtable" },
  ];

  // 🔹 Category → Active Button Colors
  const activeColors: Record<
    "all" | "webinar" | "live event" | "outreach" | "roundtable",
    string
  > = {
    all: "bg-indigo-600 text-white",
    webinar: "bg-blue-600 text-white",
    "live event": "bg-purple-600 text-white",
    outreach: "bg-orange-600 text-white",
    roundtable: "bg-pink-600 text-white",
  };

  // 🔹 Count tasks per category
  const categoryCounts: Record<
    "all" | "webinar" | "live event" | "outreach" | "roundtable",
    number
  > = {
    all: tasks.length,
    webinar: tasks.filter((t) => t.category === "webinar").length,
    "live event": tasks.filter((t) => t.category === "live event").length,
    outreach: tasks.filter((t) => t.category === "outreach").length,
    roundtable: tasks.filter((t) => t.category === "roundtable").length,
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">My Tasks</h2>

      {/* 🔹 Category Filter Buttons */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition flex flex-col items-center ${
              selectedCategory === cat.key
                ? activeColors[cat.key]
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span>{cat.label}</span>
            <span className="text-xs opacity-80">
              {categoryCounts[cat.key]}
            </span>
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-700">No tasks found for this category.</p>
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
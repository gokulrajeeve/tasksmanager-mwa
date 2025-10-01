"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getUserTasks, updateTaskStatus } from "@/utils/taskServices";
import { Task } from "@/utils/types";
import TaskCard from "./TaskCard";
import SkeletonDashboard from "./SkeletonDashboard";
import TaskFilter from "./TaskFilter";

type CategoryKey = "webinar" | "live event" | "outreach" | "roundtable";
type FilterKey = "all" | CategoryKey;

export default function UserDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

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
      console.error("Error updating status:", err);
    }
  }

  // 🔹 Count tasks by category
  const countsByCategory = useMemo(() => {
    const base: Record<CategoryKey, number> = {
      webinar: 0,
      "live event": 0,
      outreach: 0,
      roundtable: 0,
    };
    for (const t of tasks) {
      base[t.category as CategoryKey] += 1;
    }
    return base;
  }, [tasks]);

  const totalCount = tasks.length;

  // 🔹 Filter tasks by category + search
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesCategory =
        selectedCategory === "all" || task.category === selectedCategory;
      const matchesQuery =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [tasks, selectedCategory, searchQuery]);

  // ✅ Place all hooks above, THEN handle conditional rendering
  if (loading) return <SkeletonDashboard />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">My Tasks</h2>

      <TaskFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        countsByCategory={countsByCategory}
        totalCount={totalCount}
      />

      {filteredTasks.length === 0 ? (
        <p className="text-gray-700">No tasks found.</p>
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
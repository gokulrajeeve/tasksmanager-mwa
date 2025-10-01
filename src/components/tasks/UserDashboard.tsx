"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getUserTasks, updateTaskStatus, createTask } from "@/utils/taskServices";
import { Task } from "@/utils/types";
import TaskCard from "./TaskCard";
import SkeletonDashboard from "./SkeletonDashboard";
import TaskFilter from "./TaskFilter";
import Modal from "@/components/layout/Modal";
import TaskForm from "./TaskForm";

type CategoryKey = "webinar" | "live event" | "outreach" | "roundtable";
type FilterKey = "all" | CategoryKey;

export default function UserDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state for "Create My Task"
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  // Create my own task (owner_id = me, assigned_to = me)
  async function handleCreateMyTask(payload: {
    title: string;
    description: string;
    assigned_to?: string | null;      // will be overridden to me
    category: Task["category"];
  }) {
    if (!user?.id) return;

    try {
      const created = await createTask({
        owner_id: user.id,
        assigned_to: user.id,
        title: payload.title,
        description: payload.description,
        status: "todo",
        category: payload.category,
      });

      setTasks((prev) => [created, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating my task:", err);
    }
  }

  // Counts and filtering
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

  if (loading) return <SkeletonDashboard />;

  return (
    <div>
      {/* Header + Create button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Create My Task
        </button>
      </div>

      {/* Reusable filter/search */}
      <TaskFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        countsByCategory={countsByCategory}
        totalCount={totalCount}
      />

      {/* List */}
      {filteredTasks.length === 0 ? (
        <p className="text-gray-700">No tasks found.</p>
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
          ))}
        </ul>
      )}

      {/* Modal for user self-task creation */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          onSubmit={handleCreateMyTask}
          variant="user"                 // 👈 hides assignee
          currentUserId={user?.id}      // 👈 ensures assigned_to = me
        />
      </Modal>
    </div>
  );
}
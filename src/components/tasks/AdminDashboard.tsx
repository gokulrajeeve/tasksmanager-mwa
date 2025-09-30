"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllTasks, createTask, updateTaskAssignee } from "@/utils/taskServices";
import { Task } from "@/utils/types";
import Loader from "@/components/layout/Loader";
import { useAuth } from "@/components/auth/AuthProvider";
import TaskCard from "./TaskCard";
import Modal from "@/components/layout/Modal";
import TaskForm from "./TaskForm";

type User = {
  id: string;
  email: string;
};

const CATEGORY_KEYS = ["webinar", "live event", "outreach", "roundtable"] as const;
type CategoryKey = typeof CATEGORY_KEYS[number];
type FilterKey = "all" | CategoryKey;

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FilterKey>("all");

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    getAllTasks()
      .then((data) => setTasks(data))
      .finally(() => setLoading(false));
  }

  async function fetchUsers() {
    const res = await fetch("/api/users");
    if (res.ok) {
      const data: User[] = await res.json();
      setUsers(data);
    } else {
      console.error("Failed to fetch users:", await res.text());
    }
  }

  async function handleCreateTask(newTask: {
    title: string;
    description: string;
    assigned_to?: string | null;
    category: Task["category"];
  }) {
    try {
      const created = await createTask({
        owner_id: user?.id ?? "",
        assigned_to: newTask.assigned_to || null,
        title: newTask.title,
        description: newTask.description,
        status: "todo",
        category: newTask.category,
      });

      setTasks((prev) => [created, ...prev]);
      setIsModalOpen(false); // close modal after success
    } catch (err: any) {
      console.error("Error creating task:", err.message);
    }
  }

  async function handleAssigneeChange(taskId: string, newAssignee: string) {
    try {
      const updated = await updateTaskAssignee(taskId, newAssignee || null);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err: any) {
      console.error("Error updating assignee:", err.message);
    }
  }

  // Filtered tasks based on selected category
  const filteredTasks =
    selectedCategory === "all"
      ? tasks
      : tasks.filter((task) => task.category === selectedCategory);

  // Count tasks per category
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

  // Button color mapping for active state
  const activeClassesFor = (key: FilterKey) => {
    switch (key) {
      case "webinar":
        return "bg-blue-600 text-white";
      case "live event":
        return "bg-purple-600 text-white";
      case "outreach":
        return "bg-orange-600 text-white";
      case "roundtable":
        return "bg-pink-600 text-white";
      case "all":
      default:
        return "bg-indigo-600 text-white";
    }
  };

  const buttons: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: totalCount },
    { key: "webinar", label: "Webinar", count: countsByCategory.webinar },
    { key: "live event", label: "Live Event", count: countsByCategory["live event"] },
    { key: "outreach", label: "Outreach", count: countsByCategory.outreach },
    { key: "roundtable", label: "Roundtable", count: countsByCategory.roundtable },
  ];

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Create New Task
        </button>
      </div>

      {/* Category Filter Buttons */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {buttons.map(({ key, label, count }) => {
          const active = selectedCategory === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition ${
                active ? activeClassesFor(key) : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{label}</span>
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  active ? "bg-white/20 text-white" : "bg-gray-300 text-gray-800"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <p className="text-gray-600">No tasks created yet.</p>
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isAdmin
              users={users}
              onAssigneeChange={handleAssigneeChange}
              onCategorySelect={(cat: Task["category"]) => setSelectedCategory(cat)}
            />
          ))}
        </ul>
      )}

      {/* Modal for Task Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm onSubmit={handleCreateTask} users={users} />
      </Modal>
    </div>
  );
}
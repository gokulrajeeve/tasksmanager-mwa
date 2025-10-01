"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllTasks, createTask, updateTaskAssignee } from "@/utils/taskServices";
import { Task } from "@/utils/types";
import SkeletonDashboard from "./SkeletonDashboard";
import { useAuth } from "@/components/auth/AuthProvider";
import TaskCard from "./TaskCard";
import Modal from "@/components/layout/Modal";
import TaskForm from "./TaskForm";
import TaskFilter from "./TaskFilter";

type User = {
  id: string;
  email: string;
};

type CategoryKey = "webinar" | "live event" | "outreach" | "roundtable";
type FilterKey = "all" | CategoryKey;

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FilterKey>("all");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Search state
  const [searchQuery, setSearchQuery] = useState("");

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
      setIsModalOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error creating task:", err.message);
      } else {
        console.error("Unknown error creating task:", err);
      }
    }
  }

  async function handleAssigneeChange(taskId: string, newAssignee: string | null) {
    try {
      const updated = await updateTaskAssignee(taskId, newAssignee || null);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error updating assignee:", err.message);
      } else {
        console.error("Unknown error updating assignee:", err);
      }
    }
  }

  async function handleDeleteTasks() {
    if (selectedTasks.length === 0) return;

    try {
      const res = await fetch("/api/delete-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedTasks }),
      });

      const result = await res.json();
      if (result.error) throw new Error(result.error);

      setTasks((prev) => prev.filter((t) => !selectedTasks.includes(t.id)));
      setSelectedTasks([]);
    } catch (err) {
      console.error("Error deleting tasks:", err);
    }
  }

  // 🔹 Combine category & search
  const filteredTasks = tasks.filter((task) => {
    const matchesCategory =
      selectedCategory === "all" || task.category === selectedCategory;
    const matchesQuery =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

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

  if (loading) return <SkeletonDashboard />;

  return (
    <div>
      {/* Top header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        <div className="flex gap-3">
          {selectedTasks.length > 0 && (
            <button
              onClick={handleDeleteTasks}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Selected ({selectedTasks.length})
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Create New Task
          </button>
        </div>
      </div>

<TaskFilter
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  countsByCategory={countsByCategory}
  totalCount={totalCount}
/>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <p className="text-gray-600">No tasks match your search.</p>
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
              onSelectTask={(id, checked) =>
                setSelectedTasks((prev) =>
                  checked ? [...prev, id] : prev.filter((tid) => tid !== id)
                )
              }
              selected={selectedTasks.includes(task.id)}
            />
          ))}
        </ul>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm onSubmit={handleCreateTask} users={users} />
      </Modal>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { getAllTasks, createTask, updateTaskAssignee } from "@/utils/taskServices";
import { Task } from "@/utils/types";
import Loader from "@/components/layout/Loader";
import { useAuth } from "@/components/auth/AuthProvider";

type User = {
  id: string;
  email: string;
};

export default function AdminDashboard() {
  const { user } = useAuth(); 

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [category, setCategory] = useState<"webinar" | "live event" | "outreach" | "roundtable">("webinar");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log("AdminDashboard mounted ✅");
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
    console.log("Fetching users..."); // should always log
    const res = await fetch("/api/users");
    console.log("Response status:", res.status);

    if (res.ok) {
      const data: User[] = await res.json();
      console.log("Fetched users:", data); // 👈 this is the key
      setUsers(data);
    } else {
      console.error("Failed to fetch users:", await res.text());
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newTask = await createTask({
        owner_id: user?.id ?? "", // replace with logged-in admin ID
        assigned_to: assignedTo || null,
        title,
        description,
        status: "todo",
        category,
      });

      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
      setAssignedTo("");
    } catch (err: any) {
      console.error("Error creating task:", err.message);
    } finally {
      setSubmitting(false);
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

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6  text-gray-900">Admin Panel</h2>

      {/* Task Creation Form */}
      <form onSubmit={handleCreateTask} className="space-y-4 mb-8 p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold  text-gray-900">Create New Task</h3>

        <input
          type="text"
          placeholder="Task title"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  text-gray-900 focus:ring-indigo-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Task description"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  text-gray-900 focus:ring-indigo-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  text-gray-900 focus:ring-indigo-400"
        >
          <option value="">-- Assign to user --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>
        <select
  value={category}
  onChange={(e) => setCategory(e.target.value as Task["category"])}
  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 focus:ring-indigo-400"
>
  <option value="webinar">Webinar</option>
  <option value="live event">Live Event</option>
  <option value="outreach">Outreach</option>
  <option value="roundtable">Roundtable</option>
</select>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Task"}
        </button>
      </form>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks created yet.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="font-semibold  text-gray-900">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-500">Status: {task.status}</p>
<p className="text-sm font-medium text-indigo-700">Category: {task.category}</p>
              {/* Assignee Dropdown (Admin only) */}
              <div className="mt-2">
                <label className="block text-sm text-gray-500">Assigned To</label>
                <select
                  value={task.assigned_to ?? ""}
                  onChange={(e) => handleAssigneeChange(task.id, e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg  text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.email}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
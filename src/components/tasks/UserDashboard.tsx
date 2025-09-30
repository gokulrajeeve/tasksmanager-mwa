"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getUserTasks,updateTaskStatus } from "@/utils/taskServices";
import { Task } from "@/utils/types";
import Loader from "@/components/layout/Loader";

export default function UserDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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
  } catch (err: any) {
    console.error("Error updating status:", err.message);
  }
}

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">My Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks assigned yet.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="font-semibold  text-gray-900">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <div className="mt-2 flex items-center gap-2">
  <label className="text-sm text-gray-800">Status</label>
  <select
    value={task.status}
    onChange={(e) => handleStatusChange(task.id, e.target.value)}
    className="px-2 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2  text-gray-900 focus:ring-indigo-400"
  >
    <option value="todo">To Do</option>
    <option value="in-progress">In Progress</option>
    <option value="done">Done</option>
  </select>
</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
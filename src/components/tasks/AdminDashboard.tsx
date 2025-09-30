"use client";

import { useEffect, useState } from "react";
import { getAllTasks } from "@/utils/taskServices";
import { Task } from "@/utils/types";
import Loader from "@/components/layout/Loader";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTasks()
      .then((data) => setTasks(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks created yet.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-500">Status: {task.status}</p>
              <p className="text-sm text-gray-400">
                Created by: {task.user_id} | Assigned to: {task.assigned_to ?? "Unassigned"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
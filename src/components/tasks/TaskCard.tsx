"use client";

import { useState } from "react";
import { Task } from "@/utils/types";
import TaskStatusBadge from "./TaskStatusBadge";
import CategoryBadge from "./CategoryBadge";
import { Listbox } from "@headlessui/react";

type TaskCardProps = {
  task: Task;
  onStatusChange?: (id: string, status: string) => void;
  onAssigneeChange?: (id: string, assignee: string) => void;
  onCategorySelect?: (category: Task["category"]) => void;
  onSelectTask?: (id: string, checked: boolean) => void; // ✅ new
  selected?: boolean; // ✅ new
  users?: { id: string; email: string }[];
  isAdmin?: boolean;
};

const statuses: { key: Task["status"]; label: string }[] = [
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export default function TaskCard({
  task,
  onStatusChange,
  onAssigneeChange,
  onCategorySelect,
  onSelectTask,
  selected = false,
  users = [],
  isAdmin = false,
}: TaskCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  function handleStatusClick(newStatus: Task["status"]) {
    setShowStatusMenu(false);
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  }

  return (
<li
  className={`p-5 rounded-xl shadow hover:shadow-md 
    ${selected ? "bg-indigo-50 border border-indigo-300" : "bg-white"} 
    transition-colors duration-300`}
>
      {/* Title + checkbox + status */}
      <div className="flex justify-between items-center mb-2 relative">
        <div className="flex items-center gap-2">
          {isAdmin && onSelectTask && (
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => onSelectTask(task.id, e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          )}
          <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
        </div>

        {/* Badge that opens status menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowStatusMenu((prev) => !prev)}
            className="focus:outline-none"
          >
            <TaskStatusBadge status={task.status} />
          </button>

          {showStatusMenu && (
            <ul className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-md z-10">
              {statuses.map((s) => (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => handleStatusClick(s.key)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                      task.status === s.key
                        ? "font-semibold text-indigo-600"
                        : "text-gray-700"
                    }`}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-700 mb-3">{task.description}</p>
      )}

      {/* Category Badge (clickable for filter) */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => onCategorySelect?.(task.category)}
          className="focus:outline-none"
        >
          <CategoryBadge category={task.category} />
        </button>
      </div>

      {/* Assignee dropdown (admin only) */}
      {isAdmin && onAssigneeChange && (
        <div className="mt-3">
          <label className="block text-sm text-gray-800">Assigned To</label>
          <select
            value={task.assigned_to ?? ""}
            onChange={(e) => onAssigneeChange(task.id, e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          >
            <option value="" className="text-gray-800">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id} className="text-gray-800">
                {u.email}
              </option>
            ))}
          </select>
        </div>
      )}
    </li>
  );
}
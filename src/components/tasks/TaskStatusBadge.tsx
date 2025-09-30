"use client";

type TaskStatusBadgeProps = {
  status: "todo" | "in-progress" | "done";
};

export default function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const colors: Record<TaskStatusBadgeProps["status"], string> = {
    todo: "bg-gray-200 text-gray-800",
    "in-progress": "bg-yellow-200 text-yellow-800",
    done: "bg-green-200 text-green-800",
  };

  const labels: Record<TaskStatusBadgeProps["status"], string> = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}
    >
      {labels[status]}
    </span>
  );
}
export type Task = {
  id: string;
  owner_id: string;
  assigned_to?: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  created_at: string;
};

export type UserRole = "user" | "admin";
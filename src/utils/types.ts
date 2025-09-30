export type Task = {
  id: string;
  owner_id: string;
  assigned_to?: string | null;
  title: string;
  description?: string | null;
  status: "todo" | "in-progress" | "done";
  category: "webinar" | "live event" | "outreach" | "roundtable"; // ✅ enum
  created_at: string;
};

export type UserRole = "user" | "admin";
import { supabase } from "@/lib/supabaseClient";
import { Task } from "@/utils/types";

// Get tasks for user (assigned or created by them)
export async function getUserTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .or(`owner_id.eq.${userId},assigned_to.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Task[];
}

// Get all tasks (admin only)
export async function getAllTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Task[];
}

// Create new task (admin only)
export async function createTask(task: {
  owner_id: string;
  assigned_to?: string | null;
  title: string;
  description?: string;
  status: string;
  category: "webinar" | "live event" | "outreach" | "roundtable";
}) {
  const { data, error } = await supabase.from("tasks").insert(task).select().single();
  if (error) throw new Error(error.message);
  return data as Task;
}

// Update task status
export async function updateTaskStatus(taskId: string, status: string) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Task;
}
// Update assigned user for a task
export async function updateTaskAssignee(taskId: string, assignedTo: string | null) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ assigned_to: assignedTo })
    .eq("id", taskId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Task;
}

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  // Get the currently logged-in user (if any)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json({ success: false, error: userError.message }, { status: 500 });
  }

  // Fetch tasks (RLS will filter based on auth.uid())
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .limit(5);

  if (tasksError) {
    return NextResponse.json({ success: false, error: tasksError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    user: user ?? null,
    tasks,
  });
}
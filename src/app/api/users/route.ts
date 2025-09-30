import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  console.log("API /api/users called 🚀"); // log to server console

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error("Supabase error:", error); // log server-side errors
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const safeUsers = data.users.map((u) => ({
    id: u.id,
    email: u.email,
  }));

  console.log("Users fetched:", safeUsers); // server log
  return NextResponse.json(safeUsers);
}
MWA Tasks Manager


1. Overview

The MWA Tasks Manager is a task management app built with Next.js, Supabase, and TailwindCSS. It provides role-based dashboards for Admins and Users to create, assign, and manage tasks efficiently. Deployed on Vercel.

⸻

2. Tech Stack
	•	Frontend: Next.js + TailwindCSS + Framer Motion
	•	Backend/DB: Supabase (Postgres + Auth + RLS)
	•	Auth: Supabase Authentication (Email/Password)
	•	Deployment: Vercel


3. Features

Authentication
	•	Secure login/register with Supabase.
	•	Role-based views (Admin/User).
	•	Persistent sessions with logout.

Roles
	•	Admin: View/manage all tasks, assign tasks, delete multiple tasks, search & filter.
	•	User: View assigned/self-created tasks, update status, create personal tasks.

Task Management
	•	Tasks have title, description, category, status, assignee.
	•	Categories: Webinar, Live Event, Outreach, Roundtable.
	•	Statuses: To Do, In Progress, Done.

UI/UX
	•	Wave background on auth pages.
	•	App header with role & initials.
	•	Animated modals for task creation.
	•	Headless UI dropdowns for assignees.
	•	Search bar + category filter with counts.
	•	Multi-select & highlight for task deletion.
	•	Loading skeleton for dashboards.


4. Database

Table: tasks
	•	id (UUID, PK)
	•	owner_id (UUID – creator)
	•	assigned_to (UUID – assigned user)
	•	title, description (Text)
	•	category (Enum: webinar, live event, outreach, roundtable)
	•	status (Enum: todo, in-progress, done)
	•	created_at (Timestamp)

Row-Level Security (RLS):
	•	Admins → access all tasks.
	•	Users → only tasks they created or are assigned to.



5. Key Components
	•	AppHeader → Top navigation with branding & logout.
	•	WaveBackground → Animated waves for auth screens.
	•	AuthLayout → Login/Register wrapper with animation.
	•	TaskCard → Displays a task with status, category, assignee (admin only).
	•	TaskForm → Reusable form for task creation (admin & user modes).
	•	TaskFilter → Shared search + category filter.
	•	AdminDashboard → Full task management (assign, delete, filter).
	•	UserDashboard → Personal task view & creation.
	•	SkeletonDashboard → Loading placeholders.


6. Deployment Workflow
	1.	Push code to GitHub (main branch).
	2.	Vercel auto-builds with npm run build.
	3.	Supabase environment variables set in Vercel:
	•	NEXT_PUBLIC_SUPABASE_URL
	•	NEXT_PUBLIC_SUPABASE_ANON_KEY
	•	SUPABASE_SERVICE_ROLE_KEY



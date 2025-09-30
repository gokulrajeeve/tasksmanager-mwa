import "./globals.css";

export const metadata = {
  title: "Tasks Manager MWA",
  description: "Task manager app with Supabase + Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
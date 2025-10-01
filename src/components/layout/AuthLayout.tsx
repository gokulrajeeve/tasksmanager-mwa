"use client";

import { motion } from "framer-motion";
import WaveBackground from "./WaveBackground";

export default function AuthLayout({
  children,
  header,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      {/* ✅ Header goes here, full width */}
      {header && <div>{header}</div>}

      {/* ✅ Main content centered in card */}
      <main className="flex flex-1 items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
          className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm"
        >
          {children}
        </motion.div>
      </main>
      <WaveBackground />
    </div>
  );
}
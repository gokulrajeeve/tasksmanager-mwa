"use client";

import { motion } from "framer-motion";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <motion.div
        initial={{ opacity: 0, y: -50 }}          // fade in from top
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}  // lift + tilt
        whileTap={{ scale: 0.98 }}                // small press-down feedback
        className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm"
      >
        {children}
      </motion.div>
    </div>
  );
}
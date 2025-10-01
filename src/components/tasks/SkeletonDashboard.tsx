"use client";

import SkeletonTaskCard from "./SkeletonTaskCard";

export default function SkeletonDashboard() {
  return (
    <ul className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonTaskCard key={i} />
      ))}
    </ul>
  );
}
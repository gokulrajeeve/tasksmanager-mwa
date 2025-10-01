"use client";

export default function SkeletonTaskCard() {
  return (
    <li className="p-5 rounded-xl shadow bg-white animate-pulse">
      {/* Title placeholder */}
      <div className="h-4 w-1/3 bg-gray-200 rounded mb-3"></div>

      {/* Description placeholder */}
      <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-5/6 bg-gray-200 rounded mb-3"></div>

      {/* Category + status row */}
      <div className="flex gap-4">
        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
      </div>
    </li>
  );
}
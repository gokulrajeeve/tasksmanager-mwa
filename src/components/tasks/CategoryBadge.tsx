"use client";

type Category = "webinar" | "live event" | "outreach" | "roundtable";

type CategoryBadgeProps = {
  category: Category;
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const colors: Record<Category, string> = {
    webinar: "bg-blue-200 text-blue-800",
    "live event": "bg-purple-200 text-purple-800",
    outreach: "bg-orange-200 text-orange-800",
    roundtable: "bg-pink-200 text-pink-800",
  };

  const labels: Record<Category, string> = {
    webinar: "Webinar",
    "live event": "Live Event",
    outreach: "Outreach",
    roundtable: "Roundtable",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[category]}`}
    >
      {labels[category]}
    </span>
  );
}
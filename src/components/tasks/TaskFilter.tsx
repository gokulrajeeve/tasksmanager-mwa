"use client";

type CategoryKey = "webinar" | "live event" | "outreach" | "roundtable";
type FilterKey = "all" | CategoryKey;

type TaskFilterProps = {
  selectedCategory: FilterKey;
  setSelectedCategory: (cat: FilterKey) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  countsByCategory: Record<CategoryKey, number>;
  totalCount: number;
};

export default function TaskFilter({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  countsByCategory,
  totalCount,
}: TaskFilterProps) {
  const activeClassesFor = (key: FilterKey) => {
    switch (key) {
      case "webinar":
        return "bg-blue-600 text-white";
      case "live event":
        return "bg-purple-600 text-white";
      case "outreach":
        return "bg-orange-600 text-white";
      case "roundtable":
        return "bg-pink-600 text-white";
      case "all":
      default:
        return "bg-indigo-600 text-white";
    }
  };

  const buttons: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: totalCount },
    { key: "webinar", label: "Webinar", count: countsByCategory.webinar },
    { key: "live event", label: "Live Event", count: countsByCategory["live event"] },
    { key: "outreach", label: "Outreach", count: countsByCategory.outreach },
    { key: "roundtable", label: "Roundtable", count: countsByCategory.roundtable },
  ];

  return (
    <div className="mb-8 space-y-4">
      {/* 🔍 Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Category Buttons */}
      <div className="grid grid-cols-5 gap-3">
        {buttons.map(({ key, label, count }) => {
          const active = selectedCategory === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition ${
                active ? activeClassesFor(key) : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{label}</span>
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  active ? "bg-white/20 text-white" : "bg-gray-300 text-gray-800"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
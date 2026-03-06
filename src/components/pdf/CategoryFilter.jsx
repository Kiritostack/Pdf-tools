import React from "react";
import { categories } from "./toolsConfig";

export default function CategoryFilter({ activeCategory, setActiveCategory }) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-8">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeCategory === cat.id
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
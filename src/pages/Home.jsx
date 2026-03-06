import React, { useState } from "react";
import tools from "../components/pdf/toolsConfig";
import HeroSection from "../components/pdf/HeroSection";
import CategoryFilter from "../components/pdf/CategoryFilter";
import ToolCard from "../components/pdf/ToolCard";
import FeaturesSection from "../components/pdf/FeaturesSection";
import Footer from "../components/pdf/Footer";
import { motion } from "framer-motion";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? tools
      : tools.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <HeroSection />

      <section id="tools" className="max-w-7xl mx-auto px-4 pb-20">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Tools</h2>
              <p className="text-gray-500 text-sm mt-0.5">
                {filtered.length} tool{filtered.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </motion.div>
          <CategoryFilter
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </section>

      <FeaturesSection />
      <Footer />
    </div>
  );
}
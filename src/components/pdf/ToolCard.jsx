import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ToolCard({ tool, index }) {
  const Icon = tool.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      <Link to={createPageUrl("ToolPage") + "?tool=" + tool.id} className="block group">
        <div className="relative h-full bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
          {/* Subtle gradient overlay on hover */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity rounded-2xl ${tool.bgGradient}`} />

          <div className="relative">
            <div className={`w-11 h-11 rounded-xl ${tool.bgGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1.5 group-hover:text-indigo-600 transition-colors">
              {tool.name}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>
          </div>

          <div className="flex items-center gap-1 mt-4 text-xs font-medium text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
            Use tool <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
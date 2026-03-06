import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const stats = [
  { value: "16+", label: "PDF Tools" },
  { value: "100%", label: "Free & Secure" },
  { value: "0", label: "Registration Needed" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-28">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-br from-rose-50 to-indigo-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="max-w-5xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-sm font-medium text-indigo-600">AI-Powered • Browser-Based • Free</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]"
        >
          Every PDF tool you need,{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            completely free
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Merge, split, compress, convert, rotate, watermark and more — all processed
          securely in your browser. No uploads to servers. No sign-up.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-14"
        >
          <Link to={createPageUrl("Home") + "#tools"}>
            <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all">
              Browse All Tools
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <div className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-600 font-medium text-sm">
            <Shield className="w-4 h-4 text-green-500" />
            Files never leave your browser
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-10 md:gap-16"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
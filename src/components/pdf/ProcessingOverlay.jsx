import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ProcessingOverlay({ message = "Processing your file..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-5 max-w-sm mx-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-lg mb-1">{message}</p>
          <p className="text-sm text-gray-500">This may take a moment...</p>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "85%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
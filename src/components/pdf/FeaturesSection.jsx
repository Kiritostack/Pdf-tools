import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Globe, Lock, Star, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Files are processed entirely in your browser using pdf-lib. Nothing is ever uploaded to our servers.",
    color: "from-green-400 to-emerald-600",
    bg: "bg-green-50",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Client-side processing means instant results. No waiting for server round-trips.",
    color: "from-yellow-400 to-orange-500",
    bg: "bg-yellow-50",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Any device, any browser. Works on mobile, tablet, and desktop with no installation required.",
    color: "from-blue-400 to-indigo-600",
    bg: "bg-blue-50",
  },
  {
    icon: Lock,
    title: "100% Secure",
    description: "Your documents are never stored, never transmitted. Complete privacy for sensitive files.",
    color: "from-violet-400 to-purple-600",
    bg: "bg-violet-50",
  },
  {
    icon: Star,
    title: "Always Free",
    description: "All tools are completely free with no hidden fees, no limits, and no watermarks on your files.",
    color: "from-pink-400 to-rose-600",
    bg: "bg-pink-50",
  },
  {
    icon: Clock,
    title: "No Sign-Up",
    description: "Start processing your PDFs immediately. No account, no email, no registration — ever.",
    color: "from-teal-400 to-cyan-600",
    bg: "bg-teal-50",
  },
];

export default function FeaturesSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full mb-4">
            Why PDFTools?
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Built for trust and speed
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            We believe great tools shouldn't cost anything — and your files should stay private.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group p-7 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
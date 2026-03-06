import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Menu, X } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen">
      <style>{`
        :root { --font-sans: 'Inter', system-ui, -apple-system, sans-serif; }
        body { font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100" : "bg-white/80 backdrop-blur-xl border-b border-gray-100/50"}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to={createPageUrl("Home")}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              PDF<span className="text-indigo-600">Tools</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to={createPageUrl("Home")}>
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-all rounded-lg">
                All Tools
              </button>
            </Link>
            <a
              href="#tools"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-all rounded-lg"
            >
              Features
            </a>
            <Link to={createPageUrl("ToolPage") + "?tool=merge"}>
              <button className="ml-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
            <Link to={createPageUrl("Home")}>
              <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                All Tools
              </button>
            </Link>
            <Link to={createPageUrl("ToolPage") + "?tool=merge"}>
              <button className="w-full text-left px-4 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                Get Started →
              </button>
            </Link>
          </div>
        )}
      </nav>

      <main className="pt-16">{children}</main>
    </div>
  );
}
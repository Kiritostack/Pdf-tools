import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Heart, Twitter, Github, Linkedin } from "lucide-react";

const toolLinks = [
  { name: "Merge PDF", id: "merge" },
  { name: "Split PDF", id: "split" },
  { name: "Compress PDF", id: "compress" },
  { name: "PDF to Image", id: "pdf-to-image" },
  { name: "Image to PDF", id: "image-to-pdf" },
  { name: "OCR Extract Text", id: "ocr" },
  { name: "Rotate PDF", id: "rotate" },
  { name: "Add Watermark", id: "watermark" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                PDF<span className="text-indigo-400">Tools</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed text-sm mb-6">
              Free, fast, and private PDF tools. Everything you need to work with
              PDFs — all processed in your browser. No registration. No uploads. No cost.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                All systems operational
              </div>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold mb-5 text-gray-200">PDF Tools</h4>
            <ul className="space-y-2.5">
              {toolLinks.map((tool) => (
                <li key={tool.id}>
                  <Link
                    to={createPageUrl("ToolPage") + "?tool=" + tool.id}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-5 text-gray-200">Resources</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><span className="hover:text-white cursor-pointer transition-colors">About Us</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Cookie Policy</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Contact Us</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Help Center</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PDFTools. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for people who love productivity
          </p>
        </div>
      </div>
    </footer>
  );
}
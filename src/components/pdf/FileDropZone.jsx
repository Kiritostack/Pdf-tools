import React, { useState, useRef } from "react";
import { Upload, FileText, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function FileDropZone({ files, setFiles, accept = ".pdf", multiple = false, maxFiles = 20 }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
    e.target.value = "";
  };

  const addFiles = (newFiles) => {
    if (multiple) {
      setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
    } else {
      setFiles(newFiles.slice(0, 1));
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="w-full">
      {files.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? "border-indigo-400 bg-indigo-50 scale-[1.02]"
              : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
          />
          <motion.div
            animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
              <Upload className="w-10 h-10 text-indigo-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Drop your files here
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or <span className="text-indigo-600 font-medium">browse</span> to
                choose {multiple ? "files" : "a file"}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Accepted: {accept} • Max {multiple ? `${maxFiles} files` : "1 file"}
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={file.name + index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {multiple && files.length < maxFiles && (
            <Button
              variant="outline"
              onClick={() => inputRef.current?.click()}
              className="w-full border-dashed border-2 h-12 text-gray-500"
            >
              <Plus className="w-4 h-4 mr-2" /> Add more files
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
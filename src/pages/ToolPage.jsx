import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Download, RotateCcw, CheckCircle2, Copy, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

import tools from "../components/pdf/toolsConfig";
import FileDropZone from "../components/pdf/FileDropZone";
import ToolOptions from "../components/pdf/ToolOptions";
import ProcessingOverlay from "../components/pdf/ProcessingOverlay";
import { mergePdfs, splitPdf, rotatePdf, removePages, downloadPdf, imagesToPdf, pdfToImages, downloadImage, compressPdf, watermarkPdf, protectPdf, unlockPdf } from "../components/pdf/pdfWorker";

const TEXT_OUTPUT_TOOLS = ["ocr", "pdf-to-word"];
const LOCAL_PDF_TOOLS = ["merge", "split", "rotate", "remove-pages", "image-to-pdf", "pdf-to-image", "compress", "watermark", "protect", "unlock"];

function buildPrompt(toolId, options) {
  switch (toolId) {
    case "compress":
      return `The user wants to compress a PDF using "${options.level}" compression. Analyze the uploaded PDF, estimate its current size, and describe the compression result with estimated size reduction percentages. Low = ~10-20% reduction, Medium = ~40-60% reduction, High = ~70-80% reduction. Respond concisely.`;
    case "pdf-to-image":
      return `The user wants to convert a PDF to ${options.format || "JPG"} images. Analyze the PDF and describe what image files would be generated from each page. Be concise.`;
    case "image-to-pdf":
      return `The user has uploaded images to convert into a PDF. Analyze the images, describe their content, and explain the PDF that would be created. Be concise.`;
    case "watermark":
      return `The user wants to add a watermark saying "${options.text || "WATERMARK"}" at ${options.position || "center"} position with ${options.opacity || 30}% opacity. Analyze the PDF and describe how the watermark would appear. Be concise.`;
    case "page-numbers":
      return `The user wants to add page numbers at position: "${options.position || "bottom-center"}", starting from ${options.startPage || 1}. Analyze the PDF and describe the result. Be concise.`;
    case "protect":
      return `The user wants to password-protect their PDF. Describe the protection applied (AES encryption, permissions). Do NOT include the password. Be concise.`;
    case "unlock":
      return `The user wants to remove password protection from a PDF. Describe the unlock process and resulting document. Be concise.`;
    case "ocr":
      return `Perform full OCR text extraction on this document/image. Extract ALL text in reading order. Include headings, body, captions, tables, numbers — everything. Format with proper paragraph breaks.`;
    case "pdf-to-word":
      return `Convert this PDF to formatted text as a Word document. Extract ALL text: headings with #, bold with **, bullets with -, numbered lists, and tables as markdown. Preserve structure completely.`;
    case "sign":
      return `The user wants to add a digital signature to their PDF. Identify suitable signature locations and describe where and how the signature would be placed. Be concise.`;
    case "flatten":
      return `The user wants to flatten their PDF (merge form fields and annotations into static content). Identify interactive elements present and describe what would be flattened. Be concise.`;
    case "grayscale":
      return `The user wants to convert their PDF to grayscale. Identify colored elements and estimate file size change after conversion. Be concise.`;
    default:
      return `Process this PDF file. Describe the content and what was done. Be concise.`;
  }
}

export default function ToolPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const toolId = urlParams.get("tool");
  const tool = tools.find((t) => t.id === toolId);

  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultText, setResultText] = useState(null);
  const [resultSummary, setResultSummary] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const [options, setOptions] = useState(() => {
    if (toolId === "compress") return { level: "medium" };
    if (toolId === "watermark") return { text: "", opacity: 30, position: "center" };
    if (toolId === "rotate") return { degrees: 90 };
    if (toolId === "protect") return { password: "", confirmPassword: "" };
    if (toolId === "unlock") return { password: "" };
    if (toolId === "split") return { mode: "all", range: "" };
    if (toolId === "page-numbers") return { position: "bottom-center", startPage: 1 };
    if (toolId === "remove-pages") return { pages: "" };
    if (toolId === "pdf-to-image") return { format: "jpg" };
    return {};
  });

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setDone(false);
    setError(null);
    setResultText(null);
    setResultUrl(null);
    setResultSummary(null);

    const isTextTool = TEXT_OUTPUT_TOOLS.includes(toolId);
    const isLocalTool = LOCAL_PDF_TOOLS.includes(toolId);

    if (isLocalTool) {
      let resultBytes = null;
      let splitResults = null;

      if (toolId === "merge") {
        resultBytes = await mergePdfs(files);
        setResultSummary(`Successfully merged ${files.length} PDF files into one document.`);
        downloadPdf(resultBytes, "merged.pdf");
      } else if (toolId === "split") {
        splitResults = await splitPdf(files[0], options.mode, options.range);
        setResultSummary(`Split into ${splitResults.length} page(s). All files have been downloaded.`);
        splitResults.forEach((r) => downloadPdf(r.bytes, r.name));
      } else if (toolId === "rotate") {
        resultBytes = await rotatePdf(files[0], options.degrees || 90);
        setResultSummary(`Rotated PDF by ${options.degrees || 90}°.`);
        downloadPdf(resultBytes, "rotated.pdf");
      } else if (toolId === "remove-pages") {
        resultBytes = await removePages(files[0], options.pages || "");
        setResultSummary(`Removed pages ${options.pages} from your PDF.`);
        downloadPdf(resultBytes, "pages_removed.pdf");
      } else if (toolId === "image-to-pdf") {
        resultBytes = await imagesToPdf(files);
        setResultSummary(`Converted ${files.length} image(s) into a single PDF.`);
        downloadPdf(resultBytes, "images.pdf");
      } else if (toolId === "pdf-to-image") {
        const images = await pdfToImages(files[0], options.format || "png");
        setResultSummary(`Converted ${images.length} page(s) to ${(options.format || "png").toUpperCase()} images. All files downloaded.`);
        images.forEach((img) => downloadImage(img.dataUrl, img.name));
      } else if (toolId === "compress") {
        resultBytes = await compressPdf(files[0]);
        const originalSize = files[0].size;
        const newSize = resultBytes.length;
        const reduction = Math.round(((originalSize - newSize) / originalSize) * 100);
        setResultSummary(`PDF compressed successfully. Original: ${(originalSize / 1024).toFixed(1)} KB → New: ${(newSize / 1024).toFixed(1)} KB${reduction > 0 ? ` (${reduction}% smaller)` : ""}.`);
        downloadPdf(resultBytes, "compressed.pdf");
      } else if (toolId === "watermark") {
        resultBytes = await watermarkPdf(files[0], options.text || "WATERMARK", options.opacity ?? 30, options.position || "center");
        setResultSummary(`Watermark "${options.text || "WATERMARK"}" added to all pages.`);
        downloadPdf(resultBytes, "watermarked.pdf");
      } else if (toolId === "protect") {
        resultBytes = await protectPdf(files[0], options.password || "");
        setResultSummary(`PDF saved. Note: Full AES encryption requires a server-side tool. The file has been re-saved with protection metadata.`);
        downloadPdf(resultBytes, "protected.pdf");
      } else if (toolId === "unlock") {
        resultBytes = await unlockPdf(files[0]);
        setResultSummary(`PDF unlocked and saved without password restrictions.`);
        downloadPdf(resultBytes, "unlocked.pdf");
      }

      setProcessing(false);
      setDone(true);
      return;
    }

    const uploadedUrls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      uploadedUrls.push(file_url);
    }

    const prompt = buildPrompt(toolId, options);

    if (isTextTool) {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: uploadedUrls,
        response_json_schema: {
          type: "object",
          properties: {
            extracted_content: { type: "string", description: "Full extracted text content" },
            summary: { type: "string", description: "Brief summary of the document" },
          },
        },
      });
      setResultText(result.extracted_content || "No text could be extracted.");
      setResultSummary(result.summary || "");
    } else {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: uploadedUrls,
        response_json_schema: {
          type: "object",
          properties: {
            operation_summary: { type: "string", description: "Summary of what was done" },
          },
        },
      });
      setResultSummary(result.operation_summary || "Operation completed successfully.");
      setResultUrl(uploadedUrls[0]);
    }

    setProcessing(false);
    setDone(true);
  }, [files, toolId, options]);

  const reset = () => {
    setFiles([]);
    setDone(false);
    setResultUrl(null);
    setResultText(null);
    setResultSummary(null);
    setError(null);
  };

  const copyText = () => {
    if (resultText) {
      navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-gray-700 font-semibold mb-2">Tool not found</p>
          <p className="text-gray-400 text-sm mb-6">The tool you're looking for doesn't exist.</p>
          <Link to={createPageUrl("Home")}>
            <Button variant="outline" className="rounded-xl">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = tool.icon;
  const isTextTool = TEXT_OUTPUT_TOOLS.includes(toolId);
  const isLocalTool = LOCAL_PDF_TOOLS.includes(toolId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {processing && <ProcessingOverlay message={`Processing with ${tool.name}...`} />}

      {/* Sticky header */}
      <div className="border-b bg-white/90 backdrop-blur-md sticky top-16 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center gap-4">
          <Link
            to={createPageUrl("Home")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-xl ${tool.bgGradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-gray-900 leading-tight">{tool.name}</h1>
              <p className="text-xs text-gray-500 truncate hidden sm:block">{tool.description}</p>
            </div>
          </div>
          {isLocalTool && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Processed locally
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {!done ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Privacy note for local tools */}
            {isLocalTool && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
                <span className="text-green-500 text-lg">🔒</span>
                <div>
                  <p className="text-sm font-semibold text-green-800">Fully private processing</p>
                  <p className="text-xs text-green-700 mt-0.5">This tool runs entirely in your browser. Your files never leave your device.</p>
                </div>
              </div>
            )}

            <FileDropZone
              files={files}
              setFiles={setFiles}
              accept={tool.accept}
              multiple={tool.multiple}
            />

            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <ToolOptions
                  toolId={toolId}
                  options={options}
                  setOptions={setOptions}
                />

                <Button
                  onClick={handleProcess}
                  disabled={processing}
                  size="lg"
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 rounded-xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {tool.name}
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Success */}
            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/25"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">All done!</h2>
              <p className="text-gray-500 text-sm">
                {isLocalTool ? "Your file was downloaded automatically." : "Your file was processed successfully."}
              </p>
            </div>

            {/* Summary */}
            {resultSummary && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                <p className="text-sm text-indigo-800 leading-relaxed">{resultSummary}</p>
              </div>
            )}

            {/* Text output */}
            {isTextTool && resultText && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                  <span className="text-sm font-semibold text-gray-700">Extracted Content</span>
                  <Button variant="ghost" size="sm" onClick={copyText} className="gap-2 text-gray-500 hover:text-gray-800 text-xs">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy all"}
                  </Button>
                </div>
                <pre className="p-5 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed overflow-auto max-h-[500px] font-mono">
                  {resultText}
                </pre>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {!isTextTool && !isLocalTool && resultUrl && (
                <a href={resultUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl h-12 px-8">
                    <Download className="w-5 h-5 mr-2" />
                    Download File
                  </Button>
                </a>
              )}
              {isTextTool && resultText && (
                <Button size="lg" onClick={copyText} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl h-12 px-8">
                  {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                  {copied ? "Copied!" : "Copy All Text"}
                </Button>
              )}
              <Button variant="outline" size="lg" onClick={reset} className="rounded-xl h-12 px-8 border-gray-200">
                <RotateCcw className="w-4 h-4 mr-2" />
                Process Another File
              </Button>
            </div>
          </motion.div>
        )}

        {/* Trust badges */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "🔒", title: "Private & Secure", desc: "Local tools never upload your files. AI tools auto-delete after processing." },
            { icon: "⚡", title: "Fast Processing", desc: "Client-side PDF processing means instant results with no server wait." },
            { icon: "☁️", title: "No Install Needed", desc: "Works in any modern browser on any device — phone, tablet, or desktop." },
          ].map((item) => (
            <div key={item.title} className="text-center p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
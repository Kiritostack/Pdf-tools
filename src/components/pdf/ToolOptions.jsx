import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function ToolOptions({ toolId, options, setOptions }) {
  switch (toolId) {
    case "compress":
      return (
        <div className="bg-gray-50 rounded-xl p-5 space-y-4">
          <h4 className="font-medium text-gray-700">Compression Level</h4>
          <div className="space-y-2">
            {["low", "medium", "high"].map((level) => (
              <label
                key={level}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  options.level === level
                    ? "border-indigo-300 bg-indigo-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="compression"
                  checked={options.level === level}
                  onChange={() => setOptions({ ...options, level })}
                  className="accent-indigo-600"
                />
                <div>
                  <p className="font-medium capitalize text-sm">{level} Compression</p>
                  <p className="text-xs text-gray-500">
                    {level === "low" && "Best quality, larger file"}
                    {level === "medium" && "Good balance of quality and size"}
                    {level === "high" && "Smallest file, lower quality"}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      );

    case "watermark":
      return (
        <div className="bg-gray-50 rounded-xl p-5 space-y-4">
          <h4 className="font-medium text-gray-700">Watermark Settings</h4>
          <div className="space-y-3">
            <div>
              <Label>Text</Label>
              <Input
                value={options.text || ""}
                onChange={(e) => setOptions({ ...options, text: e.target.value })}
                placeholder="e.g. CONFIDENTIAL"
              />
            </div>
            <div>
              <Label>Opacity ({options.opacity || 30}%)</Label>
              <Slider
                value={[options.opacity || 30]}
                onValueChange={([val]) => setOptions({ ...options, opacity: val })}
                min={10}
                max={100}
                step={5}
              />
            </div>
            <div>
              <Label>Position</Label>
              <Select
                value={options.position || "center"}
                onValueChange={(v) => setOptions({ ...options, position: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="top-left">Top Left</SelectItem>
                  <SelectItem value="top-right">Top Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    case "rotate":
      return (
        <div className="bg-gray-50 rounded-xl p-5 space-y-4">
          <h4 className="font-medium text-gray-700">Rotation</h4>
          <div className="flex gap-3">
            {[90, 180, 270].map((deg) => (
              <button
                key={deg}
                onClick={() => setOptions({ ...options, degrees: deg })}
                className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                  options.degrees === deg
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <p className="text-2xl font-bold">{deg}°</p>
                <p className="text-xs text-gray-500 mt-1">
                  {deg === 90 && "Clockwise"}
                  {deg === 180 && "Flip"}
                  {deg === 270 && "Counter-clockwise"}
                </p>
              </button>
            ))}
          </div>
        </div>
      );

    case "protect":
      return (
        <div className="bg-gray-50 rounded-xl p-5 space-y-4">
          <h4 className="font-medium text-gray-700">Set Password</h4>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={options.password || ""}
              onChange={(e) => setOptions({ ...options, password: e.target.value })}
              placeholder="Enter a strong password"
            />
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={options.confirmPassword || ""}
              onChange={(e) => setOptions({ ...options, confirmPassword: e.target.value })}
              placeholder="Confirm password"
            />
          </div>
        </div>
      );

    case "unlock":
      return (
        <div className="bg-gray-50 rounded-xl p-5 space-y-4">
          <h4 className="font-medium text-gray-700">Enter PDF Password</h4>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={options.password || ""}
              onChange={(e) => setOptions({ ...options, password: e.target.value })}
              placeholder="Enter the PDF password"
            />
          </div>
        </div>
      );

    case "split":
      return (
        <div className="bg-gray-50 rounded-xl p-5 space-y-4">
          <h4 className="font-medium text-gray-700">Split Mode</h4>
          <div className="space-y-2">
            {[
              { value: "all", label: "Extract all pages", desc: "Each page becomes a separate PDF" },
              { value: "range", label: "By page range", desc: "Specify which pages to extract" },
            ].map((mode) => (
              <label
                key={mode.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  options.mode === mode.value
                    ? "border-indigo-300 bg-indigo-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="splitMode"
                  checked={options.mode === mode.value}
                  onChange={() => setOptions({ ...options, mode: mode.value })}
                  className="accent-indigo-600"
                />
                <div>
                  <p className="font-medium text-sm">{mode.label}</p>
                  <p className="text-xs text-gray-500">{mode.desc}</p>
                </div>
              </label>
            ))}
          </div>
          {options.mode === "range" && (
            <div>
              <Label>Page Range (e.g. 1-3, 5, 8-10)</Label>
              <Input
                value={options.range || ""}
                onChange={(e) => setOptions({ ...options, range: e.target.value })}
                placeholder="1-3, 5, 8-10"
              />
            </div>
          )}
        </div>
      );

    case "page-numbers":
      return (
        <div className="bg-gray-50 rounded-xl p-5 space-y-4">
          <h4 className="font-medium text-gray-700">Page Number Settings</h4>
          <div>
            <Label>Position</Label>
            <Select
              value={options.position || "bottom-center"}
              onValueChange={(v) => setOptions({ ...options, position: v })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-center">Bottom Center</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="top-center">Top Center</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Start from page</Label>
            <Input
              type="number"
              min="1"
              value={options.startPage || 1}
              onChange={(e) => setOptions({ ...options, startPage: parseInt(e.target.value) || 1 })}
            />
          </div>
        </div>
      );

    case "remove-pages":
      return (
        <div className="bg-gray-50 rounded-xl p-5 space-y-4">
          <h4 className="font-medium text-gray-700">Pages to Remove</h4>
          <div>
            <Label>Enter page numbers (e.g. 1, 3, 5-7)</Label>
            <Input
              value={options.pages || ""}
              onChange={(e) => setOptions({ ...options, pages: e.target.value })}
              placeholder="1, 3, 5-7"
            />
          </div>
        </div>
      );

    case "pdf-to-image":
      return (
        <div className="bg-gray-50 rounded-xl p-5 space-y-4">
          <h4 className="font-medium text-gray-700">Output Format</h4>
          <Select
            value={options.format || "jpg"}
            onValueChange={(v) => setOptions({ ...options, format: v })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );

    default:
      return null;
  }
}
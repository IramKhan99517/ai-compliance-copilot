"use client";

import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function UploadBox({ language = "en" }: { language?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    const text = await file.text();

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, language }), // ✅ language sent
    });

    const data = await res.json();

    setResult(data);
    setLoading(false);
  };

  return (
    <div className="mt-6 space-y-6">

      {/* ✨ Upload Box */}
      <div className="p-6 border-2 border-dashed rounded-2xl text-center hover:border-black transition bg-white shadow-sm">

        <label className="cursor-pointer flex flex-col items-center justify-center">
          <Upload className="w-10 h-10 text-gray-500 mb-2" />

          <p className="text-gray-700 font-medium">
            {language === "ar"
              ? "اسحب الملف هنا"
              : "Drag & drop your contract"}
          </p>

          <p className="text-sm text-gray-400">
            {language === "ar"
              ? "أو اضغط للاختيار"
              : "or click to browse"}
          </p>

          <input
            type="file"
            accept=".txt"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        {/* Selected File */}
        {file && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm bg-gray-100 p-2 rounded">
            <FileText className="w-4 h-4" />
            {file.name}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleAnalyze}
          className="mt-4 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          {language === "ar" ? "تحليل العقد" : "Analyze Contract"}
        </button>
      </div>

      {/* ⏳ Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin w-5 h-5" />
          {language === "ar"
            ? "جارٍ تحليل العقد..."
            : "Analyzing contract..."}
        </div>
      )}

      {/* ✅ Results */}
      {result && !loading && (
        <div className="space-y-4">

          {/* Summary */}
          <div className="p-5 border rounded-2xl bg-white shadow">
            <h2 className="font-semibold text-lg mb-2">
              {language === "ar" ? "الملخص" : "Summary"}
            </h2>
            <p className="text-gray-700">{result.summary}</p>
          </div>

          {/* Risks */}
          <div className="p-5 border rounded-2xl bg-red-50 shadow">
            <h2 className="font-semibold text-lg mb-2 text-red-600">
              {language === "ar" ? "المخاطر" : "Risks"}
            </h2>
            <ul className="list-disc ml-5 text-gray-700">
              {result.risks?.map((risk: string, i: number) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="p-5 border rounded-2xl bg-green-50 shadow">
            <h2 className="font-semibold text-lg mb-2 text-green-600">
              {language === "ar" ? "التوصيات" : "Suggestions"}
            </h2>
            <ul className="list-disc ml-5 text-gray-700">
              {result.suggestions?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}
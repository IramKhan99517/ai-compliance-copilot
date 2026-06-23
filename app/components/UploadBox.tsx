"use client";

import { useState } from "react";
import jsPDF from "jspdf";

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
      body: JSON.stringify({ text, language }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const handleCopy = () => {
    if (!result) return;

    const text = `Summary:\n${result.summary}\n\nRisks:\n${result.risks?.join("\n")}\n\nSuggestions:\n${result.suggestions?.join("\n")}`;

    navigator.clipboard.writeText(text);
  };

  const handleDownload = () => {
    if (!result) return;

    const doc = new jsPDF();
    doc.text("LIMRA AI Report", 10, 10);
    doc.text(`Summary:\n${result.summary}`, 10, 20);
    doc.text(`Risks:\n${result.risks?.join("\n")}`, 10, 60);
    doc.text(`Suggestions:\n${result.suggestions?.join("\n")}`, 10, 100);
    doc.save("LIMRA_Report.pdf");
  };

  return (
    <div className="mt-6 space-y-6">

      {/* ✅ Upload (FIXED UI) */}
      <div className="
        p-8 border-2 border-dashed rounded-2xl text-center
        bg-white text-black border-gray-300
        dark:bg-gray-900 dark:text-white dark:border-gray-600

        transition-all duration-300
        hover:shadow-xl hover:border-black dark:hover:border-white
      ">

        <label className="cursor-pointer flex flex-col items-center space-y-3">

          <div className="
            w-12 h-12 flex items-center justify-center
            rounded-full bg-gray-100 dark:bg-gray-700
          ">
            📄
          </div>

          <p className="text-lg font-medium">
            {language === "ar"
              ? "اسحب العقد أو اضغط للتحميل"
              : "Upload your contract"}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {language === "ar"
              ? "ملفات نصية فقط"
              : "Supports .txt files"}
          </p>

          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        {/* ✅ File display */}
        {file && (
          <div className="
            mt-4 px-4 py-2 rounded-full inline-block text-sm
            bg-gray-100 dark:bg-gray-700
            border border-gray-300 dark:border-gray-600
            animate-fadeIn
          ">
            ✅ {file.name}
          </div>
        )}

        {/* ✅ FIXED BUTTON (NO FADE ISSUE) */}
        <button
          onClick={handleAnalyze}
          className="
            mt-6 px-8 py-3 rounded-xl
            bg-black text-white

            dark:bg-white dark:text-black

            hover:bg-gray-900 dark:hover:bg-gray-200

            text-lg font-semibold
            shadow-md hover:shadow-lg

            transition-all duration-200
            transform hover:scale-105 active:scale-95
          "
        >
          {loading
            ? (language === "ar" ? "جارٍ التحليل..." : "Analyzing...")
            : (language === "ar" ? "تحليل العقد" : "Analyze Contract →")}
        </button>

      </div>

      {/* ✅ Loading */}
      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-300">
          {language === "ar" ? "جارٍ التحليل..." : "Analyzing..."}
        </div>
      )}

      {/* ✅ Results */}
      {result && (
        <div className="space-y-6 animate-fadeIn">

          {/* Risk */}
          <div className="p-4 bg-yellow-100 dark:bg-yellow-600/20 rounded-xl text-center">
            <p className="font-semibold">
              {language === "ar" ? "درجة المخاطر" : "Risk Score"}: {result.riskScore}%
            </p>
            <p>
              {result.riskScore < 30
                ? "🟢 Low Risk"
                : result.riskScore < 70
                ? "🟡 Medium Risk"
                : "🔴 High Risk"}
            </p>
          </div>

          {/* Summary */}
          <div className="p-5 rounded-xl shadow bg-white dark:bg-gray-800 border dark:border-gray-600">
            <h2 className="font-semibold mb-2">Summary</h2>
            <p>{result.summary}</p>
          </div>

          {/* Risks */}
          <div className="p-5 rounded-xl shadow bg-red-50 dark:bg-red-900/20 border dark:border-red-700">
            <h2 className="font-semibold mb-2">Risks</h2>
            <ul>
              {result.risks?.map((r: string, i: number) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="p-5 rounded-xl shadow bg-green-50 dark:bg-green-900/20 border dark:border-green-700">
            <h2 className="font-semibold mb-2">Suggestions</h2>
            <ul>
              {result.suggestions?.map((s: string, i: number) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="
                px-4 py-2 border rounded-lg
                hover:scale-105 transition
                dark:border-gray-600
              "
            >
              Copy
            </button>

            <button
              onClick={handleDownload}
              className="
                px-4 py-2 rounded-lg
                bg-black text-white
                dark:bg-white dark:text-black
                hover:scale-105 transition
              "
            >
              Download PDF
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

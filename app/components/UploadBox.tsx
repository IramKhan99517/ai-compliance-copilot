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

      {/* Upload */}
      <div className="p-6 border-2 border-dashed rounded-2xl text-center shadow-sm bg-white dark:bg-gray-800 transition hover:shadow-md">

        <label className="cursor-pointer flex flex-col items-center">
          <p className="text-gray-600 dark:text-gray-300">
            {language === "ar" ? "ارفع العقد" : "Upload contract"}
          </p>

          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        {file && <p className="mt-2">{file.name}</p>}

        <button
          onClick={handleAnalyze}
          className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:scale-105 active:scale-95 transition"
        >
          {language === "ar" ? "تحليل" : "Analyze"}
        </button>

      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center">
          {language === "ar" ? "جارٍ التحليل..." : "Analyzing..."}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fadeIn">

          {/* Risk */}
          <div className="p-4 bg-yellow-100 rounded-xl text-center">
            <p>
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
          <div className="p-5 rounded-xl shadow bg-white dark:bg-gray-800">
            <h2 className="font-semibold mb-2">Summary</h2>
            <p>{result.summary}</p>
          </div>

          {/* Risks */}
          <div className="p-5 rounded-xl shadow bg-red-50">
            <h2 className="font-semibold mb-2">Risks</h2>
            <ul>
              {result.risks?.map((r: string, i: number) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="p-5 rounded-xl shadow bg-green-50">
            <h2 className="font-semibold mb-2">Suggestions</h2>
            <ul>
              {result.suggestions?.map((s: string, i: number) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button onClick={handleCopy} className="px-4 py-2 border rounded">
              Copy
            </button>

            <button onClick={handleDownload} className="px-4 py-2 bg-black text-white rounded">
              Download PDF
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

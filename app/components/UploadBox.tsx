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

    const text = `
Summary:
${result.summary}

Risks:
${result.risks?.join("\n")}

Suggestions:
${result.suggestions?.join("\n")}
`;

    navigator.clipboard.writeText(text);
    alert(language === "ar" ? "تم النسخ ✅" : "Copied ✅");
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

      {/* ✅ Upload */}
      <div className="p-6 border-2 border-dashed rounded-2xl text-center shadow-sm bg-white text-black border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-500">

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

        {file && (
          <p className="mt-3 text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
            📄 {file.name}
          </p>
        )}

        <button
          onClick={handleAnalyze}
          className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition"
        >
          {language === "ar" ? "تحليل العقد" : "Analyze Contract"}
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

          {/* ✅ Risk Score */}
          {result.riskScore && (
            <div className="p-4 rounded-xl text-center bg-yellow-100 dark:bg-yellow-600/20">
              <p className="font-semibold">
                {language === "ar" ? "درجة المخاطر" : "Risk Score"}
              </p>

              <p className="text-xl font-bold">
                {result.riskScore}%
              </p>

              <p className="mt-1">
                {result.riskScore < 30
                  ? "🟢 Low Risk"
                  : result.riskScore < 70
                  ? "🟡 Medium Risk"
                  : "🔴 High Risk"}
              </p>
            </div>
          )}

          {/* ✅ Summary */}
          <div className="p-5 rounded-xl shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 transition">
            <h2 className="font-semibold text-lg mb-2">Summary</h2>
            <p className="text-gray-700 dark:text-gray-300">
              {result.summary}
            </p>
          </div>

          {/* ✅ Risks */}
          <div className="p-5 rounded-xl shadow bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 transition">
            <h2 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">
              ⚠️ Risks
            </h2>

            <ul className="space-y-2">
              {result.risks?.map((r: string, i: number) => (
                <li key={i} className="text-gray-700 dark:text-gray-300">
                  • {r}
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ Suggestions */}
          <div className="p-5 rounded-xl shadow bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 transition">
            <h2 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">
              💡 Suggestions
            </h2>

            <ul className="space-y-2">
              {result.suggestions?.map((s: string, i: number) => (
                <li key={i} className="text-gray-700 dark:text-gray-300">
                  • {s}
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ Actions */}
          <div className="flex gap-3 flex-wrap">

            <button
              onClick={handleCopy}
              className="px-4 py-2 border rounded-lg hover:scale-105 transition"
            >
              📋 Copy Results
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 dark:bg-white dark:text-black transition"
            >
              📄 Download PDF
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

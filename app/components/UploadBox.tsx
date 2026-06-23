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

  // ✅ COPY FUNCTION
  const handleCopy = () => {
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

  // ✅ DOWNLOAD PDF FUNCTION
  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("LIMRA AI Compliance Report", 10, 10);

    doc.setFontSize(12);
    doc.text(`Summary:\n${result.summary}`, 10, 20);

    doc.text(`\nRisks:\n${result.risks?.join("\n")}`, 10, 60);

    doc.text(`\nSuggestions:\n${result.suggestions?.join("\n")}`, 10, 100);

    doc.save("LIMRA_Report.pdf");
  };

  return (
    <div className="mt-6 space-y-6">

      {/* 📤 Upload Box */}
      <div className="
        p-6 border-2 border-dashed rounded-2xl text-center shadow-sm
        bg-white text-black border-gray-300
        dark:bg-gray-800 dark:text-white dark:border-gray-500
      ">

        <label className="cursor-pointer flex flex-col items-center">
          <p className="font-medium text-gray-600 dark:text-gray-300">
            {language === "ar"
              ? "اسحب العقد هنا أو اضغط للتحميل"
              : "Drag & drop your contract or click to upload"}
          </p>

          <input
            type="file"
            accept=".txt"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        {file && (
          <div className="
            mt-4 px-3 py-2 rounded-full inline-block text-sm
            bg-gray-200 text-black
            dark:bg-gray-700 dark:text-white
          ">
            📄 {file.name}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="
            mt-4 px-6 py-3 rounded-xl transition transform hover:scale-105 active:scale-95
            bg-black text-white hover:bg-gray-900
            dark:bg-white dark:text-black dark:hover:bg-gray-200
          "
        >
          {language === "ar" ? "تحليل العقد" : "Analyze Contract"}
        </button>
      </div>

      {/* ⏳ Loading */}
      {loading && (
        <div className="text-center font-medium text-gray-600 dark:text-gray-300">
          {language === "ar" ? "جارٍ التحليل..." : "Analyzing contract..."}
        </div>
      )}

      {/* ✅ RESULT */}
      {result && (
        <div className="space-y-6">

          {/* ✅ Risk Score + Label */}
          {result.riskScore && (
            <div className="
              p-4 rounded-xl text-center
              bg-yellow-100 text-black
              dark:bg-yellow-600/20 dark:text-yellow-300
            ">
              <p className="font-semibold">
                {language === "ar" ? "درجة المخاطر" : "Risk Score"}
              </p>

              <p className="text-2xl font-bold">
                {result.riskScore}%
              </p>

              <p className="mt-1 font-medium">
                {result.riskScore < 30
                  ? (language === "ar" ? "🟢 منخفض" : "Low Risk")
                  : result.riskScore < 70
                  ? (language === "ar" ? "🟡 متوسط" : "Medium Risk")
                  : (language === "ar" ? "🔴 مرتفع" : "High Risk")}
              </p>
            </div>
          )}

          {/* ✅ SUMMARY */}
          <div className="p-5 border rounded-xl shadow bg-white text-black border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600">
            <h2 className="font-semibold text-lg mb-2">
              {language === "ar" ? "الملخص" : "Summary"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {result.summary}
            </p>
          </div>

          {/* ⚠️ RISKS */}
          <div className="p-5 border rounded-xl shadow bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700">
            <h2 className="font-semibold text-lg text-red-600 mb-2 dark:text-red-400">
              ⚠️ {language === "ar" ? "المخاطر الرئيسية" : "Key Risks"}
            </h2>

            <ul className="space-y-2">
              {result.risks?.map((risk: string, i: number) => (
                <li key={i} className="text-gray-700 dark:text-gray-300">
                  • {risk}
                </li>
              ))}
            </ul>
          </div>

          {/* 💡 SUGGESTIONS */}
          <div className="p-5 border rounded-xl shadow bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700">
            <h2 className="font-semibold text-lg text-green-600 mb-2 dark:text-green-400">
              💡 {language === "ar" ? "التوصيات" : "Recommendations"}
            </h2>

            <ul className="space-y-2">
              {result.suggestions?.map((s: string, i: number) => (
                <li key={i} className="text-gray-700 dark:text-gray-300">
                  • {s}
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ ACTION BUTTONS */}
          <div className="flex gap-3 mt-4 flex-wrap">

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="
                px-4 py-2 rounded-lg border
                bg-white text-black border-gray-300
                dark:bg-gray-700 dark:text-white dark:border-gray-500
                hover:scale-105 active:scale-95 transition
              "
            >
              📋 {language === "ar" ? "نسخ النتائج" : "Copy Results"}
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="
                px-4 py-2 rounded-lg
                bg-black text-white hover:bg-gray-900
                dark:bg-white dark:text-black dark:hover:bg-gray-200
                transition transform active:scale-95
              "
            >
              📄 {language === "ar" ? "تحميل التقرير" : "Download PDF"}
            </button>

          </div>

        </div>
      )}
    </div>
  );
}

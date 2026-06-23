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

      {/* ✅ Upload Box */}
      <div className="
        p-6 border-2 border-dashed rounded-2xl text-center shadow-sm
        bg-white text-black border-gray-300
        dark:bg-gray-800 dark:text-white dark:border-gray-500
        transition-all duration-300 ease-in-out
        hover:shadow-md hover:border-black dark:hover:border-white
      ">

        <label className="cursor-pointer flex flex-col items-center">
          <p className="text-gray-600 dark:text-gray-300">
            {language === "ar"
              ? "اسحب العقد هنا أو اضغط للتحميل"
              : "Upload contract"}
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
            mt-3 px-3 py-1 text-sm rounded-full
            bg-gray-200 dark:bg-gray-700
            animate-fadeIn
          ">
            📄 {file.name}
          </div>
        )}


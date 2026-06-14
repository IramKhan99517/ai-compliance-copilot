"use client";

import { useState } from "react";

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

  return (
    <div className="mt-6 space-y-6">

      {/* 📤 Upload Box */}
      <div className="p-6 border-2 border-dashed rounded-2xl text-center bg-white shadow-sm">

        <label className="cursor-pointer flex flex-col items-center">
          <p className="font-medium">
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

        {/* File name */}
        {file && (
          <div className="mt-4 px-3 py-2 bg-gray-200 rounded-full inline-block text-sm">
            📄 {file.name}
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition transform hover:scale-105"
        >
          {language === "ar" ? "تحليل العقد" : "Analyze Contract"}
        </button>
      </div>

      {/* ⏳ Loading */}
      {loading && (
        <div className="text-center font-medium">
          {language === "ar" ? "جارٍ التحليل..." : "Analyzing contract..."}
        </div>
      )}

      {/* ✅ RESULT */}
      {result && (
        <div className="space-y-6">

          {/* ✅ Risk Score */}
          {result.riskScore && (
            <div className="p-4 bg-yellow-100 rounded-xl text-center">
              <p className="font-semibold">
                {language === "ar" ? "درجة المخاطر" : "Risk Score"}
              </p>
              <p className="text-2xl font-bold">{result.riskScore}%</p>
            </div>
          )}

          {/* ✅ SUMMARY */}
          <div className="p-5 border rounded-xl bg-white shadow">
            <h2 className="font-semibold text-lg mb-2">
              {language === "ar" ? "الملخص" : "Summary"}
            </h2>
            <p className="text-gray-700">
              {result.summary}
            </p>
          </div>

          {/* ⚠️ RISKS */}
          <div className="p-5 border rounded-xl bg-red-50 shadow">
            <h2 className="font-semibold text-lg text-red-600 mb-2">
              ⚠️ {language === "ar" ? "المخاطر الرئيسية" : "Key Risks"}
            </h2>

            <ul className="space-y-2">
              {result.risks?.map((risk: string, i: number) => (
                <li key={i} className="text-gray-700">
                  • {risk}
                </li>
              ))}
            </ul>
          </div>

          {/* 💡 SUGGESTIONS */}
          <div className="p-5 border rounded-xl bg-green-50 shadow">
            <h2 className="font-semibold text-lg text-green-600 mb-2">
              💡 {language === "ar" ? "التوصيات" : "Recommendations"}
            </h2>

            <ul className="space-y-2">
              {result.suggestions?.map((s: string, i: number) => (
                <li key={i} className="text-gray-700">
                  • {s}
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}

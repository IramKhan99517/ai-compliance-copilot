"use client";

import { useState } from "react";
import jsPDF from "jspdf";


export default function UploadBox({
  language = "en",
}: {
  language?: string;
}) {
  const [country, setCountry] = useState("UAE");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const extractResponse = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const extractedData = await extractResponse.json();

      if (!extractResponse.ok || !extractedData.text) {
        alert(
          extractedData.error ||
            "Unable to extract text from document."
        );
        return;
      }

      const text = extractedData.text;

      if (
        text.includes("endstream") ||
        text.includes("FlateDecode") ||
        text.includes("obj")
      ) {
        alert(
          "Unable to read this PDF correctly. Please upload another PDF or DOCX file."
        );
        return;
      }

      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          language,
          country,
        }),
      });

      const analysisData = await analysisResponse.json();

      setResult(analysisData);
    } catch (error) {
      console.error(error);
      alert("Error analyzing document.");
    } finally {
      setLoading(false);
    }
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

      {/* Country Selector */}
      <div className="space-y-2">
        <label className="font-medium">
          {language === "ar"
            ? "اختر الدولة"
            : "Select Country"}
        </label>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="
            w-full p-3 rounded-xl border
            bg-white text-black
            dark:bg-gray-800 dark:text-white
            dark:border-gray-600
          "
        >
          <option value="UAE">🇦🇪 UAE</option>
          <option value="KSA">🇸🇦 Saudi Arabia</option>
        </select>
      </div>

      {/* Upload */}
      <div
        className="
          p-8 border-2 border-dashed rounded-2xl text-center
          bg-white text-black border-gray-300
          dark:bg-gray-900 dark:text-white dark:border-gray-600
          transition-all duration-300
          hover:shadow-xl hover:border-black dark:hover:border-white
        "
      >
        <label className="cursor-pointer flex flex-col items-center space-y-3">
          <div
            className="
              w-12 h-12 flex items-center justify-center
              rounded-full bg-gray-100 dark:bg-gray-700
            "
          >
            📄
          </div>

          <p className="text-lg font-medium">
            {language === "ar"
              ? "اسحب العقد أو اضغط للتحميل"
              : "Upload your contract"}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {language === "ar"
              ? "يدعم TXT و PDF و DOCX"
              : "Supports TXT, PDF and DOCX contracts"}
          </p>

          <input
            type="file"
            accept=".txt,.pdf,.docx"
            className="hidden"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />
        </label>

        {file && (
          <div
            className="
              mt-4 px-4 py-2 rounded-full inline-block text-sm
              bg-gray-100 dark:bg-gray-700
              border border-gray-300 dark:border-gray-600
            "
          >
            ✅ {file.name}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
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
            ? language === "ar"
              ? "جارٍ التحليل..."
              : "Analyzing..."
            : language === "ar"
            ? "تحليل العقد"
            : "Analyze Contract →"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fadeIn">

          <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700">
            🌍 {language === "ar" ? "الدولة" : "Country"}: {country}
          </div>

          {result.languageDetected && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border dark:border-blue-700">
              🌐 {language === "ar"
                ? "اللغة المكتشفة"
                : "Language Detected"}
              : {result.languageDetected}
            </div>
          )}

          {result.jurisdiction && (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border dark:border-purple-700">
              ⚖️ {language === "ar"
                ? "الاختصاص القضائي"
                : "Jurisdiction"}
              : {result.jurisdiction}
            </div>
          )}

          <div className="p-4 bg-yellow-100 dark:bg-yellow-600/20 rounded-xl text-center">
            <p className="font-semibold">
              {language === "ar"
                ? "درجة المخاطر"
                : "Risk Score"}{" "}
              {result.riskScore}%
            </p>

            <p>
              {result.riskScore < 30
                ? "🟢 Low Risk"
                : result.riskScore < 70
                ? "🟡 Medium Risk"
                : "🔴 High Risk"}
            </p>
          </div>

          <div className="p-5 rounded-xl shadow bg-white dark:bg-gray-800 border dark:border-gray-600">
            <h2 className="font-semibold mb-2">
              {language === "ar" ? "الملخص" : "Summary"}
            </h2>

            <div className="whitespace-pre-wrap">
              {result.summary}
            </div>
          </div>

          <div className="p-5 rounded-xl shadow bg-red-50 dark:bg-red-900/20 border dark:border-red-700">
            <h2 className="font-semibold mb-2">
              {language === "ar" ? "المخاطر" : "Risks"}
            </h2>

            <ul>
              {result.risks?.map((r: string, i: number) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl shadow bg-green-50 dark:bg-green-900/20 border dark:border-green-700">
            <h2 className="font-semibold mb-2">
              {language === "ar"
                ? "التوصيات"
                : "Suggestions"}
            </h2>

            <ul>
              {result.suggestions?.map((s: string, i: number) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 border rounded-lg"
            >
              📋 Copy
            </button>

            <button
              onClick={handleDownload}
              className="
                px-4 py-2 rounded-lg
                bg-black text-white
                dark:bg-white dark:text-black
              "
            >
              📄 Download PDF
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

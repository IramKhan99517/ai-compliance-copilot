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

      {/* Upload */}
      <div className="p-6 border-2 border-dashed rounded-2xl text-center shadow-sm bg-white dark:bg-gray-800">

        <label className="cursor-pointer">
          <p>{language === "ar" ? "ارفع العقد" : "Upload contract"}</p>
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        {file && <p className="mt-2">{file.name}</p>}

        <button
          onClick={handleAnalyze}
          className="mt-4 px-6 py-2 bg-black text-white rounded-lg"
        >
          {language === "ar" ? "تحليل العقد" : "Analyze Contract"}
        </button>

      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">

          {/* ✅ Risk Score */}
          {result.riskScore && (
            <div className="p-4 bg-yellow-100 rounded-lg text-center">
              <p>
                {language === "ar" ? "درجة المخاطر" : "Risk Score"}:
                {" "} {result.riskScore}%
              </p>

              <p>
                {result.riskScore < 30
                  ? "🟢 Low Risk"
                  : result.riskScore < 70
                  ? "🟡 Medium Risk"
                  : "🔴 High Risk"}
              </p>
            </div>
          )}

          {/* ✅ Summary */}
          <div>
            <h2>Summary</h2>
            <p>{result.summary}</p>
          </div>

          {/* ✅ Risks */}
          <div>
            <h2>Risks</h2>
            <ul>
              {result.risks?.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* ✅ Suggestions */}
          <div>
            <h2>Suggestions</h2>
            <ul>
              {result.suggestions?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* ✅ ACTION BUTTONS */}
          <div className="flex gap-3">

            <button
              onClick={handleCopy}
              className="px-4 py-2 border rounded-lg"
            >
              Copy Results
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              Download PDF
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

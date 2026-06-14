"use client";

import { useState } from "react";

export default function VatChecker({ language = "en" }: { language?: string }) {
  const [revenue, setRevenue] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleCheck = () => {
    const rev = Number(revenue);

    if (!rev) return;

    let status = "";
    let steps: string[] = [];
    let filing: string[] = [];

    if (rev >= 375000) {
      status =
        language === "ar"
          ? "✅ يجب التسجيل في ضريبة القيمة المضافة (إلزامي)"
          : "✅ Mandatory VAT registration required in UAE";

      steps = [
        "Create FTA account at https://eservices.tax.gov.ae",
        "Fill VAT registration form",
        "Submit business details & documents",
        "Receive TRN (Tax Registration Number)"
      ];

    } else if (rev >= 187500) {
      status =
        language === "ar"
          ? "⚠️ يمكنك التسجيل طوعياً في ضريبة القيمة المضافة"
          : "⚠️ Eligible for voluntary VAT registration";

      steps = [
        "Create FTA account",
        "Submit voluntary registration",
        "Receive TRN"
      ];

    } else {
      status =
        language === "ar"
          ? "✅ لا يلزم التسجيل في الوقت الحالي"
          : "✅ VAT registration not required yet";
    }

    // ✅ Filing guidance (common)
    filing = [
      "File VAT returns quarterly via FTA portal",
      "Maintain invoices and records",
      "Pay VAT before deadline to avoid penalties"
    ];

    setResult({
      status,
      steps,
      filing
    });
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-2xl shadow space-y-4">

      {/* Title */}
      <h2 className="text-xl font-semibold">
        {language === "ar"
          ? "مدقق ضريبة القيمة المضافة 🇦🇪"
          : "UAE VAT Compliance Checker 🇦🇪"}
      </h2>

      <p className="text-sm text-gray-500">
        {language === "ar"
          ? "تحقق من التزاماتك الضريبية في الإمارات"
          : "Check your VAT registration obligations in the UAE"}
      </p>

      {/* Input */}
      <input
        type="number"
        placeholder={
          language === "ar"
            ? "أدخل الإيرادات السنوية (درهم)"
            : "Enter annual revenue (AED)"
        }
        className="w-full border p-3 rounded-lg"
        value={revenue}
        onChange={(e) => setRevenue(e.target.value)}
      />

      {/* Button */}
      <button
        onClick={handleCheck}
        className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition"
      >
        {language === "ar" ? "تحقق الآن" : "Check VAT Status"}
      </button>

      {/* ✅ Result */}
      {result && (
        <div className="space-y-4 mt-4">

          {/* Status */}
          <div className="p-4 bg-gray-100 rounded-lg font-medium">
            {result.status}
          </div>

          {/* ✅ Registration Steps */}
          {result.steps.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">
                📋 {language === "ar" ? "خطوات التسجيل" : "Registration Steps"}
              </h3>

              <ul className="space-y-1">
                {result.steps.map((step: string, i: number) => (
                  <li key={i}>• {step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ✅ Filing guidance */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2">
              💡 {language === "ar" ? "إرشادات الالتزام" : "Compliance & Filing"}
            </h3>

            <ul className="space-y-1">
              {result.filing.map((f: string, i: number) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}
`

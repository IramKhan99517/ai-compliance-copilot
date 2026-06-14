"use client";

import { useState } from "react";

export default function VatChecker({ language = "en" }: { language?: string }) {
  const [revenue, setRevenue] = useState("");
  const [lateDays, setLateDays] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleCheck = () => {
    const rev = Number(revenue);
    const daysLate = Number(lateDays);

    if (!rev) return;

    let status = "";
    let steps: string[] = [];
    let filing: string[] = [];
    let penalty = 0;

    // ✅ VAT Registration Logic
    if (rev >= 375000) {
      status =
        language === "ar"
          ? "✅ التسجيل في ضريبة القيمة المضافة إلزامي"
          : "✅ Mandatory VAT registration required in UAE";

      steps = [
        "Create FTA account at https://eservices.tax.gov.ae",
        "Fill VAT registration application",
        "Upload required business documents",
        "Receive TRN (Tax Registration Number)"
      ];

    } else if (rev >= 187500) {
      status =
        language === "ar"
          ? "⚠️ يمكنك التسجيل طوعياً"
          : "⚠️ Eligible for voluntary VAT registration";

      steps = [
        "Create FTA account",
        "Apply for voluntary VAT registration",
        "Submit required documents",
        "Receive TRN"
      ];
    } else {
      status =
        language === "ar"
          ? "✅ لا يلزم التسجيل حالياً"
          : "✅ VAT registration not required currently";
    }

    // ✅ Filing Guidance (Always shown)
    filing = [
      "File VAT returns quarterly via FTA portal",
      "Maintain invoices and financial records",
      "Pay VAT before deadline to avoid penalties",
      "VAT returns must be filed within 28 days of tax period end"
    ];

    // ✅ Penalty Calculation (Simplified UAE Model)
    if (daysLate > 0) {
      penalty = 1000;

      if (daysLate > 30) {
        penalty += 2000;
      }

      const percentagePenalty = rev * 0.02;
      penalty += Math.round(percentagePenalty);
    }

    setResult({
      status,
      steps,
      filing,
      penalty,
      lateDays: daysLate
    });
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-2xl shadow space-y-4">

      {/* ✅ TITLE */}
      <h2 className="text-xl font-semibold">
        {language === "ar"
          ? "مدقق ضريبة القيمة المضافة 🇦🇪"
          : "UAE VAT Compliance Checker 🇦🇪"}
      </h2>

      <p className="text-sm text-gray-500">
        {language === "ar"
          ? "تحقق من التزامات ضريبة القيمة المضافة وفق قوانين الإمارات"
          : "Check VAT obligations and compliance under UAE regulations"}
      </p>

      {/* ✅ Revenue Input */}
      <input
        type="number"
        placeholder={
          language === "ar"
            ? "الإيرادات السنوية (درهم)"
            : "Annual Revenue (AED)"
        }
        className="w-full border p-3 rounded-lg"
        value={revenue}
        onChange={(e) => setRevenue(e.target.value)}
      />

      {/* ✅ Late Days Input */}
      <input
        type="number"
        placeholder={
          language === "ar"
            ? "عدد أيام التأخير في التقديم"
            : "Days late for VAT filing"
        }
        className="w-full border p-3 rounded-lg"
        value={lateDays}
        onChange={(e) => setLateDays(e.target.value)}
      />

      {/* ✅ Button */}
      <button
        onClick={handleCheck}
        className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition"
      >
        {language === "ar" ? "تحقق الآن" : "Check VAT Status"}
      </button>

      {/* ✅ RESULT SECTION */}
      {result && (
        <div className="space-y-4 mt-4">

          {/* ✅ Status */}
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

          {/* ✅ Filing Guidance */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2">
              💡 {language === "ar" ? "إرشادات الامتثال" : "Compliance & Filing"}
            </h3>

            <ul className="space-y-1">
              {result.filing.map((f: string, i: number) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          </div>

          {/* ✅ Penalty Section */}
          {result.lateDays > 0 && (
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-600">
                ⚠️ {language === "ar" ? "غرامة التأخير" : "Late Filing Penalty"}
              </h3>

              <p className="mt-2 text-lg font-bold">
                AED {result.penalty}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                {language === "ar"
                  ? "تقدير تقريبي للغرامات حسب قوانين الإمارات"
                  : "Estimated penalty based on UAE VAT rules"}
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

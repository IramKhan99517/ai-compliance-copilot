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
    let penalty = 0;

    // ✅ Registration logic
    if (rev >= 375000) {
      status =
        language === "ar"
          ? "✅ التسجيل في ضريبة القيمة المضافة إلزامي"
          : "✅ Mandatory VAT registration required";
    } else if (rev >= 187500) {
      status =
        language === "ar"
          ? "⚠️ مؤهل للتسجيل الطوعي"
          : "⚠️ Eligible for voluntary registration";
    } else {
      status =
        language === "ar"
          ? "✅ غير مطلوب حالياً"
          : "✅ Not required currently";
    }

    // ✅ Penalty Calculation
    if (daysLate > 0) {
      penalty = 1000;

      if (daysLate > 30) {
        penalty += 2000; // repeated / serious delay
      }

      // extra % penalty simulation
      const percentagePenalty = rev * 0.02;
      penalty += Math.round(percentagePenalty);
    }

    setResult({
      status,
      penalty,
      lateDays: daysLate
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
          ? "تحقق من وضع ضريبة القيمة المضافة"
          : "Check VAT obligation and penalties"}
      </p>

      {/* Revenue Input */}
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

      {/* ✅ NEW: Late Days Input */}
      <input
        type="number"
        placeholder={
          language === "ar"
            ? "عدد أيام التأخير في التقديم"
            : "Days late for filing"
        }
        className="w-full border p-3 rounded-lg"
        value={lateDays}
        onChange={(e) => setLateDays(e.target.value)}
      />

      {/* Button */}
      <button
        onClick={handleCheck}
        className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900"
      >
        {language === "ar" ? "تحقق الآن" : "Check VAT"}
      </button>

      {/* Result */}
      {result && (
        <div className="space-y-4 mt-4">

          {/* Status */}
          <div className="p-4 bg-gray-100 rounded-lg font-medium">
            {result.status}
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
                  ? "تشمل غرامات التأخير وفق تقدير تقريبي"
                  : "Estimated penalty based on UAE VAT rules"}
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

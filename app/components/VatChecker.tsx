"use client";

import { useState } from "react";

export default function VatChecker({ language = "en" }: { language?: string }) {
  const [revenue, setRevenue] = useState("");
  const [lateDays, setLateDays] = useState("");
  const [result, setResult] = useState<any>(null);

  const isArabic = language === "ar";

  const handleCheck = () => {
    const rev = Number(revenue);
    const daysLate = Number(lateDays);

    if (!rev) return;

    let status = "";
    let steps: string[] = [];
    let filing: string[] = [];
    let penalty = 0;

    // ✅ Registration logic
    if (rev >= 375000) {
      status = isArabic
        ? "✅ التسجيل في ضريبة القيمة المضافة إلزامي"
        : "✅ Mandatory VAT registration required in UAE";

      steps = isArabic
        ? [
            "إنشاء حساب على بوابة الهيئة الاتحادية للضرائب عبر https://eservices.tax.gov.ae",
            "تعبئة نموذج التسجيل",
            "تحميل المستندات المطلوبة",
            "الحصول على رقم TRN"
          ]
        : [
            "Create FTA account via https://eservices.tax.gov.ae",
            "Fill VAT registration application",
            "Upload required documents",
            "Receive TRN"
          ];
    } else if (rev >= 187500) {
      status = isArabic
        ? "⚠️ يمكنك التسجيل طوعياً"
        : "⚠️ Eligible for voluntary VAT registration";

      steps = isArabic
        ? [
            "إنشاء حساب في بوابة الهيئة",
            "التقديم للتسجيل الطوعي",
            "إرسال المستندات",
            "الحصول على TRN"
          ]
        : [
            "Create FTA account",
            "Apply for voluntary registration",
            "Submit documents",
            "Receive TRN"
          ];
    } else {
      status = isArabic
        ? "✅ لا يلزم التسجيل حالياً"
        : "✅ VAT registration not required currently";
    }

    // ✅ Filing
    filing = isArabic
      ? [
          "تقديم الإقرارات الضريبية ربع سنوياً عبر بوابة FTA",
          "الاحتفاظ بالفواتير والسجلات",
          "دفع الضريبة قبل الموعد",
          "تقديم خلال 28 يوم من نهاية الفترة"
        ]
      : [
          "File VAT returns quarterly",
          "Maintain invoices and records",
          "Pay before deadline",
          "File within 28 days of period end"
        ];

    // ✅ Penalty
    if (daysLate > 0) {
      penalty = 1000;

      if (daysLate > 30) penalty += 2000;

      penalty += Math.round(rev * 0.02);
    }

    setResult({ status, steps, filing, penalty, lateDays: daysLate });
  };

  const handleReset = () => {
    setRevenue("");
    setLateDays("");
    setResult(null);
  };

  return (
    <div className="
      mt-6 p-6 rounded-2xl shadow space-y-4
      bg-white text-black
      dark:bg-gray-800 dark:text-white
    ">

      {/* ✅ TITLE */}
      <h2 className="text-xl font-semibold">
        {isArabic
          ? "مدقق ضريبة القيمة المضافة 🇦🇪"
          : "UAE VAT Compliance Checker 🇦🇪"}
      </h2>

      {/* ✅ Subtitle */}
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {isArabic
          ? "تحقق من الالتزامات والغرامات"
          : "Check VAT obligations and penalties"}
      </p>

      {/* ✅ Revenue input */}
      <input
        type="number"
        placeholder={
          isArabic ? "الإيرادات السنوية (درهم)" : "Annual Revenue (AED)"
        }
        className="
          w-full border p-3 rounded-lg
          bg-white text-black border-gray-300
          dark:bg-gray-700 dark:text-white dark:border-gray-600
        "
        value={revenue}
        onChange={(e) => setRevenue(e.target.value)}
      />

      {/* ✅ Late days */}
      <input
        type="number"
        placeholder={
          isArabic ? "عدد أيام التأخير" : "Days late for filing"
        }
        className="
          w-full border p-3 rounded-lg
          bg-white text-black border-gray-300
          dark:bg-gray-700 dark:text-white dark:border-gray-600
        "
        value={lateDays}
        onChange={(e) => setLateDays(e.target.value)}
      />

      {/* ✅ Buttons */}
      <div className="flex gap-3">

        <button
          onClick={handleCheck}
          className="
            px-6 py-3 rounded-xl transition transform hover:scale-105 active:scale-95
            bg-black text-white hover:bg-gray-900
            dark:bg-white dark:text-black dark:hover:bg-gray-200
          "
        >
          {isArabic ? "تحقق الآن" : "Check VAT"}
        </button>

        <button
          onClick={handleReset}
          className="
            px-6 py-3 border rounded-xl transition transform active:scale-95
            bg-white text-black border-gray-300
            dark:bg-gray-700 dark:text-white dark:border-gray-500
          "
        >
          {isArabic ? "إعادة تعيين" : "Reset"}
        </button>

      </div>

      {/* ✅ RESULT */}
      {result && (
        <div className="space-y-4 mt-4">

          {/* ✅ Status */}
          <div className="
            p-4 rounded-lg font-medium
            bg-gray-100 text-black
            dark:bg-gray-700 dark:text-white
          ">
            {result.status}
          </div>

          {/* ✅ Steps */}
          {result.steps.length > 0 && (
            <div className="
              p-4 rounded-lg
              bg-blue-50 text-black
              dark:bg-blue-900/20 dark:text-blue-300
            ">
              <h3 className="font-semibold mb-2">
                📋 {isArabic ? "خطوات التسجيل" : "Registration Steps"}
              </h3>
              <ul className="space-y-1">
                {result.steps.map((s: string, i: number) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ✅ Filing */}
          <div className="
            p-4 rounded-lg
            bg-green-50 text-black
            dark:bg-green-900/20 dark:text-green-300
          ">
            <h3 className="font-semibold mb-2">
              💡 {isArabic ? "إرشادات الامتثال" : "Compliance"}
            </h3>
            <ul className="space-y-1">
              {result.filing.map((f: string, i: number) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          </div>

          {/* ✅ Penalty */}
          {result.lateDays > 0 && (
            <div className="
              p-4 rounded-lg
              bg-red-50 text-black
              dark:bg-red-900/20 dark:text-red-300
            ">
              <h3 className="font-semibold text-red-600 dark:text-red-400">
                ⚠️ {isArabic ? "غرامة التأخير" : "Penalty"}
              </h3>
              <p className="font-bold mt-2">AED {result.penalty}</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

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
            "تعبئة نموذج التسجيل في ضريبة القيمة المضافة",
            "تحميل المستندات المطلوبة",
            "الحصول على رقم التسجيل الضريبي (TRN)"
          ]
        : [
            "Create FTA account via https://eservices.tax.gov.ae",
            "Fill VAT registration application",
            "Upload required business documents",
            "Receive TRN (Tax Registration Number)"
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
            "الحصول على رقم TRN"
          ]
        : [
            "Create FTA account",
            "Apply for voluntary VAT registration",
            "Submit required documents",
            "Receive TRN"
          ];
    } else {
      status = isArabic
        ? "✅ لا يلزم التسجيل حالياً"
        : "✅ VAT registration not required currently";
    }

    // ✅ Filing guidance
    filing = isArabic
      ? [
          "تقديم الإقرارات الضريبية ربع سنوياً عبر بوابة FTA",
          "الاحتفاظ بالفواتير والسجلات المالية",
          "دفع الضريبة قبل الموعد لتجنب الغرامات",
          "يجب تقديم الإقرار خلال 28 يوماً من نهاية الفترة الضريبية"
        ]
      : [
          "File VAT returns quarterly via FTA portal",
          "Maintain invoices and financial records",
          "Pay VAT before deadline to avoid penalties",
          "VAT returns must be filed within 28 days of tax period end"
        ];

    // ✅ Penalty calculation
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

  // ✅ Reset function
  const handleReset = () => {
    setRevenue("");
    setLateDays("");
    setResult(null);
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-2xl shadow space-y-4">

      {/* ✅ TITLE */}
      <h2 className="text-xl font-semibold">
        {isArabic
          ? "مدقق ضريبة القيمة المضافة 🇦🇪"
          : "UAE VAT Compliance Checker 🇦🇪"}
      </h2>

      {/* ✅ Subtext */}
      <p className="text-sm text-gray-500">
        {isArabic
          ? "تحقق من التزاماتك الضريبية والغرامات المحتملة"
          : "Check VAT obligations, registration and penalties"}
      </p>

      {/* ✅ Revenue */}
      <input
        type="number"
        placeholder={
          isArabic
            ? "الإيرادات السنوية (درهم)"
            : "Annual Revenue (AED)"
        }
        className="w-full border p-3 rounded-lg"
        value={revenue}
        onChange={(e) => setRevenue(e.target.value)}
      />

      {/* ✅ Late days */}
      <input
        type="number"
        placeholder={
          isArabic
            ? "عدد أيام التأخير"
            : "Days late for filing"
        }
        className="w-full border p-3 rounded-lg"
        value={lateDays}
        onChange={(e) => setLateDays(e.target.value)}
      />

      {/* ✅ Buttons */}
      <div className="flex gap-3">
        
        {/* ✅ Check Button */}
        <button
          onClick={handleCheck}
          className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition transform active:scale-95"
        >
          {isArabic ? "تحقق الآن" : "Check VAT"}
        </button>

        {/* ✅ Reset Button */}
        <button
          onClick={handleReset}
          className="px-6 py-3 border rounded-xl hover:bg-gray-100 transition transform active:scale-95"
        >
          {isArabic ? "إعادة تعيين" : "Reset"}
        </button>

      </div>

      {/* ✅ RESULT */}
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
                📋 {isArabic ? "خطوات التسجيل" : "Registration Steps"}
              </h3>

              <ul className="space-y-1">
                {result.steps.map((step: string, i: number) => (
                  <li key={i}>• {step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ✅ Filing */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2">
              💡 {isArabic ? "إرشادات الامتثال" : "Compliance & Filing"}
            </h3>

            <ul className="space-y-1">
              {result.filing.map((f: string, i: number) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          </div>

          {/* ✅ Penalty */}
          {result.lateDays > 0 && (
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-600">
                ⚠️ {isArabic ? "غرامة التأخير" : "Late Filing Penalty"}
              </h3>

              <p className="mt-2 text-lg font-bold">
                AED {result.penalty}
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

export default function VatChecker({ language = "en" }: { language?: string }) {
  const [revenue, setRevenue] = useState("");
  const [lateDays, setLateDays] = useState("");
  const [deadline, setDeadline] = useState("");
  const [result, setResult] = useState<any>(null);

  const isArabic = language === "ar";

  // ✅ Load saved deadline
  useEffect(() => {
    const savedDeadline = localStorage.getItem("vat_deadline");
    if (savedDeadline) setDeadline(savedDeadline);
  }, []);

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
        ? "✅ التسجيل إلزامي"
        : "✅ Mandatory VAT registration required";

      steps = isArabic
        ? [
            "إنشاء حساب على بوابة FTA",
            "تعبئة نموذج التسجيل",
            "تحميل المستندات",
            "الحصول على TRN"
          ]
        : [
            "Create FTA account",
            "Fill registration form",
            "Upload documents",
            "Get TRN"
          ];
    } else if (rev >= 187500) {
      status = isArabic
        ? "⚠️ تسجيل طوعي"
        : "⚠️ Eligible for voluntary registration";

      steps = isArabic
        ? ["إنشاء حساب", "تقديم طلب", "إرسال المستندات", "الحصول على TRN"]
        : ["Create account", "Apply", "Submit docs", "Get TRN"];
    } else {
      status = isArabic
        ? "✅ لا يلزم التسجيل"
        : "✅ No VAT registration required";
    }

    // ✅ Filing
    filing = isArabic
      ? ["تقديم الإقرار", "الاحتفاظ بالسجلات", "الدفع في الوقت"]
      : ["File returns", "Maintain records", "Pay on time"];

    // ✅ Penalty
    if (daysLate > 0) {
      penalty = 1000;
      if (daysLate > 30) penalty += 2000;
      penalty += Math.round(rev * 0.02);
    }

    // ✅ Save deadline
    if (deadline) {
      localStorage.setItem("vat_deadline", deadline);
    }

    setResult({ status, steps, filing, penalty, lateDays: daysLate });
  };

  // ✅ Deadline logic
  const calculateDays = () => {
    if (!deadline) return null;

    const today = new Date();
    const due = new Date(deadline);

    const diff = Math.floor(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return diff;
  };

  const daysLeft = calculateDays();

  return (
    <div className="
      mt-6 p-6 rounded-2xl shadow space-y-4
      bg-white text-black
      dark:bg-gray-800 dark:text-white
    ">

      {/* ✅ TITLE */}
      <h2 className="text-xl font-semibold">
        {isArabic ? "مدقق ضريبة القيمة المضافة 🇦🇪" : "UAE VAT Checker 🇦🇪"}
      </h2>

      {/* ✅ Revenue */}
      <input
        type="number"
        placeholder={isArabic ? "الإيرادات السنوية" : "Annual Revenue (AED)"}
        className="w-full border p-3 rounded-lg dark:bg-gray-700"
        value={revenue}
        onChange={(e) => setRevenue(e.target.value)}
      />

      {/* ✅ Late days */}
      <input
        type="number"
        placeholder={isArabic ? "أيام التأخير" : "Days late"}
        className="w-full border p-3 rounded-lg dark:bg-gray-700"
        value={lateDays}
        onChange={(e) => setLateDays(e.target.value)}
      />

      {/* ✅ NEW: Deadline input */}
      <div>
        <label className="text-sm block mb-1">
          {isArabic ? "تاريخ الاستحقاق" : "VAT Deadline"}
        </label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full border p-3 rounded-lg dark:bg-gray-700"
        />
      </div>

      {/* ✅ DEADLINE ALERT */}
      {daysLeft !== null && (
        <>
          {daysLeft >= 0 && daysLeft <= 5 && (
            <div className="p-3 bg-yellow-100 dark:bg-yellow-600/20 rounded-lg">
              ⚠️ {isArabic
                ? `متبقي ${daysLeft} يوم`
                : `Due in ${daysLeft} days`}
            </div>
          )}

          {daysLeft < 0 && (
            <div className="p-3 bg-red-100 dark:bg-red-600/20 rounded-lg">
              ❌ {isArabic ? "تم تجاوز الموعد" : "Deadline missed!"}
            </div>
          )}
        </>
      )}

      {/* ✅ Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCheck}
          className="px-6 py-3 bg-black text-white rounded-xl hover:scale-105 active:scale-95 transition dark:bg-white dark:text-black"
        >
          {isArabic ? "تحقق الآن" : "Check VAT"}
        </button>

        <button
          onClick={() => {
            setRevenue("");
            setLateDays("");
            setDeadline("");
            setResult(null);
          }}
          className="px-6 py-3 border rounded-xl"
        >
          {isArabic ? "إعادة تعيين" : "Reset"}
        </button>
      </div>

      {/* ✅ RESULT */}
      {result && (
        <div className="space-y-4 mt-4 animate-fadeIn">

          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {result.status}
          </div>

          {result.steps.length > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3>📋 Steps</h3>
              <ul>
                {result.steps.map((s: string, i: number) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3>💡 Compliance</h3>
            <ul>
              {result.filing.map((f: string, i: number) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          </div>

          {result.lateDays > 0 && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3>⚠️ Penalty</h3>
              <p>AED {result.penalty}</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

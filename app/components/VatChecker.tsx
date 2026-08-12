"use client";

import { useState, useEffect } from "react";

export default function VatChecker({
  language = "en",
  country,
}: {
  language?: string;
  country: string;
}) {
  const [revenue, setRevenue] = useState("");
  const [lateDays, setLateDays] = useState("");
  const [deadline, setDeadline] = useState("");
  const [result, setResult] = useState<any>(null);

  const isArabic = language === "ar";

  const isKSA = country === "Saudi Arabia";

   useEffect(() => {
  const savedDeadline = localStorage.getItem("vat_deadline");

  if (savedDeadline) {
    setDeadline(savedDeadline);
  } else {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    setDeadline(today);
  }
}, []);

  const handleCheck = () => {
    const rev = Number(revenue);
    const daysLate = Number(lateDays);

    if (!rev) return;

    let status = "";
    let steps: string[] = [];
    let filing: string[] = [];
    let penalty = 0;

    const threshold = isKSA ? 375000 : 375000;
    const voluntaryThreshold = isKSA
      ? 187500
      : 187500;

    if (rev >= threshold) {
      status = isArabic
        ? "✅ التسجيل إلزامي"
        : `✅ Mandatory VAT registration required (${isKSA ? "ZATCA" : "FTA"})`;

      steps = isArabic
        ? [
            "إنشاء حساب",
            "تقديم طلب التسجيل",
            "تحميل المستندات",
            "الحصول على رقم التسجيل"
          ]
        : [
            isKSA
              ? "Create ZATCA account"
              : "Create FTA account",
            "Submit registration",
            "Upload documents",
            "Receive VAT registration number"
          ];
    } else if (rev >= voluntaryThreshold) {
      status = isArabic
        ? "⚠️ تسجيل طوعي"
        : "⚠️ Eligible for voluntary registration";

      steps = isArabic
        ? [
            "إنشاء حساب",
            "تقديم الطلب",
            "رفع المستندات"
          ]
        : [
            isKSA
              ? "Create ZATCA account"
              : "Create FTA account",
            "Apply for registration",
            "Submit supporting documents"
          ];
    } else {
      status = isArabic
        ? "✅ لا يلزم التسجيل"
        : "✅ No VAT registration required";
    }

    filing = isArabic
      ? [
          "الاحتفاظ بالسجلات",
          "تقديم الإقرارات الضريبية",
          "السداد في الوقت المحدد"
        ]
      : [
          "Maintain VAT records",
          "Submit VAT returns",
          "Pay VAT on time"
        ];

    if (daysLate > 0) {
      penalty = 1000;

      if (daysLate > 30) {
        penalty += 2000;
      }

      penalty += Math.round(rev * 0.02);
    }

    if (deadline) {
      localStorage.setItem(
        "vat_deadline",
        deadline
      );
    }

    setResult({
      status,
      steps,
      filing,
      penalty,
      lateDays: daysLate,
    });
  };

  const calculateDays = () => {
    if (!deadline) return null;

    const today = new Date();
    const due = new Date(deadline);

    return Math.floor(
      (due.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const daysLeft = calculateDays();

  return (
    <div
      className="
        mt-6 p-6 rounded-2xl shadow space-y-4
        bg-white text-black
        dark:bg-gray-800 dark:text-white
      "
    >
      <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700">
        🌍 {country}
      </div>

      <h2 className="text-xl font-semibold">
        {isArabic
          ? "مساعد الامتثال الضريبي"
          : "💰 VAT Compliance Copilot"}
      </h2>

      <input
        type="number"
        placeholder={
          isArabic
            ? "الإيرادات السنوية"
            : "Annual Revenue"
        }
        value={revenue}
        onChange={(e) =>
          setRevenue(e.target.value)
        }
        className="w-full border p-3 rounded-lg dark:bg-gray-700"
      />

      <input
        type="number"
        placeholder={
          isArabic ? "أيام التأخير" : "Days Late"
        }
        value={lateDays}
        onChange={(e) =>
          setLateDays(e.target.value)
        }
        className="w-full border p-3 rounded-lg dark:bg-gray-700"
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) =>
          setDeadline(e.target.value)
        }
        className="w-full border p-3 rounded-lg dark:bg-gray-700"
      />

      {daysLeft !== null && (
        <>
          {daysLeft >= 0 && daysLeft <= 5 && (
            <div className="p-3 rounded-lg bg-yellow-100">
              ⚠️ Due in {daysLeft} days
            </div>
          )}

          {daysLeft < 0 && (
            <div className="p-3 rounded-lg bg-red-100">
              ❌ Deadline missed
            </div>
          )}
        </>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleCheck}
          className="px-6 py-3 rounded-xl bg-black text-white"
        >
          {isArabic
            ? "تحقق الآن"
            : "Check Compliance"}
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
          Reset
        </button>
      </div>

      {result && (
        <div className="space-y-4">

          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
            {result.status}
          </div>

          <div className="p-4 rounded-lg bg-blue-50">
            <h3 className="font-semibold mb-2">
              📋 Registration Steps
            </h3>

            <ul>
              {result.steps.map(
                (step: string, index: number) => (
                  <li key={index}>
                    • {step}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-green-50">
            <h3 className="font-semibold mb-2">
              ✅ Compliance
            </h3>

            <ul>
              {result.filing.map(
                (item: string, index: number) => (
                  <li key={index}>
                    • {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {result.lateDays > 0 && (
            <div className="p-4 rounded-lg bg-red-50">
              <h3 className="font-semibold mb-2">
                ⚠️ Estimated Penalty
              </h3>

              <p>
                {isKSA ? "SAR" : "AED"}{" "}
                {result.penalty}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

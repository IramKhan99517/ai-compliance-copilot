"use client";

import { useState } from "react";

export default function VatChecker({
  language = "en",
}: {
  language?: string;
}) {
  const [revenue, setRevenue] = useState("");
  const [result, setResult] = useState("");

  const handleCheck = () => {
    const rev = Number(revenue);

    if (!rev) return;

    if (rev >= 375000) {
      setResult(
        language === "ar"
          ? "✅ يجب التسجيل في ضريبة القيمة المضافة (تجاوز الحد الإلزامي)"
          : "✅ You MUST register for VAT in UAE (mandatory threshold exceeded)."
      );
    } else if (rev >= 187500) {
      setResult(
        language === "ar"
          ? "⚠️ يمكنك التسجيل طوعياً في ضريبة القيمة المضافة"
          : "⚠️ You are eligible for voluntary VAT registration."
      );
    } else {
      setResult(
        language === "ar"
          ? "✅ لا يلزم التسجيل حالياً في ضريبة القيمة المضافة"
          : "✅ VAT registration is not required yet."
      );
    }
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-2xl shadow space-y-4">

      <h2 className="text-xl font-semibold">
        {language === "ar"
          ? "مدقق ضريبة القيمة المضافة"
          : "VAT Compliance Checker"}
      </h2>

      <p className="text-sm text-gray-500">
        {language === "ar"
          ? "تحقق مما إذا كان يجب عليك التسجيل في ضريبة القيمة المضافة في الإمارات"
          : "Check whether your business needs VAT registration in UAE"}
      </p>

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

      <button
        onClick={handleCheck}
        className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        {language === "ar" ? "تحقق الآن" : "Check VAT Status"}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          {result}
        </div>
      )}

    </div>
  );
}
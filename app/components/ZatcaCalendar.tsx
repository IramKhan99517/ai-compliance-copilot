"use client";

import { useState } from "react";

export default function ZatcaVatChecker() {
  const [revenue, setRevenue] = useState("");
  const [result, setResult] = useState("");

  const handleCheck = () => {
    const amount = Number(revenue);

    if (amount >= 375000) {
      setResult(
        "✅ VAT registration is mandatory under ZATCA."
      );
    } else {
      setResult(
        "ℹ️ VAT registration may not be mandatory."
      );
    }
  };

  return (
    <div className="p-6 rounded-xl bg-white shadow">
      <h2 className="text-xl font-bold mb-4">
        🇸🇦 ZATCA VAT Checker
      </h2>

      <input
        type="number"
        placeholder="Annual Revenue (SAR)"
        value={revenue}
        onChange={(e) => setRevenue(e.target.value)}
        className="w-full border p-3 rounded-lg"
      />

      <button
        onClick={handleCheck}
        className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
      >
        Check VAT Status
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          {result}
        </div>
      )}
    </div>
  );
}

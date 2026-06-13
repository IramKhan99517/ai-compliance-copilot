"use client";

import { useState } from "react";
import UploadBox from "./components/UploadBox";
import VatChecker from "./components/VatChecker";
import { Moon, Sun } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("contract");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  const isArabic = language === "ar";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      {/* HEADER */}
      <div className={`border-b ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto p-6 flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              LIMRA — {isArabic ? "مساعد الامتثال الذكي" : "AI Compliance Copilot"} 🇦🇪
            </h1>

            <p className="text-sm mt-1 text-gray-500">
              {isArabic
                ? "تحليل العقود والامتثال الضريبي باستخدام الذكاء الاصطناعي"
                : "Smart contract analysis & VAT compliance powered by AI"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Language */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded px-2 py-1 bg-transparent"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>

            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 border rounded"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto p-6">

          {/* Tabs */}
          <div
            className={`flex gap-3 p-2 rounded-xl shadow-sm w-fit ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <button
              onClick={() => setActiveTab("contract")}
              className={`px-5 py-2 rounded-lg ${
                activeTab === "contract"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {isArabic ? "تحليل العقود" : "Contract Analyzer"}
            </button>

            <button
              onClick={() => setActiveTab("vat")}
              className={`px-5 py-2 rounded-lg ${
                activeTab === "vat"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {isArabic ? "فحص ضريبة القيمة المضافة" : "VAT Checker"}
            </button>
          </div>

          {/* Feature Content */}
          <div className="mt-6">
            {activeTab === "contract" && (
              <UploadBox language={language} />
            )}
            {activeTab === "vat" && (
              <VatChecker language={language} />
            )}
          </div>

        </div>
      </div>

      {/* ✅ CLEAN FOOTER (NO ERRORS) */}
      <footer
        className={`mt-10 border-t ${
          darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
        }`}
      >
        <div className="max-w-4xl mx-auto p-6 text-sm flex justify-between">

          <p>
            {isArabic
              ? "© 2026 LIMRA AI جميع الحقوق محفوظة"
              : "© 2026 LIMRA AI — All rights reserved"}
          </p>

          <div className="flex gap-4 font-medium">
            <span className="hover:underline cursor-pointer">
              {isArabic ? "اتصل بنا" : "Contact"}
            </span>

            <span className="hover:underline cursor-pointer">
              {isArabic ? "الخصوصية" : "Privacy"}
            </span>
          </div>

        </div>
      </footer>
    </main>
  );
}
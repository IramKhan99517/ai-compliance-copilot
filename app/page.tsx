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
      {/* 🔷 HEADER */}
      <div className={`border-b ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto p-6 flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              LIMRA 🇦🇪
            </h1>

            <p className="text-gray-500 mt-1">
              {isArabic
                ? "مساعد الامتثال الذكي للشركات في الإمارات"
                : "AI Compliance Copilot for UAE Businesses"}
            </p>

            <p className="text-sm mt-1 text-gray-500">
              {isArabic
                ? "تحليل العقود والامتثال الضريبي باستخدام الذكاء الاصطناعي"
                : "Smart contract analysis & VAT compliance powered by AI"}
            </p>
          </div>

          {/* Controls */}
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

      {/* 🔷 CONTENT */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto p-6">

          {/* Tabs */}
          <div
            className={`flex gap-3 p-2 rounded-full shadow-sm w-fit ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <button
              onClick={() => setActiveTab("contract")}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeTab === "contract"
                  ? "bg-black text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {isArabic ? "تحليل العقود 🇦🇪" : "Contract Analyzer 🇦🇪"}
            </button>

            <button
              onClick={() => setActiveTab("vat")}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeTab === "vat"
                  ? "bg-black text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {isArabic ? "فحص ضريبة القيمة المضافة 🇦🇪" : "VAT Checker 🇦🇪"}
            </button>
          </div>

          {/* Feature Content */}
          <div className="mt-6">
            {activeTab === "contract" && <UploadBox language={language} />}
            {activeTab === "vat" && <VatChecker language={language} />}
          </div>

        </div>
      </div>

      {/* 🔻 FOOTER */}
      <footer
        className={`mt-10 border-t ${
          darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
        }`}
      >
        <div className="max-w-4xl mx-auto p-6 text-sm space-y-4">

          {/* Copyright */}
          <p>
            {isArabic
              ? "© 2026 LIMRA AI جميع الحقوق محفوظة"
              : "© 2026 LIMRA AI — All rights reserved"}
          </p>

          {/* Contact Info ✅ */}
          <div className="text-sm space-y-1">
            <p className="font-semibold">
              {isArabic ? "معلومات الاتصال" : "Contact"}
            </p>

            <p>
              {isArabic
                ? "إرم مجيد خان (المؤسس)"
                : "Iram Majeed Khan (Founder)"}
            </p>

            <p>Email: iramk99517@gmail.com</p>
            <p>Phone: +91 9892361112</p>
          </div>

        </div>
      </footer>
    </main>
  );
}

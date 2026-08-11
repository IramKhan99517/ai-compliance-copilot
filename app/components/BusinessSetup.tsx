"use client";

import { useState } from "react";
import templates from "@/data/business-templates.json";

export default function BusinessSetup() {
  const [country, setCountry] = useState("UAE");
  const [businessType, setBusinessType] = useState("Bakery");

  const selectedCountry =
    templates[country as keyof typeof templates];

  const plan =
    selectedCountry?.[
      businessType as keyof typeof selectedCountry
    ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Business Setup Advisor
      </h2>

      {/* Country Selection */}
      <div>
        <label className="block mb-2 font-medium">
          Country
        </label>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          {Object.keys(templates).map((countryName) => (
            <option
              key={countryName}
              value={countryName}
            >
              {countryName}
            </option>
          ))}
        </select>
      </div>

      {/* Business Type */}
      <div>
        <label className="block mb-2 font-medium">
          Business Type
        </label>

        <select
          value={businessType}
          onChange={(e) =>
            setBusinessType(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        >
          {Object.keys(selectedCountry).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {plan && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border">
            <h3 className="font-bold text-lg mb-2">
              Licenses Required
            </h3>

            {plan.licenses?.map((license: string) => (
              <div key={license}>
                ✅ {license}
              </div>
            ))}
          </div>

          <div className

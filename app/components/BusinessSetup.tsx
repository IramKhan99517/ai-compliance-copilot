"use client";

import { useState } from "react";
import templates from "@/data/business-templates.json";

export default function BusinessSetup() {
  const [country, setCountry] = useState("UAE");
  const [businessType, setBusinessType] = useState("Bakery");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCountry =
    templates[country as keyof typeof templates];

  const plan =
    selectedCountry?.[
      businessType as keyof typeof selectedCountry
    ];

  //ask Limra here
  const askLimra = async () => {
  if (!question.trim()) return;

  setLoading(true);

  try {
    const response = await fetch(
      "/api/business-advisor",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          country,
          businessType,
        }),
      }
    );

    const data = await response.json();

    setAnswer(data.answer);
  } catch (error) {
    console.error(error);
    setAnswer("Unable to get advice.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Business Setup Advisor
      </h2>

      {/* Country */}
      <div>
        <label className="block mb-2 font-medium">
          Country
        </label>

        <select
          value={country}
          onChange={(e) => {
            const newCountry = e.target.value;

            setCountry(newCountry);

            const firstBusiness =
              Object.keys(
                templates[
                  newCountry as keyof typeof templates
                ]
              )[0];

            setBusinessType(firstBusiness);
          }}
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
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">
              Licenses Required
            </h3>

            {plan.licenses?.map((license: string) => (
              <div key={license}>
                ✅ {license}
              </div>
            ))}
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">
              Documents Required
            </h3>

            {plan.documents?.map((doc: string) => (
              <div key={doc}>
                📄 {doc}
              </div>
            ))}
          </div>

          {plan.authorities && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">
                Authorities
              </h3>

              {plan.authorities.map(
                (authority: string) => (
                  <div key={authority}>
                    🏛️ {authority}
                  </div>
                )
              )}
            </div>
          )}

          {plan.taxRequirements && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">
                Tax Requirements
              </h3>

              {plan.taxRequirements.map(
                (tax: string) => (
                  <div key={tax}>
                    💰 {tax}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

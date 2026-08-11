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
  const suggestions = [
  "How do I start this business?",
  "What licenses do I need?",
  "What documents are required?",
  "Do I need VAT registration?",
  "Which government approvals are required?",
];

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

         {plan && (
  <div className="p-4 border rounded-lg space-y-4">
    <h3 className="font-semibold text-lg">
      🚀 LIMRA Business Setup Copilot
    </h3>

    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() =>
          setQuestion(`How do I start a ${businessType}?`)
        }
        className="px-3 py-2 text-sm border rounded-full"
      >
        How do I start this business?
      </button>

      <button
        type="button"
        onClick={() =>
          setQuestion(
            `What licenses are required for a ${businessType}?`
          )
        }
        className="px-3 py-2 text-sm border rounded-full"
      >
        Licenses Required
      </button>

      <button
        type="button"
        onClick={() =>
          setQuestion(
            `What documents are required for a ${businessType}?`
          )
        }
        className="px-3 py-2 text-sm border rounded-full"
      >
        Documents Required
      </button>

      <button
        type="button"
        onClick={() =>
          setQuestion("Do I need VAT registration?")
        }
        className="px-3 py-2 text-sm border rounded-full"
      >
        VAT Registration
      </button>
    </div>

    <textarea
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      placeholder="Ask anything about starting this business..."
      className="w-full border rounded-lg p-3"
      rows={4}
    />

    <button
      onClick={askLimra}
      className="px-6 py-2 bg-black text-white rounded-lg"
    >
      {loading ? "Thinking..." : "Ask LIMRA"}
    </button>

    {answer && (
      <div className="p-4 border rounded-lg whitespace-pre-wrap">
        {answer}
      </div>
    )}
  </div>

            <textarea
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="What documents do I need to start this business?"
              className="w-full border rounded-lg p-3"
              rows={4}
            />

            <button
              onClick={askLimra}
              className="px-6 py-2 bg-black text-white rounded-lg"
            >
              {loading
                ? "Thinking..."
                : "Ask LIMRA"}
            </button>

            {answer && (
              <div className="p-4 border rounded-lg bg-gray-50 text-black whitespace-pre-wrap">
                {answer}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

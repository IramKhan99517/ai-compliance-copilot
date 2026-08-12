"use client";

import { useState } from "react";
import templates from "@/data/business-templates.json";

  export default function BusinessSetup({
    language = "en",
      country,
    }: {
    language?: string;
    country: string;
    }) {
  const [businessType, setBusinessType] = useState("Bakery");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCountry =
    templates[country as keyof typeof templates];

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
        🚀 LIMRA Business Setup Copilot
      </h2>

      <div>
        <label className="block mb-2 font-medium">
          Country
        </label>

        <select
          value={country}
          onChange={(e) => {
            const newCountry = e.target.value;

      

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

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() =>
            setQuestion(
              `How do I start a ${businessType}?`
            )
          }
          className="px-3 py-2 text-sm border rounded-full"
        >
          How do I start this business?
        </button>

        <button
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
          onClick={() =>
            setQuestion(
              "Do I need VAT registration?"
            )
          }
          className="px-3 py-2 text-sm border rounded-full"
        >
          VAT Registration
        </button>
      </div>

      <textarea
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)
        }
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
  );
}

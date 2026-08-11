"use client";

import { useState } from "react";
import templates from "@/data/business-templates.json";

export default function BusinessSetup() {
  const [country, setCountry] = useState("UAE");
  const [businessType, setBusinessType] = useState("Bakery");

  const plan =
    templates[country as keyof typeof templates]?.[
      businessType as keyof (typeof templates)["UAE"]
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
            setCountry(e.target.value);
            setBusinessType("Bakery");
          }}
          className="w-full border rounded-lg p-3"
        >
          <option value="UAE">UAE</option>
        </select>
      </div>

      {/* Business Type */}
      <div>
        <label className="block mb-2 font-medium">
          Business Type
        </label>

        <select
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          {Object.keys(templates[country]).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Plan */}
      {plan && (
        <div className="space-y-5">

          <div>
            <h3 className="font-bold text-lg">
              Licenses Required
            </h3>

            {plan.licenses.map((license) => (
              <div key={license}>
                ✅ {license}
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-bold text-lg">
              Documents Required
            </h3>

            {plan.documents.map((doc) => (
              <div key={doc}>
                📄 {doc}
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-bold text-lg">
              Authorities
            </h3>

            {plan.authorities?.map((authority) => (
              <div key={authority}>
                🏛️ {authority}
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}

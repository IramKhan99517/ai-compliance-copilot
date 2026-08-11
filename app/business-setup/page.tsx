import templates from "@/data/business-templates.json";

export default function BusinessSetup() {
  const plan = templates.UAE.Bakery;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Business Setup Advisor
      </h1>

      <h2 className="text-xl font-semibold mb-2">
        Licenses Required
      </h2>

      <ul>
        {plan.licenses.map((license) => (
          <li key={license}>✅ {license}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">
        Documents Required
      </h2>

      <ul>
        {plan.documents.map((doc) => (
          <li key={doc}>📄 {doc}</li>
        ))}
      </ul>
    </div>
  );
}

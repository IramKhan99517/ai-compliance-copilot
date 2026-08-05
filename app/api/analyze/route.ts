// ✅ Simple in-memory usage tracker
let usageMap: Record<string, number> = {};

export async function POST(req: Request) {
  try {
    console.log("KEY:", process.env.GROQ_API_KEY);

    // ✅ Identify user
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // ✅ Increment usage
    usageMap[ip] = (usageMap[ip] || 0) + 1;

    console.log("USAGE TRACK:", {
      ip,
      count: usageMap[ip],
      time: new Date(),
    });

    // ✅ Limit usage
    if (usageMap[ip] > 5) {
      return Response.json({
        summary:
          "Usage limit reached. Please contact admin for extended access.",
        risks: [],
        suggestions: [],
        jurisdiction: "Unknown",
        languageDetected: "Unknown",
        riskScore: 0,
      });
    }

    // ✅ Get input
    const { text, country } = await req.json();

    // ✅ Language detection
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    const hasEnglish = /[A-Za-z]/.test(text);

    let detectedLanguage = "English";

    if (hasArabic && hasEnglish) {
      detectedLanguage = "Bilingual";
    } else if (hasArabic) {
      detectedLanguage = "Arabic";
    }

    // ✅ AI Prompt
    const prompt = `
You are a senior UAE and Saudi Arabia (KSA) legal and compliance expert.

Country selected: ${country}

${
  country === "KSA"
    ? "Review this contract according to Saudi Arabian laws and ZATCA compliance requirements."
    : "Review this contract according to UAE laws and FTA compliance requirements."
}

Language detected: ${detectedLanguage}

Rules:

- Arabic contracts → respond in Arabic.
- English contracts → respond in English.
- Bilingual contracts → respond in English and clearly state that both Arabic and English clauses were detected.
- For bilingual contracts, identify inconsistencies between Arabic and English clauses.

Review the contract and identify:

- Payment risks
- Termination risks
- Liability risks
- Missing obligations
- Missing deadlines
- Governing law concerns
- UAE compliance concerns
- KSA (ZATCA) compliance concerns
- Missing dispute resolution clauses
- Missing confidentiality protections

Return VALID JSON ONLY:

{
  "summary": "Detailed contract summary",
  "risks": [
    "Risk 1",
    "Risk 2"
  ],
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2"
  ],
  "jurisdiction": "UAE or KSA or International",
  "languageDetected": "Arabic or English or Bilingual"
}

Contract:
${text}
`;

    // ✅ Call Groq
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
        role: "user",
        content: prompt,
    },
  ],
}),
      }
        );
   

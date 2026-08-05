// ✅ Simple in-memory usage tracker
let usageMap: Record<string, number> = {};

export async function POST(req: Request) {
  try {
    console.log("KEY:", process.env.GROQ_API_KEY);

    // ✅ Identify user (IP address)
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

    // ✅ Limit usage (5 requests per user)
    if (usageMap[ip] > 5) {
      return Response.json({
        summary:
          "Usage limit reached. Please contact admin for extended access.",
        risks: [],
        suggestions: [],
        riskScore: 0,
      });
    }

    // ✅ Get input
    const { text, language } = await req.json();

const hasArabic = /[\u0600-\u06FF]/.test(text);

const prompt = `
You are a senior UAE and Saudi Arabia (KSA) legal and compliance expert.

${
  hasArabic
    ? `
The contract contains Arabic text.

Analyze Arabic and English clauses accurately.

If the contract contains both Arabic and English:
- Identify inconsistencies between languages.
- Highlight regulatory concerns.
- Explain legal risks clearly.

Respond primarily in Arabic.
`
    : `
The contract is written in English.

Respond in English.
`
}

Review the contract and identify:

- Payment risks
- Termination risks
- Liability risks
- Missing obligations
- Missing deadlines
- Governing law concerns
- UAE compliance concerns
- KSA (ZATCA) compliance concerns where applicable

Return VALID JSON ONLY.

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

    // ✅ Call Groq API
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
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();
    console.log("GROQ RAW RESPONSE:", JSON.stringify(data, null, 2));

    let content = data?.choices?.[0]?.message?.content;

    // ✅ Safety check
    if (!content) {
      return Response.json({
        summary: "No response generated",
        risks: [],
        suggestions: [],
        riskScore: 0,
      });
    }

    // ✅ Clean markdown
    content = content.replace(/```json|```/g, "").trim();

    // ✅ Extract JSON
  const match = content.match(/\{[\s\S]*\}/);

let parsed: any = null;

if (match) {
  try {
    parsed = JSON.parse(match[0]);
  } catch (error) {
    console.error("JSON Parse Error:", error);
  }
}

    // ✅ Fallback response
    if (!parsed) {
  return Response.json({
    summary: content,
    risks: [],
    suggestions: [],
    jurisdiction: "Unknown",
    languageDetected: "Unknown",
    riskScore: Math.floor
      });
    }

    // ✅ Final response
    

   return Response.json({
  summary: parsed.summary || "No summary",
  risks: parsed.risks || [],
  suggestions: parsed.suggestions || [],
  jurisdiction: parsed.jurisdiction || "Unknown",
  languageDetected: parsed.languageDetected || "Unknown",
  riskScore: Math.floor(Math.random() * 100),
});
  }
}

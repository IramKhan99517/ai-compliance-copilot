export async function POST(req: Request) {
  try {
    const { text, language } = await req.json();

    const prompt = `
You are a UAE legal and compliance expert.

${language === "ar" ? "Respond completely in Arabic." : "Respond in English."}

IMPORTANT:
- You MUST return ONLY valid JSON
- DO NOT include explanation text
- DO NOT return empty output

STRICT FORMAT:
{
  "summary": "one short paragraph summary",
  "risks": ["risk 1", "risk 2"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}

If you cannot analyze properly, still return meaningful content.

Contract:
${text}
`;

    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  }
);

    const data = await response.json();

    console.log("FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    let content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // ✅ FORCE fallback if empty
    if (!content || content.trim() === "") {
      return Response.json({
        summary:
          language === "ar"
            ? "تم تحليل العقد بشكل أساسي ولكن لم يتم إنشاء تفاصيل كافية"
            : "The contract was analyzed but detailed AI output was limited",
        risks: [
          "Lack of structured analysis from model"
        ],
        suggestions: [
          "Retry analysis or improve prompt clarity"
        ],
      });
    }

    // ✅ Clean markdown
    content = content.replace(/```json|```/g, "").trim();

    // ✅ Extract JSON safely
    const match = content.match(/\{[\s\S]*\}/);

    let parsed;

    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        parsed = null;
      }
    }

    // ✅ FINAL SAFETY (ALWAYS RETURN DATA)
    if (!parsed) {
      return Response.json({
        summary: content,
        risks: [
          "Could not structure full JSON output"
        ],
        suggestions: [
          "Improve input clarity for better structured result"
        ],
      });
    }

    return Response.json({
      summary: parsed.summary || "Summary not generated",
      risks: parsed.risks || ["No risks identified"],
      suggestions: parsed.suggestions || ["No suggestions provided"],
    });

  } catch (error) {
    console.error("FINAL GEMINI ERROR:", error);

    return Response.json({
      summary: "Error occurred while analyzing contract",
      risks: [],
      suggestions: [],
    });
  }
}

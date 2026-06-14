export async function POST(req: Request) {
  try {
    const { text, language } = await req.json();

    const prompt = `
You are a UAE legal and compliance expert.

${language === "ar" ? "Respond completely in Arabic." : "Respond in English."}

Strictly return ONLY valid JSON. Do not add explanation text.

Format:
{
  "summary": "short summary",
  "risks": ["risk 1", "risk 2"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}

Contract:
${text}
`;

    // ✅ Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    // ✅ Extract text safely
    let content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("RAW GEMINI RESPONSE:", content);

    // ✅ Remove markdown blocks if Gemini adds ```json
    content = content.replace(/```json|```/g, "").trim();

    // ✅ Try extracting JSON block
    const match = content.match(/\{[\s\S]*\}/);

    let parsed;

    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      // fallback (so UI never stays blank)
      parsed = {
        summary: content || "No summary generated",
        risks: [],
        suggestions: [],
      };
    }

    return Response.json({
      summary: parsed.summary || "No summary available",
      risks: parsed.risks || [],
      suggestions: parsed.suggestions || [],
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

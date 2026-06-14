export async function POST(req: Request) {
  try {
    const { text, language } = await req.json();

    const prompt = `
You are a UAE legal and compliance expert.

${language === "ar" ? "Respond completely in Arabic." : "Respond in English."}

Strictly return ONLY valid JSON.

Format:
{
  "summary": "short summary",
  "risks": ["risk 1", "risk 2"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}

Contract:
${text}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    console.log("FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    let content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // ✅ HANDLE EMPTY RESPONSE
    if (!content) {
      console.warn("Gemini returned empty response");

      return Response.json({
        summary:
          language === "ar"
            ? "تم تحليل العقد ولكن لم يتم توليد تفاصيل"
            : "Analysis completed but no detailed output generated",
        risks: [],
        suggestions: [],
      });
    }

    // ✅ Clean markdown
    content = content.replace(/```json|```/g, "").trim();

    // ✅ Extract JSON
    const match = content.match(/\{[\s\S]*\}/);

    let parsed;

    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      parsed = {
        summary: content,
        risks: [],
        suggestions: [],
      };
    }

    return Response.json({
      summary: parsed.summary || "No summary generated",
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

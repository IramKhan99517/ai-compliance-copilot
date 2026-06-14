export async function POST(req: Request) {
  try {
    const { text, language } = await req.json();

    // ✅ Prompt
    const prompt = `
You are a UAE legal and compliance expert.

${
  language === "ar"
    ? "Respond completely in Arabic."
    : "Respond in English."
}

Analyze this contract and respond ONLY in JSON format:

{
  "summary": "short summary",
  "risks": ["risk 1", "risk 2"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}

Contract:
${text}
    `;

    // ✅ Gemini API call
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

    // ✅ Extract response safely
    let content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // ✅ Clean markdown if Gemini returns ```json
    content = content.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      // fallback if JSON fails
      parsed = {
        summary: content,
        risks: [],
        suggestions: [],
      };
    }

    return Response.json(parsed);

  } catch (error) {
    console.error("FULL ERROR GEMINI:", error);

    return Response.json({
      summary: "Error occurred while analyzing contract",
      risks: [],
      suggestions: [],
    });
  }
}

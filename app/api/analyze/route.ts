export async function POST(req: Request) {
  try {
    const { text, language } = await req.json();

    const prompt = `
You are a UAE legal expert.

${language === "ar" ? "Respond in Arabic." : "Respond in English."}

Return JSON:
{
  "summary": "...",
  "risks": ["..."],
  "suggestions": ["..."]
}

Contract:
${text}
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    let content = data.choices?.[0]?.message?.content || "";

    content = content.replace(/```json|```/g, "").trim();

    const match = content.match(/\{[\s\S]*\}/);

    let parsed;

    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      parsed = {
        summary: content,
        risks: [],
        suggestions: []
      };
    }

    return Response.json(parsed);

  } catch (error) {
    console.error("GROQ ERROR:", error);

    return Response.json({
      summary: "Error occurred",
      risks: [],
      suggestions: [],
    });
  }
}

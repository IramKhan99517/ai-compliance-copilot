export async function POST(req: Request) {
  try {
    
// ✅ ADD THIS LINE HERE
    console.log("KEY:", process.env.GROQ_API_KEY);

    const { text, language } = await req.json();

    const prompt = `
You are a UAE legal expert.

${language === "ar" ? "Respond in Arabic." : "Respond in English."}

Analyze the contract and return JSON ONLY:

{
  "summary": "short summary",
  "risks": ["risk1", "risk2"],
  "suggestions": ["suggestion1", "suggestion2"]
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

    console.log("GROQ RAW RESPONSE:", JSON.stringify(data, null, 2));

    let content = data?.choices?.[0]?.message?.content;

    // ✅ SAFETY check
    if (!content) {
      return Response.json({
        summary: "No response generated",
        risks: [],
        suggestions: []
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

    // ✅ FINAL fallback
    if (!parsed) {
      return Response.json({
        summary: content,
        risks: [],
        suggestions: []
      });
    }

    return Response.json({
      summary: parsed.summary || "No summary",
      risks: parsed.risks || [],
      suggestions: parsed.suggestions || []
    });

  } catch (error) {
    console.error("FINAL GROQ ERROR:", error);

    return Response.json({
      summary: "Error occurred while analyzing",
      risks: [],
      suggestions: []
    });
  }
}

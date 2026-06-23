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

    let parsed;

    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        parsed = null;
      }
    }

    // ✅ Fallback response
    if (!parsed) {
      return Response.json({
        summary: content,
        risks: [],
        suggestions: [],
        riskScore: Math.floor(Math.random() * 100),
      });
    }

    // ✅ Final response
    return Response.json({
      summary: parsed.summary || "No summary",
      risks: parsed.risks || [],
      suggestions: parsed.suggestions || [],
      riskScore: Math.floor(Math.random() * 100),
    });
  } catch (error) {
    console.error("FINAL GROQ ERROR:", error);

    return Response.json({
      summary: "Error occurred while analyzing",
      risks: [],
      suggestions: [],
      riskScore: 0,
    });
  }
}

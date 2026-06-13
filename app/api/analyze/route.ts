import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, language } = await req.json();

    const prompt = `
You are a UAE legal and compliance expert.

${
  language === "ar"
    ? "Respond completely in Arabic."
    : "Respond in English."
}

Analyze this contract and respond ONLY in JSON format like:

{
  "summary": "...",
  "risks": ["..."],
  "suggestions": ["..."]
}

Contract:
${text}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a UAE legal and compliance expert",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(content || "{}");
    } catch {
      // fallback if AI doesn't return valid JSON
      parsed = {
        summary: content,
        risks: [],
        suggestions: [],
      };
    }

    return Response.json(parsed);

  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return Response.json({
      summary: "Error occurred while analyzing contract",
      risks: [],
      suggestions: [],
    });
  }
}
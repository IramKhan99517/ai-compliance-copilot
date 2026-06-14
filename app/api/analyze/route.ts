import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { text, language } = await req.json();

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY as string
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const prompt = `
You are a UAE legal expert.

${language === "ar" ? "Respond in Arabic." : "Respond in English."}

Return ONLY JSON:

{
  "summary": "short summary",
  "risks": ["risk1"],
  "suggestions": ["suggestion1"]
}

Contract:
${text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text();

    // Clean and extract JSON
    content = content.replace(/```json|```/g, "").trim();

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

    return Response.json(parsed);

  } catch (error) {
    console.error("GEMINI SDK ERROR:", error);

    return Response.json({
      summary: "Error occurred",
      risks: [],
      suggestions: [],
    });
  }
}

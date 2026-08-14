export async function POST(req: Request) {
  try {
    const { question, country, businessType } =
      await req.json();

    const prompt = `
You are LIMRA AI, a GCC business setup and compliance advisor.

Country: ${country}
Business Type: ${businessType}

Provide practical compliance guidance.

Focus on:
- Required licenses
- Required documents
- Government approvals
- Tax obligations
- Compliance requirements
- Business setup process

User Question:
${question}

Return your answer in this exact format:

✅ Overview

📜 Licenses Required

📄 Documents Required

🏛 Authorities

💰 Tax Considerations

🚀 Next Steps

Use bullet points.
Maximum 200 words.
Avoid long paragraphs.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
        }),
      }
    );

    const data = await response.json();

    const answer =
      data?.choices?.[0]?.message?.content ||
      "Unable to generate advice.";

    return Response.json({
      answer,
    });
  } catch (error) {
    console.error("Business Advisor Error:", error);

    return Response.json({
      answer:
        "Unable to generate guidance at this time.",
    });
  }
}

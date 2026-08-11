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

Return your answer in the following format only:

## Overview
Short summary (2-3 lines)

## Required Licenses
• Item 1
• Item 2

## Required Documents
• Item 1
• Item 2

## Authorities
• Item 1
• Item 2

## Tax Considerations
• Item 1
• Item 2

## Recommended Next Steps
1. Step 1
2. Step 2
3. Step 3

Keep the response concise and investor-demo friendly.
Do not write long paragraphs.
Use bullet points.
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
          model: "llama-3.1-8b-instant",
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
 

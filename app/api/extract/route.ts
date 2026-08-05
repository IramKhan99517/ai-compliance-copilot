import { NextRequest } from "next/server";
import mammoth from "mammoth";

// ✅ Fix for pdf-parse TypeScript import issues
const pdfParse = require("pdf-parse");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    let extractedText = "";

    // ✅ TXT Support
    if (extension === "txt") {
      extractedText = await file.text();
    }

    // ✅ PDF Support (includes multi-page PDFs)
    else if (extension === "pdf") {
      const buffer = Buffer.from(
        await file.arrayBuffer()
      );

      const pdfData = await pdfParse(buffer);

      extractedText = pdfData.text;
    }

    // ✅ DOCX Support
    else if (extension === "docx") {
      const buffer = Buffer.from(
        await file.arrayBuffer()
      );

      const result = await mammoth.extractRawText({
        buffer,
      });

      extractedText = result.value;
    }

    // ✅ Unsupported files
    else {
      return Response.json(
        {
          error:
            "Only TXT, PDF and DOCX files are supported.",
        },
        { status: 400 }
      );
    }

    // ✅ Empty extraction check
    if (!extractedText.trim()) {
      return Response.json(
        {
          error:
            "Unable to extract text from document.",
        },
        { status: 400 }
      );
    }

    // ✅ Large contract protection
    if (extractedText.length > 15000) {
      return Response.json(
        {
          error:
            "Document is too large. Please upload a smaller contract.",
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      text: extractedText,
    });

  } catch (error) {
    console.error("EXTRACT ERROR:", error);

    return Response.json(
      {
        error: "Failed to extract text.",
      },
      { status: 500 }
    );
  }
}
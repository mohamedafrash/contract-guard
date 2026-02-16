import { generateText, Output } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { saveAnalysisToHistory } from "@/app/lib/convexHistory";
import type { AnalysisResult } from "@/app/types";

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_GATEWAY_BASE_URL || "https://ai-gateway.vercel.sh/v1",
});

const ALLOWED_MIME_TYPES = new Set(["application/pdf"]);
const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_BYTES = 25 * 1024 * 1024;

const requestSchema = z.object({
  files: z
    .array(
      z.object({
        base64: z.string(),
        type: z.string(),
        name: z.string().optional(),
      }),
    )
    .max(MAX_FILES, `A maximum of ${MAX_FILES} files is allowed`)
    .min(1, "At least one file is required"),
});

const analysisSchema = z.object({
  summary: z.object({
    propertyAddress: z
      .string()
      .describe("Full property address found in the contract."),
    buyerName: z.string().describe("Name(s) of the buyer(s)."),
    sellerName: z.string().describe("Name(s) of the seller(s)."),
    purchasePrice: z.string().describe("Purchase price amount."),
    contractDate: z.string().describe("Effective date of the contract."),
    closingDate: z.string().describe("Scheduled closing/settlement date."),
  }),
  checklist: z.array(
    z.object({
      id: z.string(),
      ruleName: z.string(),
      description: z.string().describe("Details for the compliance rule."),
      status: z.enum(["PRESENT", "MISSING", "UNCLEAR", "NOT_APPLICABLE"]),
      notes: z
        .string()
        .describe("Explanation of findings or why item is missing/unclear."),
      pageReference: z
        .number()
        .nullable()
        .describe(
          "The page number where evidence was found, or null if not applicable.",
        ),
    }),
  ),
  missingItemsEmailDraft: z
    .string()
    .describe(
      "A professional email draft to the other agent listing all missing or unclear items requiring attention.",
    ),
});

function extractBase64Payload(value: string) {
  const payload = value.trim();
  const commaIndex = payload.indexOf(",");

  if (!payload.startsWith("data:") || commaIndex === -1) {
    return { detectedMimeType: null as string | null, base64Payload: payload };
  }

  const meta = payload.slice(5, commaIndex);
  const detectedMimeType = meta.split(";")[0] || null;
  const base64Payload = payload.slice(commaIndex + 1);

  return { detectedMimeType, base64Payload };
}

function getDecodedSizeInBytes(base64: string) {
  const normalized = base64.replace(/\s/g, "");
  const validBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(normalized);

  if (!validBase64 || normalized.length === 0 || normalized.length % 4 !== 0) {
    return null;
  }

  const padding = normalized.endsWith("==") ? 2 : normalized.endsWith("=") ? 1 : 0;
  return (normalized.length * 3) / 4 - padding;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = requestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: parseResult.error.issues[0]?.message || "Invalid request body",
        },
        { status: 400 },
      );
    }

    const { files } = parseResult.data;
    let totalSize = 0;

    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type}` },
          { status: 400 },
        );
      }

      const { detectedMimeType, base64Payload } = extractBase64Payload(file.base64);

      if (detectedMimeType && detectedMimeType !== file.type) {
        return NextResponse.json(
          { error: `File MIME type mismatch: expected ${file.type}, got ${detectedMimeType}` },
          { status: 400 },
        );
      }

      const fileSize = getDecodedSizeInBytes(base64Payload);
      if (fileSize === null) {
        return NextResponse.json(
          { error: "One or more files contain invalid base64 data" },
          { status: 400 },
        );
      }

      if (fileSize > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: `Each file must be ${MAX_FILE_BYTES / 1024 / 1024}MB or smaller` },
          { status: 413 },
        );
      }

      totalSize += fileSize;
      if (totalSize > MAX_TOTAL_BYTES) {
        return NextResponse.json(
          { error: `Total upload size must be ${MAX_TOTAL_BYTES / 1024 / 1024}MB or smaller` },
          { status: 413 },
        );
      }
    }

    const prompt = `
      You are an expert Real Estate Compliance Auditor. 
      Review the attached contract documents (PDFs) for a residential real estate transaction.
      
      Step 1: Extract the Transaction Summary (Address, Parties, Price, Dates).
      
      Step 2: Run the following Compliance Checklist. For each item, determine if it is PRESENT, MISSING, UNCLEAR, or NOT_APPLICABLE.
      
      Checklist Rules to Apply:
      1. Fully Executed Purchase Agreement: Signatures of both Buyer and Seller must be present on the final page.
      2. Earnest Money Deposit: Amount and terms must be clearly specified.
      3. Property Disclosure Statement: Must be present if the seller is not exempt.
      4. Lead-Based Paint Addendum: REQUIRED if the property was built before 1978. Check the year built context. If post-1978, mark as NOT_APPLICABLE.
      5. Financing Addendum: If the purchase is financed, this addendum must be included and signed.
      6. Legal Description: A legal description of the property (Lot/Block or similar) must be present.
      7. HOA Addendum: Required if the property is in a Home Owners Association. Look for mentions of HOA fees.
      
      Step 3: Draft a polite, professional email to the opposing agent listing ONLY the MISSING or UNCLEAR items that need to be corrected.
      
      Return the output strictly in JSON format matching the provided schema.
    `;

    const content: Array<
      | { type: "text"; text: string }
      | { type: "file"; data: string; mediaType: string }
    > = [{ type: "text", text: prompt }];

    files.forEach((file: { base64: string; type: string }) => {
      const cleanBase64 = extractBase64Payload(file.base64).base64Payload;
      content.push({
        type: "file",
        data: `data:${file.type};base64,${cleanBase64}`,
        mediaType: file.type,
      });
    });

    const result = await generateText({
      model: openai("openai/gpt-5-nano"),
      messages: [
        {
          role: "user",
          content,
        },
      ],
      output: Output.object({
        schema: analysisSchema,
      }),
    });

    if (!result.output) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 },
      );
    }

    try {
      await saveAnalysisToHistory({
        userId,
        fileNames: files.map((file) => file.name || "Uploaded document"),
        analysis: result.output as AnalysisResult,
      });
    } catch (historyError) {
      console.error("Failed to persist analysis history:", historyError);
    }

    return NextResponse.json(result.output);
  } catch (error) {
    console.error("Analysis failed:", error);
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

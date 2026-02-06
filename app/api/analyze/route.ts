import { generateText, Output } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_GATEWAY_BASE_URL || "https://ai-gateway.vercel.sh/v1",
});

const requestSchema = z.object({
  files: z
    .array(
      z.object({
        base64: z.string(),
        type: z.string(),
      }),
    )
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
      const cleanBase64 = file.base64.split(",")[1] || file.base64;
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

    return NextResponse.json(result.output);
  } catch (error) {
    console.error("Analysis failed:", error);
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

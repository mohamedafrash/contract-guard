import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const complianceStatus = v.union(
  v.literal("PRESENT"),
  v.literal("MISSING"),
  v.literal("UNCLEAR"),
  v.literal("NOT_APPLICABLE"),
);

export default defineSchema({
  analyses: defineTable({
    userId: v.string(),
    createdAt: v.number(),
    fileNames: v.array(v.string()),
    summary: v.object({
      propertyAddress: v.string(),
      buyerName: v.string(),
      sellerName: v.string(),
      purchasePrice: v.string(),
      contractDate: v.string(),
      closingDate: v.string(),
    }),
    checklist: v.array(
      v.object({
        id: v.string(),
        ruleName: v.string(),
        description: v.string(),
        status: complianceStatus,
        notes: v.string(),
        pageReference: v.union(v.number(), v.null()),
      }),
    ),
    missingItemsEmailDraft: v.string(),
  }).index("by_user_createdAt", ["userId", "createdAt"]),
});

import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

const complianceStatus = v.union(
  v.literal("PRESENT"),
  v.literal("MISSING"),
  v.literal("UNCLEAR"),
  v.literal("NOT_APPLICABLE"),
);

const analysisValidator = v.object({
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
});

export const saveForUser = internalMutation({
  args: {
    userId: v.string(),
    fileNames: v.array(v.string()),
    analysis: analysisValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyses", {
      userId: args.userId,
      createdAt: Date.now(),
      fileNames: args.fileNames,
      summary: args.analysis.summary,
      checklist: args.analysis.checklist,
      missingItemsEmailDraft: args.analysis.missingItemsEmailDraft,
    });
  },
});

export const listForUser = internalQuery({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 20, 50));

    const rows = await ctx.db
      .query("analyses")
      .withIndex("by_user_createdAt", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    return rows.map((row) => ({
      id: row._id,
      createdAt: row.createdAt,
      fileNames: row.fileNames,
      result: {
        summary: row.summary,
        checklist: row.checklist,
        missingItemsEmailDraft: row.missingItemsEmailDraft,
      },
    }));
  },
});

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { makeFunctionReference } from "convex/server";
import { AnalysisHistoryItem, AnalysisResult } from "../types";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const CONVEX_ADMIN_KEY = process.env.CONVEX_ADMIN_KEY;

function getConvexOptions() {
  if (!CONVEX_URL) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
  }
  if (!CONVEX_ADMIN_KEY) {
    throw new Error("Missing CONVEX_ADMIN_KEY");
  }

  return {
    url: CONVEX_URL,
    adminToken: CONVEX_ADMIN_KEY,
  };
}

const saveForUserRef = makeFunctionReference<
  "mutation",
  {
    userId: string;
    fileNames: string[];
    analysis: AnalysisResult;
  },
  string
>("history:saveForUser");

const listForUserRef = makeFunctionReference<
  "query",
  { userId: string; limit?: number },
  AnalysisHistoryItem[]
>("history:listForUser");

export async function saveAnalysisToHistory(args: {
  userId: string;
  fileNames: string[];
  analysis: AnalysisResult;
}) {
  return await fetchMutation(
    saveForUserRef,
    {
      userId: args.userId,
      fileNames: args.fileNames,
      analysis: args.analysis,
    },
    getConvexOptions(),
  );
}

export async function listHistoryForUser(userId: string) {
  const rows = await fetchQuery(
    listForUserRef,
    { userId, limit: 20 },
    getConvexOptions(),
  );

  return rows;
}

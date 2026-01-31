import { AnalysisResult } from "../types";

export const analyzeDocuments = async (files: { base64: string, type: string }[]): Promise<AnalysisResult> => {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ files }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze documents");
  }

  return response.json();
};

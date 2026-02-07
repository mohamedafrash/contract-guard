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
    const payload = await response
      .json()
      .catch(() => null) as { error?: string } | null;

    const apiMessage = payload?.error;
    const fallbackMessage = `Failed to analyze documents (${response.status})`;
    throw new Error(
      typeof apiMessage === "string" && apiMessage.length > 0
        ? apiMessage
        : fallbackMessage,
    );
  }

  return response.json();
};

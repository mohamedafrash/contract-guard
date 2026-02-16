import { AnalysisHistoryItem, AnalysisResult } from "../types";

export const analyzeDocuments = async (
  files: { base64: string; type: string; name?: string }[],
): Promise<AnalysisResult> => {
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

export const fetchHistory = async (): Promise<AnalysisHistoryItem[]> => {
  const response = await fetch("/api/history", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const payload = await response
      .json()
      .catch(() => null) as { error?: string } | null;
    throw new Error(payload?.error || `Failed to fetch history (${response.status})`);
  }

  const payload = await response.json() as { history: AnalysisHistoryItem[] };
  return payload.history;
};

"use client";

import { motion } from "framer-motion";
import { Clock3, FileText } from "lucide-react";
import { AnalysisHistoryItem } from "../types";

interface HistoryPanelProps {
  items: AnalysisHistoryItem[];
  isLoading: boolean;
  error: string | null;
  onOpen: (item: AnalysisHistoryItem) => void;
}

function formatDate(value: number) {
  return new Date(value).toLocaleString();
}

export default function HistoryPanel({
  items,
  isLoading,
  error,
  onOpen,
}: HistoryPanelProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Clock3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Previous Reviews</h3>
          <p className="text-sm text-muted-foreground">
            Open your recent generated analyses
          </p>
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading history...</p>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No previous analyses yet.
        </p>
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onOpen(item)}
              className="w-full text-left p-4 rounded-xl border border-border hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.result.summary.propertyAddress || "No property address"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(item.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {item.fileNames.join(", ")}
                  </p>
                </div>
                <div className="shrink-0 text-primary">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

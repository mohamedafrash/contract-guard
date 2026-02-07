"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Loader2,
  RotateCcw,
  Shield,
  CheckCircle,
} from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import FileUpload from "./components/FileUpload";
import TransactionCard from "./components/TransactionCard";
import Checklist from "./components/Checklist";
import EmailDraft from "./components/EmailDraft";
import { ThemeToggle } from "./components/ThemeToggle";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverScale,
} from "./components/animations";
import { UploadedFile, AnalysisResult } from "./types";
import { analyzeDocuments } from "./services/analysisService";

export default function Home() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (newFiles: UploadedFile[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    if (result) {
      setResult(null);
    }
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (result) setResult(null);
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const payload = files.map((f) => ({ base64: f.base64, type: f.type }));
      const analysisData = await analyzeDocuments(payload);
      setResult(analysisData);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze documents. Please try again.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetApp = () => {
    setFiles([]);
    setResult(null);
    setError(null);
  };

  const passedCount =
    result?.checklist.filter((i) => i.status === "PRESENT").length ?? 0;
  const totalCount =
    result?.checklist.filter((i) => i.status !== "NOT_APPLICABLE").length ?? 0;
  const scorePercent =
    totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <FadeIn direction="left" duration={0.4}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Contract Guard
              </h1>
            </div>
          </FadeIn>

          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <HoverScale>
                    <button
                      onClick={resetApp}
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
                    >
                      <RotateCcw className="w-4 h-4" />
                      New Review
                    </button>
                  </HoverScale>
                </motion.div>
              )}
            </AnimatePresence>
            <ThemeToggle />
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                    userButtonPopoverCard:
                      "bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-lg",
                    userButtonPopoverActionButton:
                      "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]",
                    userButtonPopoverActionButtonText:
                      "text-[hsl(var(--foreground))]",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <FadeIn delay={0.1}>
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                    <CheckCircle className="w-4 h-4" />
                    AI-Powered Compliance
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
                    Automated Contract
                    <span className="text-primary"> Compliance</span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Upload your executed real estate contracts. We&apos;ll
                    extract data, verify compliance rules, and draft deficiency
                    emails instantly.
                  </p>
                </div>
              </FadeIn>

              {/* File Upload */}
              <StaggerContainer staggerDelay={0.15}>
                <StaggerItem>
                  <FileUpload
                    onFilesSelected={handleFilesSelected}
                    files={files}
                    onRemoveFile={handleRemoveFile}
                    isProcessing={isAnalyzing}
                  />
                </StaggerItem>

                {/* Analyze Button */}
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-center mt-8"
                    >
                      <HoverScale scale={0.95}>
                        <motion.button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="group relative flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-bold text-lg shadow-2xl shadow-primary/30 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden bg-linear-to-r from-blue-600 via-blue-500 to-blue-600 dark:from-blue-500 dark:via-indigo-500 dark:to-blue-600 hover:shadow-blue-500/40 dark:hover:shadow-indigo-500/40"
                        >
                          {/* Animated gradient background */}
                          <div className="absolute inset-0 bg-linear-to-r from-blue-700 via-blue-600 to-blue-500 dark:from-indigo-600 dark:via-blue-500 dark:to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                          {/* Glow effect */}
                          <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500 group-hover:duration-200" />

                          {/* Button content */}
                          <span className="relative flex items-center gap-3">
                            {isAnalyzing ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                >
                                  <Loader2 className="w-6 h-6" />
                                </motion.div>
                                <span>Analyzing Documents...</span>
                              </>
                            ) : (
                              <>
                                <motion.div
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 10,
                                  }}
                                >
                                  <FileText className="w-6 h-6" />
                                </motion.div>
                                <span>Run Compliance Check</span>
                              </>
                            )}
                          </span>

                          {/* Corner accents */}
                          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
                        </motion.button>
                      </HoverScale>
                    </motion.div>
                  )}
                </AnimatePresence>
              </StaggerContainer>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="max-w-3xl mx-auto p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
            >
              {/* Left Column - Transaction Summary */}
              <div className="lg:col-span-4 space-y-6">
                <FadeIn delay={0.1} direction="right">
                  <TransactionCard summary={result.summary} />
                </FadeIn>

                <FadeIn delay={0.2} direction="right">
                  <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                      Reviewed Documents
                    </h3>
                    <ul className="space-y-3">
                      {files.map((f, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="flex items-center text-sm text-foreground"
                        >
                          <FileText className="w-4 h-4 mr-3 text-primary shrink-0" />
                          <span className="truncate">{f.name}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>

                {/* Status Summary */}
                <FadeIn delay={0.3} direction="right">
                  <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Compliance Score
                      </h3>
                      <span className="text-2xl font-bold text-primary">
                        {totalCount > 0 ? `${scorePercent}%` : "N/A"}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
                      <motion.div
                        className="bg-primary h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${scorePercent}%`,
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {totalCount > 0
                        ? `${passedCount} of ${totalCount} requirements passed`
                        : "No applicable requirements"}
                    </p>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column - Checklist & Email */}
              <div className="lg:col-span-8 space-y-6">
                <FadeIn delay={0.2}>
                  <Checklist analysis={result} />
                </FadeIn>

                <AnimatePresence>
                  {result.checklist.some(
                    (i) => i.status === "MISSING" || i.status === "UNCLEAR",
                  ) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: 0.4 }}
                    >
                      <EmailDraft emailBody={result.missingItemsEmailDraft} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto bg-card">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground"
          >
            Disclaimer: This tool assists with document review but does not
            constitute legal advice.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}

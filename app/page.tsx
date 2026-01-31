'use client';

import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import TransactionCard from './components/TransactionCard';
import Checklist from './components/Checklist';
import EmailDraft from './components/EmailDraft';
import { UploadedFile, AnalysisResult } from './types';
import { analyzeDocuments } from './services/analysisService';
import Image from 'next/image';

export default function Home() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (newFiles: UploadedFile[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    if (result) {
      setResult(null);
    }
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (result) setResult(null);
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const payload = files.map(f => ({ base64: f.base64, type: f.type }));
      const analysisData = await analyzeDocuments(payload);
      setResult(analysisData);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze documents. Please check your API key and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetApp = () => {
    setFiles([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Image src="/logo.png" alt="Logo" width={24} height={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Contract Guard</h1>
          </div>
          <div>
            {result && (
              <button 
                onClick={resetApp}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Start New Review
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {!result && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Automated Contract Compliance</h2>
              <p className="mt-4 text-lg text-gray-600">
                Upload your executed real estate contracts (PDF). We&apos;ll extract the data, verify specific compliance rules, and draft your deficiency email instantly.
              </p>
            </div>

            <FileUpload 
              onFilesSelected={handleFilesSelected} 
              files={files} 
              onRemoveFile={handleRemoveFile}
              isProcessing={isAnalyzing}
            />

            {files.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full text-white font-medium text-lg shadow-lg transition-all transform hover:scale-105 ${
                    isAnalyzing 
                      ? 'bg-blue-400 cursor-wait' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Documents...
                    </>
                  ) : (
                    'Run Compliance Check'
                  )}
                </button>
              </div>
            )}
             {error && (
              <div className="max-w-3xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-center">
                {error}
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <TransactionCard summary={result.summary} />
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Reviewed Documents</h3>
                <ul className="space-y-2">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                      <span className="truncate">{f.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2">
              <Checklist analysis={result} />
              
              {result.checklist.some(i => i.status === 'MISSING' || i.status === 'UNCLEAR') && (
                 <EmailDraft emailBody={result.missingItemsEmailDraft} />
              )}
            </div>
          </div>
        )}

      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
           <p className="text-center text-xs text-gray-400">
             Disclaimer: This tool assists with document review but does not constitute legal advice. Verify all findings manually.
           </p>
        </div>
      </footer>
    </div>
  );
}

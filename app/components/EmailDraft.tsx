'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Mail, FileText } from 'lucide-react';

interface EmailDraftProps {
  emailBody: string;
}

export default function EmailDraft({ emailBody }: EmailDraftProps) {
  const [copied, setCopied] = useState(false);
  const normalizedEmailBody = emailBody.replace(/\\n/g, "\n");

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }
      await navigator.clipboard.writeText(normalizedEmailBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard. Please select and copy manually.');
    }
  };

  if (!emailBody) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-2xl shadow-sm border border-border p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Agent Email Draft</h3>
            <p className="text-sm text-muted-foreground">Ready to send to agent</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            copied 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy to Clipboard</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      
      {/* Email Content */}
      <div className="relative">
        <div className="absolute top-3 left-3">
          <FileText className="w-4 h-4 text-muted-foreground/50" />
        </div>
        <div className="bg-muted/50 border border-border rounded-xl p-4 pl-10 max-h-[400px] overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
            {normalizedEmailBody}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileCheck, AlertCircle } from 'lucide-react';
import { UploadedFile } from '../types';

interface FileUploadProps {
  onFilesSelected: (files: UploadedFile[]) => void;
  files: UploadedFile[];
  onRemoveFile: (index: number) => void;
  isProcessing: boolean;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function FileUpload({ onFilesSelected, files, onRemoveFile, isProcessing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = useCallback(async (fileList: File[]) => {
    setError(null);
    const newFiles: UploadedFile[] = [];
    
    for (const file of fileList) {
      if (file.type !== 'application/pdf') {
        setError(`"${file.name}" is not a PDF file. Only PDFs are supported.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`);
        continue;
      }

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
          reader.readAsDataURL(file);
        });

        newFiles.push({
          name: file.name,
          type: file.type,
          size: file.size,
          base64: base64,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to read file');
      }
    }
    
    if (newFiles.length > 0) {
      onFilesSelected(newFiles);
    }
  }, [onFilesSelected]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      await processFiles(Array.from(event.target.files));
    }
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsDragging(true);
    }
  }, [isProcessing]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isProcessing) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  }, [isProcessing, processFiles]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
            Upload Contract Package
          </h2>
          <p className="text-muted-foreground">
            Upload the executed purchase agreement and all associated addenda.
          </p>
        </div>
        
        <motion.label 
          className={`relative flex flex-col items-center justify-center w-full h-56 sm:h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${
            isProcessing 
              ? 'bg-muted/50 border-muted cursor-not-allowed' 
              : isDragging
                ? 'bg-primary/5 border-primary scale-[1.02] shadow-lg shadow-primary/10'
                : 'border-border hover:bg-muted/50 hover:border-muted-foreground/30'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={!isProcessing && !isDragging ? { scale: 1.01 } : {}}
          whileTap={!isProcessing && !isDragging ? { scale: 0.99 } : {}}
        >
          <input 
            type="file" 
            className="hidden" 
            multiple 
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
          
          <AnimatePresence mode="wait">
            {isDragging ? (
              <motion.div
                key="dragging"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-semibold text-primary">Drop files here</p>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center px-4"
              >
                <motion.div 
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Upload className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="mb-2 text-sm text-center">
                  <span className="font-semibold text-foreground">Click to upload</span>
                  <span className="text-muted-foreground"> or drag and drop</span>
                </p>
                <p className="text-xs text-muted-foreground">PDF documents only (max {MAX_FILE_SIZE_MB}MB)</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.label>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Selected Documents 
                  <span className="ml-2 text-xs font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    {files.length}
                  </span>
                </h3>
              </div>
              
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${file.size}`}
                      layout
                      initial={{ opacity: 0, x: -20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 sm:p-4 bg-primary/5 border border-primary/10 rounded-xl group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      
                      {!isProcessing && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onRemoveFile(index)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

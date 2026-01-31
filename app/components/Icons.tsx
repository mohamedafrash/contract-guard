import React from 'react';
import { 
  Upload, 
  Check, 
  X, 
  HelpCircle, 
  MinusCircle, 
  FileText 
} from 'lucide-react';

// Re-export Lucide icons for backwards compatibility
export const UploadIcon = () => <Upload className="w-12 h-12 text-muted-foreground" />;
export const CheckIcon = () => <Check className="w-5 h-5 text-green-600 dark:text-green-400" />;
export const XIcon = () => <X className="w-5 h-5 text-red-600 dark:text-red-400" />;
export const QuestionIcon = () => <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
export const MinusCircleIcon = () => <MinusCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
export const FileIcon = () => <FileText className="w-8 h-8 text-primary" />;

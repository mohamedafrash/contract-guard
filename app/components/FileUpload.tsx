import React, { useCallback } from 'react';
import { UploadIcon, FileIcon } from './Icons';
import { UploadedFile } from '../types';

interface FileUploadProps {
  onFilesSelected: (files: UploadedFile[]) => void;
  files: UploadedFile[];
  onRemoveFile: (index: number) => void;
  isProcessing: boolean;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, files, onRemoveFile, isProcessing }) => {
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles: UploadedFile[] = [];
      
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        if (file.type !== 'application/pdf') {
          alert('Only PDF files are supported.');
          continue;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
          alert(`File "${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`);
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
        } catch (error) {
          alert(error instanceof Error ? error.message : 'Failed to read file');
        }
      }
      onFilesSelected(newFiles);
    }
  }, [onFilesSelected]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Contract Package</h2>
        <p className="text-gray-500 mb-6">Upload the executed purchase agreement and all associated addenda.</p>
        
        <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isProcessing ? 'bg-gray-50 border-gray-300 cursor-not-allowed' : 'border-gray-300 hover:bg-gray-50 bg-gray-50'}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">PDF documents only</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              multiple 
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
        </label>

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Documents ({files.length})</h3>
            <div className="grid grid-cols-1 gap-3">
              {files.map((file, index) => (
                <div key={`${file.name}-${file.size}`} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileIcon />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {!isProcessing && (
                    <button 
                      onClick={() => onRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

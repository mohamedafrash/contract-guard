import React, { useState } from 'react';

interface EmailDraftProps {
  emailBody: string;
}

const EmailDraft: React.FC<EmailDraftProps> = ({ emailBody }) => {
  const [copied, setCopied] = useState(false);
  const normalizedEmailBody = emailBody.replace(/\\n/g, "\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(normalizedEmailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!emailBody) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Agent Email Draft</h3>
        <button
          onClick={handleCopy}
          className={`text-sm font-medium px-4 py-2 rounded-md transition-colors ${
            copied 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
          {normalizedEmailBody}
        </pre>
      </div>
    </div>
  );
};

export default EmailDraft;

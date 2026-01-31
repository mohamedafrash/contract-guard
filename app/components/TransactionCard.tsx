import React from 'react';
import { TransactionSummary } from '../types';

interface TransactionCardProps {
  summary: TransactionSummary;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ summary }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Transaction Summary</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Property Address</label>
          <p className="text-base font-medium text-gray-900 mt-1">{summary.propertyAddress || 'N/A'}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Buyer</label>
            <p className="text-sm font-medium text-gray-900 mt-1">{summary.buyerName || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Seller</label>
            <p className="text-sm font-medium text-gray-900 mt-1">{summary.sellerName || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</label>
             <p className="text-sm font-medium text-green-700 mt-1">{summary.purchasePrice || 'N/A'}</p>
          </div>
           {/* Placeholder for a status badge if needed */}
        </div>

        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
          <div>
            <label className="text-xs font-semibold text-gray-500">Contract Date</label>
            <p className="text-sm text-gray-900">{summary.contractDate || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Closing Date</label>
            <p className="text-sm text-gray-900">{summary.closingDate || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;

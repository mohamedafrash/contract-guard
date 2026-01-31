import React from 'react';
import { AnalysisResult, ComplianceStatus } from '../types';
import { CheckIcon, XIcon, QuestionIcon, MinusCircleIcon } from './Icons';

interface ChecklistProps {
  analysis: AnalysisResult;
}

const Checklist: React.FC<ChecklistProps> = ({ analysis }) => {
  
  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.PRESENT: return <CheckIcon />;
      case ComplianceStatus.MISSING: return <XIcon />;
      case ComplianceStatus.UNCLEAR: return <QuestionIcon />;
      case ComplianceStatus.NOT_APPLICABLE: return <MinusCircleIcon />;
      default: return <QuestionIcon />;
    }
  };

  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.PRESENT: return 'bg-green-50 border-green-200';
      case ComplianceStatus.MISSING: return 'bg-red-50 border-red-200';
      case ComplianceStatus.UNCLEAR: return 'bg-yellow-50 border-yellow-200';
      case ComplianceStatus.NOT_APPLICABLE: return 'bg-gray-50 border-gray-200 opacity-60';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // Sort: Missing first, then Unclear, then Present, then N/A
  const sortedChecklist = [...analysis.checklist].sort((a, b) => {
    const order = { 
      [ComplianceStatus.MISSING]: 1, 
      [ComplianceStatus.UNCLEAR]: 2, 
      [ComplianceStatus.PRESENT]: 3, 
      [ComplianceStatus.NOT_APPLICABLE]: 4 
    };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
       <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Compliance Checklist</h3>
        <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
            {analysis.checklist.filter(i => i.status === ComplianceStatus.PRESENT).length} / {analysis.checklist.filter(i => i.status !== ComplianceStatus.NOT_APPLICABLE).length} Passed
        </span>
      </div>
      
      <div className="divide-y divide-gray-100">
        {sortedChecklist.map((item) => (
          <div key={item.id} className={`p-4 transition-colors hover:bg-gray-50`}>
            <div className="flex items-start gap-4">
              <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full border ${getStatusColor(item.status)}`}>
                {getStatusIcon(item.status)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold text-gray-900">{item.ruleName}</h4>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      item.status === ComplianceStatus.MISSING ? 'bg-red-100 text-red-800' :
                      item.status === ComplianceStatus.UNCLEAR ? 'bg-yellow-100 text-yellow-800' :
                      item.status === ComplianceStatus.PRESENT ? 'bg-green-100 text-green-800' :
                      'bg-gray-200 text-gray-600'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                
                {/* Notes & Reasoning */}
                <div className="mt-2 bg-gray-50 p-2 rounded text-xs text-gray-700 border border-gray-100">
                  <span className="font-semibold text-gray-500">Analysis: </span>
                  {item.notes}
                </div>

                {item.pageReference !== null && (
                  <div className="mt-1 flex items-center">
                    <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded cursor-help" title="Page reference found by AI">
                        Page ref: {item.pageReference}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checklist;

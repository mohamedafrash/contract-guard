'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  MinusCircle, 
  ChevronDown, 
  FileText,
  Filter,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { AnalysisResult, ComplianceStatus } from '../types';
import { StaggerContainer, StaggerItem } from './animations';

interface ChecklistProps {
  analysis: AnalysisResult;
}

type FilterType = 'ALL' | 'MISSING' | 'UNCLEAR' | 'PRESENT';

const StatusConfig = {
  [ComplianceStatus.PRESENT]: {
    icon: CheckCircle2,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-800',
    badgeColor: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
    label: 'Present',
  },
  [ComplianceStatus.MISSING]: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-200 dark:border-red-800',
    badgeColor: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
    label: 'Missing',
  },
  [ComplianceStatus.UNCLEAR]: {
    icon: HelpCircle,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    badgeColor: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300',
    label: 'Unclear',
  },
  [ComplianceStatus.NOT_APPLICABLE]: {
    icon: MinusCircle,
    color: 'text-gray-500 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-900/30',
    borderColor: 'border-gray-200 dark:border-gray-700',
    badgeColor: 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400',
    label: 'N/A',
  },
};

export default function Checklist({ analysis }: ChecklistProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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

  const filteredChecklist = activeFilter === 'ALL' 
    ? sortedChecklist 
    : sortedChecklist.filter(item => item.status === activeFilter);

  const passedCount = analysis.checklist.filter(
    i => i.status === ComplianceStatus.PRESENT
  ).length;
  const applicableCount = analysis.checklist.filter(
    i => i.status !== ComplianceStatus.NOT_APPLICABLE
  ).length;

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'ALL', label: 'All', count: analysis.checklist.length },
    { key: 'MISSING', label: 'Missing', count: analysis.checklist.filter(i => i.status === 'MISSING').length },
    { key: 'UNCLEAR', label: 'Unclear', count: analysis.checklist.filter(i => i.status === 'UNCLEAR').length },
    { key: 'PRESENT', label: 'Present', count: analysis.checklist.filter(i => i.status === 'PRESENT').length },
  ];

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Compliance Checklist</h3>
              <p className="text-sm text-muted-foreground">
                {passedCount} of {applicableCount} requirements passed
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground mr-2">Filter:</span>
            <div className="flex gap-1">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeFilter === filter.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {filter.label}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeFilter === filter.key
                      ? 'bg-primary-foreground/20'
                      : 'bg-background'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Checklist Items */}
      <div className="divide-y divide-border">
        <StaggerContainer staggerDelay={0.05}>
          <AnimatePresence mode="popLayout">
            {filteredChecklist.map((item) => {
              const config = StatusConfig[item.status];
              const Icon = config.icon;
              const isExpanded = expandedItems.has(item.id);

              return (
                <StaggerItem key={item.id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`transition-colors hover:bg-muted/50 ${
                      item.status === ComplianceStatus.NOT_APPLICABLE ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border-2 ${config.bgColor} ${config.borderColor}`}
                        >
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </motion.div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Title Row */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-foreground leading-tight">
                                {item.ruleName}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${config.badgeColor}`}>
                                {config.label}
                              </span>
                              
                              {item.notes && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => toggleExpand(item.id)}
                                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                  aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                                >
                                  <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                  </motion.div>
                                </motion.button>
                              )}
                            </div>
                          </div>
                          
                          {/* Expandable Analysis Section */}
                          <AnimatePresence>
                            {isExpanded && item.notes && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                                  <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      <span className="font-medium text-foreground">Analysis: </span>
                                      {item.notes}
                                    </p>
                                  </div>
                                  
                                  {item.pageReference !== null && (
                                    <div className="mt-2 flex items-center gap-2 text-xs">
                                      <FileText className="w-3 h-3 text-primary" />
                                      <span className="text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                                        Page {item.pageReference}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          {/* Collapsed Page Reference */}
                          {!isExpanded && item.pageReference !== null && (
                            <div className="mt-2 flex items-center gap-2 text-xs">
                              <FileText className="w-3 h-3 text-primary" />
                              <span className="text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                                Page {item.pageReference}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </AnimatePresence>
        </StaggerContainer>
        
        {filteredChecklist.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center"
          >
            <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No items match the selected filter</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

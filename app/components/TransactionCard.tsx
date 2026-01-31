'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, User, DollarSign, Calendar, Home } from 'lucide-react';
import { TransactionSummary } from '../types';

interface TransactionCardProps {
  summary: TransactionSummary;
}

const InfoItem = ({ 
  icon: Icon, 
  label, 
  value, 
  className = '',
  delay = 0 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | null; 
  className?: string;
  delay?: number;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={`group ${className}`}
  >
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
    </div>
    <p className={`text-sm font-medium text-foreground ${!value ? 'text-muted-foreground italic' : ''}`}>
      {value || 'Not specified'}
    </p>
  </motion.div>
);

export default function TransactionCard({ summary }: TransactionCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
      className="bg-card rounded-2xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Home className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Transaction Summary</h3>
      </div>
      
      <div className="space-y-5">
        {/* Property Address */}
        <InfoItem
          icon={MapPin}
          label="Property Address"
          value={summary.propertyAddress}
          delay={0.1}
          className="pb-4 border-b border-border"
        />
        
        {/* Buyer & Seller */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem
            icon={User}
            label="Buyer"
            value={summary.buyerName}
            delay={0.2}
          />
          <InfoItem
            icon={User}
            label="Seller"
            value={summary.sellerName}
            delay={0.25}
          />
        </div>

        {/* Price */}
        <InfoItem
          icon={DollarSign}
          label="Purchase Price"
          value={summary.purchasePrice}
          delay={0.3}
          className="pb-4 border-b border-border"
        />

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-xl">
          <InfoItem
            icon={Calendar}
            label="Contract Date"
            value={summary.contractDate}
            delay={0.35}
          />
          <InfoItem
            icon={Calendar}
            label="Closing Date"
            value={summary.closingDate}
            delay={0.4}
          />
        </div>
      </div>
    </motion.div>
  );
}

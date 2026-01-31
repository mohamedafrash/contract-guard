export interface TransactionSummary {
  propertyAddress: string;
  buyerName: string;
  sellerName: string;
  purchasePrice: string;
  contractDate: string;
  closingDate: string;
}

export enum ComplianceStatus {
  PRESENT = 'PRESENT',
  MISSING = 'MISSING',
  UNCLEAR = 'UNCLEAR',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

export interface ChecklistItem {
  id: string;
  ruleName: string;
  description: string;
  status: ComplianceStatus;
  notes: string;
  pageReference: number | null;
}

export interface AnalysisResult {
  summary: TransactionSummary;
  checklist: ChecklistItem[];
  missingItemsEmailDraft: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  base64: string;
}

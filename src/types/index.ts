export interface Deal {
  id: string;
  companyName: string;
  businessTurnover: number;
  fundingType: string;
  purpose: string;
  loanAmount: number;
  notes: string;
  createdAt: Date;
}

export interface Company {
  company_number: string;
  company_name: string;
  registered_office_address?: {
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    postal_code?: string;
    country?: string;
  };
  company_status?: string;
  type?: string;
  date_of_creation?: string;
}

export interface CompaniesHouseResponse {
  items: Company[];
  total_count: number;
  items_per_page: number;
  start_index: number;
}

export type PurposeType = 
  | "Cash Flow Boost"
  | "New Equipment"
  | "Expansion"
  | "Refinance"
  | "Other";

export interface DealFormData {
  companyName: string;
  businessTurnover: string;
  fundingType: string;
  purpose: PurposeType;
  loanAmount: string;
  notes: string;
} 
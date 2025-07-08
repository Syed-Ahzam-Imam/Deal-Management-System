import React, { useState } from 'react';
import { Deal, DealFormData, PurposeType, Company } from '../types';
import { CompanySearchInput } from './CompanySearchInput';
import { storageUtils } from '../utils/storage';

interface NewDealFormProps {
  onSubmit?: (deal: Deal) => void;
  onCancel?: () => void;
}

const PURPOSE_OPTIONS: PurposeType[] = [
  "Cash Flow Boost",
  "New Equipment", 
  "Expansion",
  "Refinance",
  "Other"
];

const initialFormData: DealFormData = {
  companyName: '',
  businessTurnover: '',
  fundingType: 'Loans',
  purpose: 'Cash Flow Boost',
  loanAmount: '',
  notes: ''
};

export const NewDealForm: React.FC<NewDealFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<DealFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<DealFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<DealFormData> = {};
    const turnover = parseFloat(formData.businessTurnover);
    const loanAmount = parseFloat(formData.loanAmount);

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (isNaN(turnover) || turnover <= 0) {
      newErrors.businessTurnover = 'Business turnover must be greater than 0';
    }

    if (isNaN(loanAmount) || loanAmount <= 0) {
      newErrors.loanAmount = 'Loan amount must be greater than 0';
    }

    if (!isNaN(turnover) && !isNaN(loanAmount) && loanAmount > turnover * 10) {
      newErrors.loanAmount = 'Loan amount cannot exceed 10x business turnover';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newDeal: Deal = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        companyName: formData.companyName,
        businessTurnover: parseFloat(formData.businessTurnover),
        fundingType: formData.fundingType,
        purpose: formData.purpose,
        loanAmount: parseFloat(formData.loanAmount),
        notes: formData.notes,
        createdAt: new Date()
      };

      storageUtils.saveDeal(newDeal);
      onSubmit?.(newDeal);
      
      // Reset form
      setFormData(initialFormData);
      setSelectedCompany(null);
      setErrors({});
    } catch (error) {
      console.error('Error saving deal:', error);
      alert('Failed to save deal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof DealFormData, value: string | number) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'businessTurnover' || field === 'loanAmount' ? Number(value) : String(value) 
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setFormData(prev => ({ ...prev, companyName: company.company_name }));
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(value);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">New Deal Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <CompanySearchInput
            value={formData.companyName}
            onChange={(value) => handleInputChange('companyName', value)}
            onCompanySelect={handleCompanySelect}
            placeholder="Search for a registered company..."
            required
            className={errors.companyName ? 'border-red-500' : ''}
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
          )}
          {selectedCompany && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                ✓ Verified: {selectedCompany.company_name} ({selectedCompany.company_number})
              </p>
            </div>
          )}
        </div>

        {/* Business Turnover */}
        <div>
          <label htmlFor="businessTurnover" className="block text-sm font-medium text-gray-700 mb-2">
            Business Turnover (£) *
          </label>
          <input
            type="number"
            id="businessTurnover"
            value={formData.businessTurnover || ''}
            onChange={(e) => handleInputChange('businessTurnover', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.businessTurnover ? 'border-red-500' : ''
            }`}
            placeholder="Enter annual turnover"
            min="0"
            step="0.01"
            required
          />
          {parseFloat(formData.businessTurnover) > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {formatCurrency(parseFloat(formData.businessTurnover))}
            </p>
          )}
          {errors.businessTurnover && (
            <p className="mt-1 text-sm text-red-600">{errors.businessTurnover}</p>
          )}
        </div>

        {/* Funding Type */}
        <div>
          <label htmlFor="fundingType" className="block text-sm font-medium text-gray-700 mb-2">
            Funding Type
          </label>
          <input
            type="text"
            id="fundingType"
            value={formData.fundingType}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
            disabled
          />
          <p className="mt-1 text-sm text-gray-500">Currently fixed to Loans</p>
        </div>

        {/* Purpose */}
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
            Purpose *
          </label>
          <select
            id="purpose"
            value={formData.purpose}
            onChange={(e) => handleInputChange('purpose', e.target.value as PurposeType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {PURPOSE_OPTIONS.map((purpose) => (
              <option key={purpose} value={purpose}>
                {purpose}
              </option>
            ))}
          </select>
        </div>

        {/* Loan Amount */}
        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount (£) *
          </label>
          <input
            type="number"
            id="loanAmount"
            value={formData.loanAmount || ''}
            onChange={(e) => handleInputChange('loanAmount', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.loanAmount ? 'border-red-500' : ''
            }`}
            placeholder="Enter loan amount"
            min="0"
            step="0.01"
            required
          />
          {parseFloat(formData.loanAmount) > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {formatCurrency(parseFloat(formData.loanAmount))}
            </p>
          )}
          {errors.loanAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.loanAmount}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Additional notes about the deal..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Submit Deal'}
          </button>
        </div>
      </form>
    </div>
  );
}; 
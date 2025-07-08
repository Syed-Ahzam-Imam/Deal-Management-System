import React, { useState } from 'react';
import { NewDealForm } from '../components/NewDealForm';
import { Deal } from '../types';
import { ArrowLeftIcon, CheckCircleIcon, BuildingOffice2Icon, CurrencyPoundIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

interface NewDealPageProps {
  onDealCreated?: (deal: Deal) => void;
  onNavigateToDeals?: () => void;
}

export const NewDealPage: React.FC<NewDealPageProps> = ({ 
  onDealCreated, 
  onNavigateToDeals 
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDealSubmitted = (deal: Deal) => {
    onDealCreated?.(deal);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onNavigateToDeals?.();
    }, 1800);
  };

  const handleCancel = () => {
    onNavigateToDeals?.();
  };

  return (
    <div className="min-h-screen bg-white py-8 relative">
      {/* Back to Deals Button */}
      {onNavigateToDeals && (
        <button
          onClick={onNavigateToDeals}
          className="absolute left-4 top-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow hover:bg-gray-100 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 z-20 border border-gray-200"
        >
          <ArrowLeftIcon className="h-5 w-5 text-black" />
          Back to Deals
        </button>
      )}

      {/* Stepper/Progress Indicator */}
      <div className="max-w-2xl mx-auto mb-8 pt-8">
        <ol className="flex items-center w-full text-sm font-medium text-black space-x-2">
          <li className="flex items-center gap-2">
            <BuildingOffice2Icon className="h-5 w-5 text-black" />
            Company
            <span className="mx-2 text-gray-300">→</span>
          </li>
          <li className="flex items-center gap-2">
            <CurrencyPoundIcon className="h-5 w-5 text-black" />
            Finance
            <span className="mx-2 text-gray-300">→</span>
          </li>
          <li className="flex items-center gap-2">
            <ClipboardDocumentListIcon className="h-5 w-5 text-black" />
            Details
          </li>
        </ol>
      </div>

      {/* Card Layout for Form */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-2xl animate-fade-in border border-gray-200">
        <h2 className="text-2xl font-extrabold text-black mb-6 flex items-center gap-2">
          <CheckCircleIcon className="h-7 w-7 text-black" />
          New Deal Form
        </h2>
        <p className="mb-6 text-gray-700 text-sm">
          Use the form below to create a new deal. Company name is validated in real-time using the Companies House API.
        </p>
        <NewDealForm 
          onSubmit={handleDealSubmitted}
          onCancel={handleCancel}
        />
      </div>

      {/* Info Section */}
      <div className="max-w-2xl mx-auto mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow animate-fade-in">
        <h3 className="text-lg font-medium text-black mb-2">About Company Validation</h3>
        <p className="text-gray-800 text-sm">
          This form uses the Companies House API to validate and pre-fill company information. As you type in the company name field, it will search for registered companies and allow you to select the correct one. This ensures data accuracy and compliance.
        </p>
        <div className="mt-3 text-xs text-gray-700">
          <p><strong>Note:</strong> If you don't have a Companies House API key, the form will use mock data for demonstration purposes.</p>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-black text-white shadow-lg">
            <CheckCircleIcon className="h-6 w-6 text-white animate-bounce" />
            <span className="font-semibold">Deal created successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}; 
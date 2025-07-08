import React, { useState, useEffect } from 'react';
import { DealsTable } from '../components/DealsTable';
import { Deal } from '../types';
import { storageUtils } from '../utils/storage';
import { ArrowRightCircleIcon, PlusCircleIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

interface DealsPageProps {
  onNavigateToNewDeal?: () => void;
}

export const DealsPage: React.FC<DealsPageProps> = ({ onNavigateToNewDeal }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    loadDeals();
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadDeals = () => {
    try {
      const loadedDeals = storageUtils.getDeals();
      setDeals(loadedDeals);
    } catch (error) {
      console.error('Error loading deals:', error);
      alert('Failed to load deals. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleDealDelete = (dealId: string) => {
    try {
      storageUtils.deleteDeal(dealId);
      setDeals(prevDeals => prevDeals.filter(deal => deal.id !== dealId));
      alert('Deal deleted successfully!');
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Failed to delete deal. Please try again.');
    }
  };

  const handleClearAllDeals = () => {
    if (window.confirm('Are you sure you want to delete ALL deals? This action cannot be undone.')) {
      try {
        storageUtils.clearDeals();
        setDeals([]);
        alert('All deals have been cleared.');
      } catch (error) {
        console.error('Error clearing deals:', error);
        alert('Failed to clear deals. Please try again.');
      }
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(value);
  };

  const totalDeals = deals.length;
  const totalLoanAmount = deals.reduce((sum, deal) => sum + deal.loanAmount, 0);
  const totalTurnover = deals.reduce((sum, deal) => sum + deal.businessTurnover, 0);
  const averageLoanAmount = totalDeals > 0 ? totalLoanAmount / totalDeals : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight flex items-center gap-2">
              <ArrowRightCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-black" />
              Deals Management
            </h1>
            <p className="mt-1 text-gray-600 text-xs sm:text-sm">View and manage all your deals. Search, sort, and delete deals as needed.</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            {onNavigateToNewDeal && (
              <button
                onClick={onNavigateToNewDeal}
                className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-4 sm:px-5 py-2 rounded-lg bg-black text-white font-semibold shadow hover:scale-105 hover:bg-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
              >
                <PlusCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                Create New Deal
              </button>
            )}
            {deals.length > 0 && (
              <button
                onClick={handleClearAllDeals}
                className="w-full sm:w-auto px-4 py-2 border border-gray-400 rounded-md shadow-sm text-xs sm:text-sm font-medium text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 mt-6 sm:mt-8">
        {/* Summary Cards */}
        {deals.length > 0 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <SummaryCard icon="📄" label="Total Deals" value={totalDeals} />
            <SummaryCard icon="£" label="Total Loan Amount" value={formatCurrency(totalLoanAmount)} />
            <SummaryCard icon="Σ" label="Total Turnover" value={formatCurrency(totalTurnover)} />
            <SummaryCard icon="Ø" label="Average Loan" value={formatCurrency(averageLoanAmount)} />
          </div>
        )}

        {/* Deals Table */}
        <DealsTable 
          deals={deals} 
          onDealDelete={handleDealDelete}
        />

        {/* Empty State */}
        {deals.length === 0 && (
          <div className="text-center py-16 sm:py-20 animate-fade-in">
            <h3 className="mt-2 text-lg sm:text-xl font-semibold text-black">No deals yet</h3>
            <p className="mt-1 text-sm sm:text-md text-gray-700">Get started by creating a new deal.</p>
            {onNavigateToNewDeal && (
              <div className="mt-6">
                <button
                  onClick={onNavigateToNewDeal}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg bg-black text-white font-semibold shadow hover:scale-105 hover:bg-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                >
                  <PlusCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  Create New Deal
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 p-3 rounded-full bg-black text-white shadow-lg hover:bg-gray-900 transition-all animate-bounce"
          aria-label="Back to top"
        >
          <ArrowUpIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </button>
      )}
    </div>
  );
};

const SummaryCard: React.FC<{ icon: string; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="rounded-xl shadow bg-white border border-gray-200 text-black p-6 flex items-center gap-4 transform hover:scale-105 transition-all duration-200 animate-fade-in">
    <div className="text-3xl md:text-4xl drop-shadow-lg">{icon}</div>
    <div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  </div>
); 
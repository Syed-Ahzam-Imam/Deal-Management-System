import React, { useState, useMemo } from 'react';
import { Deal } from '../types';
import { MagnifyingGlassIcon, BanknotesIcon } from '@heroicons/react/24/outline';

interface DealsTableProps {
  deals: Deal[];
  onDealDelete: (dealId: string) => void;
}

type SortField = 'companyName' | 'businessTurnover' | 'loanAmount' | 'purpose' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export const DealsTable: React.FC<DealsTableProps> = ({ deals, onDealDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredAndSortedDeals = useMemo(() => {
    let filtered = deals;
    if (searchQuery.trim()) {
      filtered = deals.filter(deal =>
        deal.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [deals, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (dealId: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      onDealDelete(dealId);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(value);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field) {
      return <span className="text-gray-400">↕</span>;
    }
    return <span className="text-black">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 animate-fade-in">
      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-gray-50 text-black placeholder:text-gray-400"
          />
        </div>
        <span className="text-xs text-gray-700 font-semibold bg-gray-100 rounded px-2 py-1 ml-2">
          {filteredAndSortedDeals.length} of {deals.length} deals
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition" onClick={() => handleSort('companyName')}>
                <div className="flex items-center gap-1">
                  <span>Company Name</span>
                  <SortIcon field="companyName" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition" onClick={() => handleSort('businessTurnover')}>
                <div className="flex items-center gap-1">
                  <span>Turnover</span>
                  <SortIcon field="businessTurnover" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition" onClick={() => handleSort('loanAmount')}>
                <div className="flex items-center gap-1">
                  <span>Loan Amount</span>
                  <SortIcon field="loanAmount" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition" onClick={() => handleSort('purpose')}>
                <div className="flex items-center gap-1">
                  <span>Purpose</span>
                  <SortIcon field="purpose" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition" onClick={() => handleSort('createdAt')}>
                <div className="flex items-center gap-1">
                  <span>Created</span>
                  <SortIcon field="createdAt" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredAndSortedDeals.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 animate-fade-in">
                  <span className="text-lg">No deals found.</span>
                </td>
              </tr>
            ) : (
              filteredAndSortedDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-100 transition-all duration-150 animate-fade-in">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-black flex items-center gap-2">
                      <BanknotesIcon className="h-5 w-5 text-gray-400" />
                      {deal.companyName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {formatCurrency(deal.businessTurnover)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800 flex items-center gap-2">
                      {formatCurrency(deal.loanAmount)}
                      {deal.loanAmount > 100000 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-black text-white animate-pulse shadow">
                          High Value
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-black">
                      {deal.purpose}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(deal.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(deal.id)}
                      className="text-black hover:text-white hover:bg-black px-3 py-1 rounded transition-all border border-black"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 
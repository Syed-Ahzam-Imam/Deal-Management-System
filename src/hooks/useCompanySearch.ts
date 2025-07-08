import { useState, useEffect, useCallback } from 'react';
import { Company } from '../types';
import { CompaniesHouseAPI, getMockCompanies } from '../services/companiesHouseApi';

export const useCompanySearch = () => {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCompanies = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setCompanies([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try real API first, fallback to mock data
      let results: Company[] = [];
      
      try {
        results = await CompaniesHouseAPI.searchCompanies(searchQuery);
      } catch (apiError) {
        console.warn('Using mock data due to API error:', apiError);
        results = getMockCompanies(searchQuery);
      }

      setCompanies(results);
    } catch (err) {
      setError('Failed to search companies');
      console.error('Company search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCompanies(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchCompanies]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setCompanies([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    companies,
    loading,
    error,
    clearSearch,
  };
}; 
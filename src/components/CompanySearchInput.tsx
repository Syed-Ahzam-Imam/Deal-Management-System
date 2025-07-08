import React, { useState, useRef, useEffect } from 'react';
import { Company } from '../types';
import { useCompanySearch } from '../hooks/useCompanySearch';

interface CompanySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onCompanySelect?: (company: Company) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const CompanySearchInput: React.FC<CompanySearchInputProps> = ({
  value,
  onChange,
  onCompanySelect,
  placeholder = "Search for a company...",
  className = "",
  required = false
}) => {
  const { query, setQuery, companies, loading, error, clearSearch } = useCompanySearch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync external value with internal query
  useEffect(() => {
    setQuery(value);
  }, [value, setQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < companies.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : companies.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && companies[selectedIndex]) {
          handleCompanySelect(companies[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleCompanySelect = (company: Company) => {
    onChange(company.company_name);
    onCompanySelect?.(company);
    setIsOpen(false);
    setSelectedIndex(-1);
    clearSearch();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setQuery(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (companies.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow for clicks on dropdown items
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      />
      
      {loading && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
          {error}
        </div>
      )}

      {isOpen && companies.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {companies.map((company, index) => (
            <div
              key={company.company_number}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleCompanySelect(company)}
            >
              <div className="font-medium text-gray-900">
                {company.company_name}
              </div>
              <div className="text-sm text-gray-500">
                {company.company_number} • {company.company_status}
              </div>
              {company.registered_office_address?.locality && (
                <div className="text-xs text-gray-400">
                  {company.registered_office_address.locality}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isOpen && !loading && companies.length === 0 && query.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="px-3 py-2 text-gray-500">
            No companies found
          </div>
        </div>
      )}
    </div>
  );
}; 
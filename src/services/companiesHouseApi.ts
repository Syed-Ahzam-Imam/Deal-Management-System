import { Company, CompaniesHouseResponse } from '../types';
const API_KEY = process.env.REACT_APP_COMPANIES_HOUSE_API_KEY ;
const BASE_URL = 'https://api.companieshouse.gov.uk';

export class CompaniesHouseAPI {
  private static async makeRequest(endpoint: string): Promise<any> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Basic ${btoa(`${API_KEY}:`)}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Companies House API error: ${response.status}`);
    }

    return response.json();
  }

  static async searchCompanies(query: string): Promise<Company[]> {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const response: CompaniesHouseResponse = await this.makeRequest(
        `/search/companies?q=${encodeURIComponent(query)}&items_per_page=10`
      );
      
      return response.items || [];
    } catch (error) {
      console.error('Error searching companies:', error);
      return [];
    }
  }

  static async getCompanyDetails(companyNumber: string): Promise<Company | null> {
    try {
      const company = await this.makeRequest(`/company/${companyNumber}`);
      return company;
    } catch (error) {
      console.error('Error fetching company details:', error);
      return null;
    }
  }
}

// Mock data for development/testing when API key is not available
export const mockCompanies: Company[] = [
  {
    company_number: "12345678",
    company_name: "ACME Corporation Ltd",
    company_status: "Active",
    type: "ltd",
    date_of_creation: "2020-01-01",
    registered_office_address: {
      address_line_1: "123 Business Street",
      locality: "London",
      postal_code: "SW1A 1AA",
      country: "England"
    }
  },
  {
    company_number: "87654321",
    company_name: "Tech Solutions Limited",
    company_status: "Active",
    type: "ltd",
    date_of_creation: "2019-05-15",
    registered_office_address: {
      address_line_1: "456 Innovation Drive",
      locality: "Manchester",
      postal_code: "M1 1AA",
      country: "England"
    }
  },
  {
    company_number: "11223344",
    company_name: "Global Enterprises PLC",
    company_status: "Active",
    type: "plc",
    date_of_creation: "2018-12-01",
    registered_office_address: {
      address_line_1: "789 Corporate Avenue",
      locality: "Birmingham",
      postal_code: "B1 1AA",
      country: "England"
    }
  }
];

export const getMockCompanies = (query: string): Company[] => {
  if (!query || query.length < 2) return [];
  
  return mockCompanies.filter(company =>
    company.company_name.toLowerCase().includes(query.toLowerCase())
  );
}; 
import { Deal } from '../types';

const DEALS_STORAGE_KEY = 'deals';

export const storageUtils = {
  // Get all deals from localStorage
  getDeals: (): Deal[] => {
    try {
      const stored = localStorage.getItem(DEALS_STORAGE_KEY);
      if (!stored) return [];
      
      const deals = JSON.parse(stored);
      // Convert string dates back to Date objects
      return deals.map((deal: any) => ({
        ...deal,
        createdAt: new Date(deal.createdAt)
      }));
    } catch (error) {
      console.error('Error reading deals from localStorage:', error);
      return [];
    }
  },

  // Save a new deal to localStorage
  saveDeal: (deal: Deal): void => {
    try {
      const existingDeals = storageUtils.getDeals();
      const updatedDeals = [...existingDeals, deal];
      localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(updatedDeals));
    } catch (error) {
      console.error('Error saving deal to localStorage:', error);
      throw new Error('Failed to save deal');
    }
  },

  // Delete a deal from localStorage
  deleteDeal: (dealId: string): void => {
    try {
      const existingDeals = storageUtils.getDeals();
      const updatedDeals = existingDeals.filter(deal => deal.id !== dealId);
      localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(updatedDeals));
    } catch (error) {
      console.error('Error deleting deal from localStorage:', error);
      throw new Error('Failed to delete deal');
    }
  },

  // Clear all deals from localStorage
  clearDeals: (): void => {
    try {
      localStorage.removeItem(DEALS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing deals from localStorage:', error);
      throw new Error('Failed to clear deals');
    }
  },

  // Search deals by company name
  searchDeals: (query: string): Deal[] => {
    const deals = storageUtils.getDeals();
    if (!query) return deals;
    
    return deals.filter(deal =>
      deal.companyName.toLowerCase().includes(query.toLowerCase())
    );
  }
}; 
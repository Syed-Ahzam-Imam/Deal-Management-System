import React, { useState } from 'react';
import { NewDealPage } from './pages/NewDealPage';
import { DealsPage } from './pages/DealsPage';
import { Deal } from './types';
import './App.css';

type Page = 'deals' | 'new-deal';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('deals');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDealCreated = (deal: Deal) => {
    console.log('New deal created:', deal);
  };

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false); 
  };

  return (
    <div className="App">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Deal Management System</h1>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigateToPage('deals')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'deals'
                    ? 'bg-black text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                View Deals
              </button>
              <button
                onClick={() => navigateToPage('new-deal')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'new-deal'
                    ? 'bg-black text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                New Deal
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                {mobileMenuOpen ? (
                  // If lucide-react is not available, use a simple SVG for X
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  // Hamburger icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
              {mobileMenuOpen && (
                <div className="absolute top-16 right-4 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 animate-fade-in">
                  <button
                    onClick={() => navigateToPage('deals')}
                    className={`block w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                      currentPage === 'deals'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    View Deals
                  </button>
                  <button
                    onClick={() => navigateToPage('new-deal')}
                    className={`block w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                      currentPage === 'new-deal'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    New Deal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>
        {currentPage === 'deals' && (
          <DealsPage onNavigateToNewDeal={() => navigateToPage('new-deal')} />
        )}
        {currentPage === 'new-deal' && (
          <NewDealPage 
            onDealCreated={handleDealCreated}
            onNavigateToDeals={() => navigateToPage('deals')}
          />
        )}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>Deal Management System</p>
            <p className="mt-1">Uses Companies House API for company validation</p>
            <p className="mt-1 font-semibold text-black">Project Owner: Syed Ahzam Imam</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

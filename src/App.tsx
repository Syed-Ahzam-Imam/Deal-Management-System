import React, { useState } from 'react';
import { NewDealPage } from './pages/NewDealPage';
import { DealsPage } from './pages/DealsPage';
import { Deal } from './types';
import './App.css';

type Page = 'deals' | 'new-deal';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('deals');

  const handleDealCreated = (deal: Deal) => {
    // This will be handled by the individual pages
    console.log('New deal created:', deal);
  };

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Deal Management System</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
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

      {/* Footer */}
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

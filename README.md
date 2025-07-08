# Deal Management System

**Project Owner:** Syed Ahzam Imam

A modern React TypeScript application for managing business deals with Companies House API integration for company validation.

## Features

✅ **React (TypeScript) + Tailwind CSS** - Modern, type-safe development with utility-first CSS
✅ **Clean, reusable components** - Well-structured component architecture
✅ **Responsive, clear UI** - Mobile-first design with excellent user experience
✅ **Companies House API Integration** - Real-time company validation and search

### Core Functionality

#### New Deal Form
- **Company Name**: Real-time search and validation using Companies House API
- **Business Turnover**: Currency input with validation
- **Funding Type**: Fixed to "Loans" as specified
- **Purpose**: Dropdown with predefined options (Cash Flow Boost, New Equipment, Expansion, Refinance, Other)
- **Loan Amount**: Currency input with business logic validation
- **Notes**: Optional textarea for additional information
- **Form Validation**: Comprehensive client-side validation with error handling

#### Deals Management
- **Responsive Table**: Clean, sortable table displaying all deals
- **Search Functionality**: Filter deals by company name
- **Sorting**: Click column headers to sort by any field
- **Delete Functionality**: Remove individual deals with confirmation
- **Summary Statistics**: Dashboard cards showing totals and averages
- **Local Storage**: Persistent data storage using browser localStorage

## Technology Stack

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Companies House API** - UK company data and validation
- **Local Storage** - Client-side data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd deal-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Companies House API Setup (Optional)

For production use with real company data:

1. **Get an API key** from [Companies House Developer Hub](https://developer.company-information.service.gov.uk/)
2. **Create a `.env` file** in the project root:
   ```
   REACT_APP_COMPANIES_HOUSE_API_KEY=your-api-key-here
   ```
3. **Restart the development server**

**Note**: If no API key is provided, the application will use mock data for demonstration purposes.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CompanySearchInput.tsx
│   ├── DealsTable.tsx
│   └── NewDealForm.tsx
├── pages/              # Page-level components
│   ├── DealsPage.tsx
│   └── NewDealPage.tsx
├── services/           # API and external services
│   └── companiesHouseApi.ts
├── hooks/              # Custom React hooks
│   └── useCompanySearch.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── storage.ts
├── App.tsx             # Main application component
└── index.css           # Global styles
```

## Usage

### Creating a New Deal

1. Click "New Deal" in the navigation
2. Start typing a company name to search Companies House
3. Select the correct company from the dropdown
4. Fill in the remaining form fields
5. Submit the form to save the deal

### Managing Deals

1. View all deals on the main page
2. Use the search bar to filter by company name
3. Click column headers to sort the table
4. Use the delete button to remove individual deals
5. View summary statistics in the dashboard cards

## Features in Detail

### Company Search & Validation
- Real-time search as you type
- Debounced API calls to prevent excessive requests
- Keyboard navigation support (arrow keys, enter, escape)
- Fallback to mock data when API is unavailable
- Company verification indicators

### Form Validation
- Required field validation
- Business logic validation (loan amount vs turnover)
- Real-time error clearing
- Currency formatting
- Responsive form layout

### Data Management
- Persistent storage using localStorage
- Error handling for storage operations
- Data integrity checks
- Automatic data loading on page refresh

### Responsive Design
- Mobile-first approach
- Responsive table with horizontal scroll
- Adaptive layout for different screen sizes
- Touch-friendly interface elements

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Component-based architecture
- Custom hooks for reusable logic

## API Integration

The application integrates with the Companies House API for company validation:

- **Search Endpoint**: `/search/companies`
- **Company Details**: `/company/{company_number}`
- **Authentication**: Basic Auth with API key
- **Rate Limiting**: Built-in request throttling
- **Error Handling**: Graceful fallback to mock data

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for demonstration purposes. Please ensure compliance with Companies House API terms of service for production use.

## Support

For questions or issues:
1. Check the browser console for error messages
2. Verify your API key is correct (if using real data)
3. Ensure localStorage is enabled in your browser
4. Check network connectivity for API calls

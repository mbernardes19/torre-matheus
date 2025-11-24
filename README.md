# Torre Job Search

A modern job search application built with Next.js that integrates with the Torre API to search for open job opportunities. Features real-time search with debouncing, cursor-based pagination, and URL state management.

## Features

- 🔍 **Real-time Search**: Search updates as you type with 300ms debounce
- 📄 **Cursor-based Pagination**: Navigate through results efficiently using API cursors
- 🔗 **URL State Management**: Search terms and pagination state persist in the URL
- 🎨 **Dark Mode UI**: Beautiful, modern interface with Tailwind CSS
- 🧪 **Comprehensive Testing**: Unit tests with Vitest and React Testing Library
- 🏗️ **Clean Architecture**: Separation of concerns with services, hooks, and components

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + React Testing Library
- **API**: Torre Search API

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/mbernardes19/torre-matheus.git
cd torre-matheus
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Search for Jobs

1. Type keywords in the search input (e.g., "developer", "designer", "marketing")
2. Results appear automatically as you type
3. Each result shows:
   - Job title and company
   - Location
   - Compensation (if available)
   - Required skills

### Navigate Results

- Use **Next** and **Previous** buttons to navigate through pages
- Current page and total pages displayed
- Pagination state is preserved in the URL

### Share Results

- Copy the URL to share specific search results
- URLs include search term and pagination cursor
- Example: `/?q=developer&cursor=abc123`

## Project Structure

```
torre-matheus/
├── src/
│   ├── components/        # React components
│   │   ├── SearchPage.tsx
│   │   ├── SearchResultItem.tsx
│   │   └── Pagination.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useSearch.ts
│   │   └── usePagination.ts
│   └── services/         # API integration
│       ├── http.service.ts
│       ├── torre.service.ts
│       └── index.ts
├── __tests__/            # Test files
│   ├── hooks/
│   └── services/
├── app/                  # Next.js app directory
└── public/              # Static assets
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Open Vitest UI
npm run test:coverage # Generate coverage report

# Linting
npm run lint         # Run ESLint
```

## API Integration

The application uses the Torre Search API (`https://search.torre.co`) to fetch job opportunities. The integration includes:

- **Keyword Search**: Filter by search terms with locale support
- **Status Filtering**: Only shows open positions
- **Cursor Pagination**: Efficient navigation using `after` and `before` parameters

## Testing

Run the test suite:

```bash
npm run test:run
```

Tests cover:

- HTTP service methods (GET, POST, PUT, PATCH, DELETE)
- Torre service API integration
- Pagination hook logic
- Component rendering and interactions

## Architecture Highlights

### Services Layer

- **HTTP Service**: Generic HTTP client with timeout, error handling, and query params
- **Torre Service**: Specialized integration with Torre API

### Custom Hooks

- **useSearch**: Manages search state, debouncing, and URL synchronization
- **usePagination**: Handles cursor-based pagination logic

### Components

- **SearchPage**: Main container component
- **SearchResultItem**: Individual job card
- **Pagination**: Navigation controls

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

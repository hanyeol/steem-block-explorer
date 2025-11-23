# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Steem Block Explorer is a React-based web application for exploring blocks, transactions, and accounts on the Steem blockchain.

## Tech Stack

- **Frontend**: React 19 with Vite
- **Routing**: React Router v6
- **Blockchain API**: Direct Steem RPC JSON-RPC calls (no external libraries)
- **Styling**: Plain CSS with CSS variables
- **Build Tool**: Vite 7

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── BlockList.jsx   # Displays list of recent blocks
│   ├── BlockDetail.jsx # Shows detailed block information
│   └── SearchBar.jsx   # Search by block number or account
├── pages/             # Page components
│   ├── HomePage.jsx   # Main page with block list
│   └── BlockPage.jsx  # Individual block detail page
├── services/          # API integration
│   └── steemApi.js    # Steem RPC API calls
├── App.jsx            # Main app with routing
└── main.jsx           # Entry point
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Steem API Integration

The app uses direct JSON-RPC calls to Steem RPC nodes. See [src/services/steemApi.js](src/services/steemApi.js) for implementation.

**Available API functions:**
- `getLatestBlockNum()` - Get the latest block number
- `getBlock(blockNum)` - Get specific block data
- `getBlocks(startBlock, count)` - Get multiple blocks
- `getAccount(username)` - Get account information
- `getTransaction(blockNum, txIndex)` - Get specific transaction

**RPC nodes used:**
- https://api.steemit.com
- https://api.steemitstage.com

## Key Features

- **Real-time Block Updates**: Auto-refreshes every 3 seconds (Steem block time)
- **Block Navigation**: Previous/Next navigation between blocks
- **Search**: Search by block number or account name
- **Transaction Details**: View all operations within transactions

## Steem Blockchain Concepts

- **Blocks**: Contain multiple transactions, produced every 3 seconds
- **Transactions**: Include operations like transfers, posts, votes, custom_json
- **Witnesses**: Block producers that secure the network
- **Operations**: Different transaction types (vote_operation, comment_operation, transfer_operation, etc.)

## Code Style Guidelines

- Use functional components with Hooks
- English comments only
- Component files: PascalCase (e.g., `BlockList.jsx`)
- Utility functions: camelCase (e.g., `formatTimestamp`)
- Keep component-specific styles in separate CSS files

## Commit Message Convention

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting
- `refactor`: Code refactoring
- `test`: Adding test code
- `chore`: Build tasks, dependency updates

## Security Considerations

- Never store private keys in code or version control
- Validate and sanitize blockchain data before display
- Use public RPC nodes or configure trusted node endpoints
- Implement rate limiting for API calls to prevent abuse

## Detail Page Design Principles

- Use `DetailLayout` for all detail views to keep navigation/title/actions consistent.
- Keep data fetching in page components; make detail components presentational-only.
- Always offer a back link to the list context and disable impossible nav targets (e.g., prev block at genesis).
- Reuse shared styles for collapsible/raw JSON/error/loading; avoid per-page duplicates.
- Show raw JSON in a collapsible section for transparency/debugging.

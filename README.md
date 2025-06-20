# Sync Player Client - Next.js

A Next.js client application for room management and real-time chat functionality using Socket.IO.

## Features

- Real-time chat with Socket.IO
- Room-based user management
- User connection status tracking
- Message history with timestamps
- Responsive design
- TypeScript support

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── package.json             # Dependencies and scripts
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## Configuration

The Socket.IO server URL is configured in `app/page.tsx`:

```typescript
const SOCKET_URL = "https://sync-player-server.onrender.com";
```

You can change this to point to your own Socket.IO server.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Usage

1. Enter your username and room ID
2. Click "Connect" to join the room
3. Start chatting with other users in the same room
4. Use the "Leave Room" button to disconnect

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Socket.IO Client
- CSS Modules

## Migration from Vanilla JS

This project has been migrated from a vanilla JavaScript implementation to Next.js with the following improvements:

- React hooks for state management
- TypeScript for type safety
- Better component organization
- Improved development experience with hot reloading
- Better build optimization
- Modern React patterns and best practices

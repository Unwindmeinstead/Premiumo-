# P+ Premium Tracker

A modern premium tracking application for covered calls and cash-secured puts with a beautiful dark theme.

## Features

- 📊 Track covered calls and cash-secured puts
- 💰 Premium tracking and statistics
- 📈 Monthly premium summaries
- 🎨 Beautiful dark theme UI
- 💾 Local storage persistence
- 📱 Responsive design
- 🔌 **PWA (Progressive Web App)** - Install on your device
- ⚡ Offline support with service worker
- 📲 Install prompt for easy app installation

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. Click "New Trade" to add a covered call or cash-secured put
2. Fill in the trade details (symbol, strike, premium, expiration, etc.)
3. Track your open and closed trades
4. View statistics including total premium collected and monthly summaries

## PWA Installation

P+ is a Progressive Web App (PWA) that can be installed on your device:

1. **Desktop (Chrome/Edge)**: Look for the install prompt or click the install icon in the address bar
2. **Mobile (iOS Safari)**: Tap Share → Add to Home Screen
3. **Mobile (Android Chrome)**: Tap the menu → Install App or use the install prompt

Once installed, the app works offline and provides a native app-like experience.

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons
- date-fns
- Service Worker (PWA)

# Hermes WebUI Mobile App

A modern React web application for managing and connecting to Hermes WebUI instances (e.g. `https://hermes.orangepi.vn`) with saved credentials, auto-login assistance, and device frame preview.

## Features

### 1. Multiple Server URL Management
- Add, edit, and delete multiple Hermes server URLs
- Filter and search through instances by name or URL
- Test demo server preset (`https://hermes.orangepi.vn` with password `orangepi`)

### 2. Credential Management & Auto-Login
- Optional password credential storage for Hermes password-only authentication
- Stored locally in browser storage
- Visual "Credentials saved" badge
- Quick 1-click password copy button with instant feedback toast

### 3. Integrated Connection & WebView Experience
- Embedded Hermes WebUI frame with responsive layout
- Viewport mode switcher:
  - Mobile Device View (390px phone frame)
  - Tablet Device View (768px frame)
  - Full Window View (100% responsive)
- Header controls: Back navigation, Reload, and Launch Directly in New Tab
- Browser security fallback with instant direct open helper if iframe embedding is blocked by X-Frame-Options

### 4. Configuration Backup & Restore
- Export server configuration to JSON for backup or migration
- Import JSON configuration to restore servers across devices and browsers

## Development & Build

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Build production bundle
npm run build
```

## Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons

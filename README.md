# Hermes Developer Console & WebUI Manager

A modern, tech-oriented developer console for managing and monitoring Hermes WebUI server instances (such as `https://hermes.orangepi.vn`) with automated status pinging, Vietnamese language localization, and terminal-style typography.

## Features

### 1. Terminal Developer Console Aesthetic
- Dark terminal UI inspired by developer telemetry consoles (`#090d16` canvas with cyan `#22d3ee` and emerald `#34d399` accents).
- High-legibility monospaced typography using Google Fonts **JetBrains Mono** with explicit Vietnamese diacritic support (`subset=vietnamese,latin,latin-ext`).

### 2. Live Server Status Check & Ping Health Monitor
- Automatic background ping on initial launch.
- Periodic polling every 30 seconds plus on-demand single re-ping and global **"PING ALL"** sweep.
- Real-time round-trip latency measurement (in milliseconds) and live status badges:
  - **Online** (emerald dot with response latency, e.g. `● ONLINE · 112ms` / `● TRỰC TUYẾN · 112ms`)
  - **Offline** (rose dot with connection failure details)
  - **Probing** (cyan spinner during network sweep)

### 3. Full Vietnamese & English Localization
- Instant `[ EN | VI ]` language toggle in the top bar.
- Comprehensive translation dictionary covering all headers, buttons, cards, dialogs, and session states.
- Persists language preference across browser sessions in `localStorage`.

### 4. Credential Management & Auto-Login Ready
- Password-only credential saving tailored to Hermes WebUI instances.
- 1-click password copy button with instant clipboard feedback toast.

### 5. Interactive Session Viewport & Device Simulation
- Switch between **Mobile Device View** (390px chassis), **Tablet View** (768px chassis), and **Full Window View**.
- Header controls: Console return, session reload, and direct launch in new tab.
- Security header fallback notification with direct launch button when external hosts send restrictive frame headers (`X-Frame-Options` / CSP `frame-ancestors`).

### 6. Database Backup & Migration
- Export server registry to formatted JSON.
- Import and merge JSON configuration payloads.

## Development & Build

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Lint TypeScript
npm run lint

# Build production bundle
npm run build
```

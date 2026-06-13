# 🌿 The Memory Garden

**A warm, bilingual pet memorial platform — built with Next.js and Supabase.**

> Because every paw print leaves a mark on the heart.

🔗 **Live:** [the-memory-garden-v2.vercel.app](https://the-memory-garden-v2.vercel.app/)

---

## What it is

The Memory Garden lets people create lasting digital memorials for beloved pets. Users can write tributes, upload photos, light virtual candles, and share a unique memorial page with friends and family.

- 🌍 Users across **190+ countries**
- 🕯️ **54+ candles** lit
- 🐾 Built in memory of Da Wang (2009–2025)

---

## Features

- **Memorial Wall** — browse all tributes in a filterable grid
- **Individual Memorial Pages** — each pet gets a unique public URL
- **Virtual Candles** — light a candle in someone's memory
- **Bilingual** — full EN / 中文 support via custom i18n hook
- **Auth** — sign in to create and manage your own memorials
- **Photo uploads** — images stored in Supabase Storage

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React) |
| Backend / Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| i18n | Custom `useLanguage` hook (EN / ZH JSON) |
| Deployment | Vercel |

---

## Project Structure

```
the-memory-garden/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           ← Navigation + language toggle
│   │   ├── HeroSection.jsx      ← Landing hero
│   │   ├── MemoryWall.jsx       ← Grid of memorial cards
│   │   ├── MemorialCard.jsx     ← Individual pet card
│   │   ├── CandleSection.jsx    ← Virtual candles
│   │   └── CreateModal.jsx      ← Create memorial form
│   ├── pages/
│   │   ├── index.jsx            ← Homepage
│   │   └── memorial/[id].jsx    ← Individual memorial page
│   ├── locales/
│   │   ├── en.json              ← English strings
│   │   └── zh.json              ← Chinese strings
│   └── hooks/
│       └── useLanguage.js       ← EN/ZH switching hook
├── next.config.js
└── package.json
```

---

## Getting Started (local dev)

```bash
# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

*In loving memory of Da Wang (2009–2025). Forever our Great King. 🐾*
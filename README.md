# 🌿 The Memory Garden

A warm, bilingual (EN / 中文) pet memorial website built with **Next.js**.

---

## 📁 Project Structure

```
the-memory-garden/
├── public/                  # Static assets (images, favicon)
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx           ← Top navigation + language toggle
│   │   ├── HeroSection.jsx      ← Landing hero
│   │   ├── MemoryWall.jsx       ← Grid of memorial cards
│   │   ├── MemorialCard.jsx     ← Individual pet card
│   │   ├── CandleSection.jsx    ← Virtual candles
│   │   └── CreateModal.jsx      ← Create memorial form
│   ├── pages/               # Next.js pages (each = a URL)
│   │   ├── _app.jsx             ← Global app wrapper
│   │   ├── _document.jsx        ← HTML head/meta
│   │   └── index.jsx            ← Homepage (/)
│   ├── styles/
│   │   └── global.css           ← Global CSS variables & shared styles
│   ├── locales/             # Translation files
│   │   ├── en.json              ← English text
│   │   └── zh.json              ← Chinese text
│   ├── data/
│   │   └── pets.js              ← Sample pet data (replace with DB later)
│   └── hooks/
│       └── useLanguage.js       ← Custom hook for EN/ZH switching
├── next.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```

### 3. Open in browser
```
http://localhost:3000
```

---

## 🛠 Adding a Real Backend (Next Steps)

| Feature | Tool |
|---|---|
| Database (save memorials) | [Supabase](https://supabase.com) |
| User authentication | Supabase Auth |
| Image uploads | Supabase Storage or Cloudinary |
| Deploy online | [Vercel](https://vercel.com) (free) |

---

## 🐾 In memory of Da Wang (2019–2025)
*Forever our Great King.*

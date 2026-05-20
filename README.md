# FRAMES

A full-stack streaming discovery app built with Next.js 16, featuring movie and TV series browsing, a personal watchlist, and in-app video playback — powered by the TMDB API.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat-square&logo=mongodb)

---

## Features

- **Browse** movies and TV series with genre filtering and trending sections
- **Search** across the entire TMDB catalogue with live results
- **Detail pages** with cast, ratings, runtime, and related content
- **In-app video player** — plays directly without leaving the page, with episode selector for TV series
- **Watchlist** — add and remove titles, persisted to MongoDB per user
- **Authentication** via Clerk — sign in/up with email or social providers
- **Responsive** — works across mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Auth | Clerk |
| Database | MongoDB via Mongoose |
| State | Zustand + TanStack React Query |
| Data | TMDB API |
| Video | Videasy embed player |
| UI | Lucide React, React Hot Toast |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [TMDB API key](https://www.themoviedb.org/settings/api)
- A [Clerk](https://clerk.com) account
- A [MongoDB](https://www.mongodb.com/atlas) database (Atlas free tier works)

### Installation

```bash
git clone https://github.com/yourusername/frames.git
cd frames
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# TMDB
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/home
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/home

# MongoDB
MONGODB_URI=your_mongodb_connection_string
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
frames/
├── app/
│   ├── (platform)/         # Protected app routes
│   │   ├── home/           # Home page with hero and trending rows
│   │   ├── movies/         # Movies browse + detail pages
│   │   ├── tv/             # TV series browse + detail + episodes
│   │   ├── trending/       # Trending movies and TV
│   │   ├── watchlist/      # User's saved titles
│   │   ├── search/         # Search results page
│   │   └── profile/        # User profile
│   └── api/
│       └── watchlist/      # Watchlist REST API (MongoDB)
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── media/              # MediaCard, HeroBanner, VideoPlayer, etc.
│   └── search/             # SearchOverlay
├── services/tmdb/          # TMDB API client
├── models/                 # Mongoose schemas
├── store/                  # Zustand global state
├── hooks/                  # Custom React hooks
├── lib/                    # MongoDB connection, utilities
└── types/                  # Shared TypeScript types
```

---

## Screenshots

> Add screenshots here once deployed.

---

## Disclaimer

This project is built for portfolio purposes. All media data is sourced from the [TMDB API](https://www.themoviedb.org). This product uses the TMDB API but is not endorsed or certified by TMDB.

---

## License

MIT

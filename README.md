# Spring Valley Church — svchurch.co.uk

A modern, full-stack church website and content management system built with Next.js 14, replacing the legacy WordPress/BeTheme site.

**Live:** [svchurch-app.vercel.app](https://svchurch-app.vercel.app)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + custom design tokens |
| Animations | Framer Motion |
| Database | PostgreSQL on [Neon](https://neon.tech) |
| ORM | Prisma 5 |
| Auth | NextAuth.js v4 (JWT, credentials) |
| Hosting | Vercel |
| Fonts | Gilda Display (headings), Inter (body), Cinzel (accents) |

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#ab815a` | Bronze — buttons, links, accents |
| Accent | `#f16923` | Orange — CTAs, highlights |
| Dark | `#1e232b` | Navy — text, dark sections |
| Cream | `#faf8f5` | Background |
| Warm Gray | `#f5f0eb` | Cards, subtle backgrounds |

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages (Header + Footer)
│   │   ├── page.tsx           # Homepage (7 sections)
│   │   ├── about/             # About, Leadership, Ministries
│   │   ├── blogs/             # Blog listing
│   │   ├── contact/           # Contact form + map
│   │   └── media-centre/      # Gallery + Media hub
│   ├── (auth)/
│   │   └── admin-login/       # Login page (outside admin layout)
│   ├── admin/             # Protected admin dashboard
│   │   ├── blogs/             # Blog CRUD + new post form
│   │   ├── leadership/        # Leader management + reorder
│   │   ├── ministries/        # Ministry management
│   │   ├── gallery/           # Gallery image management
│   │   └── messages/          # Contact form submissions
│   ├── api/               # API routes
│   │   ├── admin/             # Protected endpoints (session + RBAC)
│   │   ├── auth/              # NextAuth handler
│   │   └── contact/           # Public contact form endpoint
│   ├── layout.tsx         # Root layout (fonts, metadata)
│   └── globals.css        # Design tokens, scrollbar, selection
├── components/
│   ├── Header.tsx         # Sticky transparent→solid header
│   ├── Footer.tsx         # Dark footer with service info
│   ├── AdminSidebar.tsx   # Fixed admin nav sidebar
│   ├── AdminHeader.tsx    # Admin top bar
│   └── AdminSessionProvider.tsx
├── lib/
│   ├── auth.ts            # NextAuth config (rate limit + lockout)
│   ├── prisma.ts          # Singleton Prisma client
│   ├── permissions.ts     # RBAC: 5 roles, permission matrix
│   ├── api-auth.ts        # API route auth + audit logging
│   ├── security.ts        # Rate limiting, AES-256-GCM encryption, sanitisation
│   └── utils.ts           # cn() helper
prisma/
├── schema.prisma          # 13 models (User, BlogPost, Ministry, etc.)
├── seed.ts                # Seeds admin user, leaders, ministries, blogs, gallery
└── migrations/            # Database migrations
```

## Getting Started

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (or any PostgreSQL instance)

### Setup

```bash
# Clone
git clone https://github.com/abrahambijojoseph90/svchurch-app.git
cd svchurch-app

# Install
npm install

# Environment — copy and fill in values
cp .env.example .env

# Database
npx prisma migrate deploy
npx prisma db seed

# Run
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Neon pooler recommended) |
| `NEXTAUTH_SECRET` | Random secret for JWT signing |
| `NEXTAUTH_URL` | App URL (`http://localhost:3000` for dev) |
| `ENCRYPTION_KEY` | 32+ character key for AES-256-GCM token encryption |

### Default Admin Login
- **Email:** admin@svchurch.co.uk
- **Password:** SVC@admin2026

> Change this immediately after first login.

## Security

- **Authentication:** NextAuth.js with JWT strategy, 1-hour sessions
- **Account lockout:** 5 failed attempts = 15-minute lockout
- **Rate limiting:** Per-IP rate limiting on login and contact form
- **RBAC:** 5 roles (Super Admin, Admin, Editor, Creator, Viewer) with granular permissions
- **Encryption:** Social media tokens encrypted at rest with AES-256-GCM
- **Headers:** HSTS, X-Frame-Options DENY, X-Content-Type-Options, CSP, Referrer-Policy, Permissions-Policy
- **Input sanitisation:** HTML stripping, email validation, password strength checks
- **Audit logging:** All admin actions logged with user ID, IP, timestamp
- **Prisma:** Parameterised queries (SQL injection safe by default)
- **Middleware:** Route-level protection for /admin/* paths

## RBAC Permissions Matrix

| Permission | Super Admin | Admin | Editor | Creator | Viewer |
|-----------|:-----------:|:-----:|:------:|:-------:|:------:|
| Manage users | x | | | | |
| Manage settings | x | x | | | |
| Publish posts | x | x | x | | |
| Create posts | x | x | x | x | |
| Cross-post social | x | x | | | |
| Send WhatsApp | x | x | | | |
| Manage gallery | x | x | x | | |
| View dashboard | x | x | x | x | x |

## Deployment (Vercel)

The app is configured for Vercel deployment:

```bash
# Build script includes Prisma generate
npm run build  # → prisma generate && next build

# Deploy
vercel --prod
```

Set environment variables in Vercel dashboard or via CLI:
```bash
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add ENCRYPTION_KEY production
```

## License

Private — Spring Valley Church, Luton, UK.

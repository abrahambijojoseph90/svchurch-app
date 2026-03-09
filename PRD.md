# Product Requirements Document — Spring Valley Church Website

**Project:** svchurch-app
**Organisation:** Spring Valley Church, Luton, UK (Assemblies of God UK)
**Current URL:** svchurch.co.uk
**Repository:** github.com/abrahambijojoseph90/svchurch-app
**Last Updated:** 2026-03-09

---

## 1. Overview

Custom-built church website and content management system replacing the existing WordPress/BeTheme site hosted on Hostinger. The new platform removes plugin/theme restrictions, adds a secure admin panel with role-based access, and lays the foundation for social media integration and WhatsApp broadcasting.

## 2. Goals

1. **Modern, fast website** — sub-2s load times on Vercel Edge, smooth animations, mobile-first
2. **Full content control** — admin dashboard for blogs, gallery, leadership, ministries, contact messages
3. **Multi-user CMS** — role-based access for church team members (5 permission levels)
4. **Social media integration** — one-click cross-posting to Facebook, Instagram, YouTube
5. **WhatsApp Business** — broadcast church updates to congregation via approved templates
6. **Security-first** — encrypted tokens, rate limiting, audit logging, account lockout, security headers

## 3. Church Information

- **Name:** Spring Valley Church (The Valley of New Birth)
- **Location:** Luton, Bedfordshire, UK
- **Affiliation:** Assemblies of God, Great Britain
- **Lead Pastor:** Thomas Samuel
- **Service Times:**
  - Sunday Worship — 10:30 AM
  - Wednesday Bible Study — 7:00 PM
  - Friday Prayer Meeting — 7:00 PM
- **Address:** Spring Valley Church, Luton, UK (Google Maps embedded)
- **Give Link:** stewardship.org.uk/partners/SpringValleyChurchLuton

## 4. Current Features (MVP — Completed)

### 4.1 Public Pages
| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero banner, welcome, service times, ministries preview, leadership, gallery preview, CTA |
| About | `/about` | Church history, mission & vision statements |
| Leadership | `/about/leadership` | Pastor profiles with photos and bios |
| Ministries | `/about/ministries` | 6 ministry cards with descriptions |
| Blogs | `/blogs` | Blog post listing |
| Contact | `/contact` | Contact form (name, email, phone, message) + Google Maps + service times |
| Media Centre | `/media-centre` | Hub linking to Gallery and Media |
| Gallery | `/media-centre/gallery` | 18-image masonry grid with lightbox |
| Media | `/media-centre/media` | Coming soon placeholder for sermons/videos |

### 4.2 Admin Dashboard
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/admin` | Overview stats (posts, images, messages, leaders) |
| Blogs | `/admin/blogs` | List, create, delete blog posts |
| New Blog | `/admin/blogs/new` | Blog creation form (title, slug, content, image, publish toggle) |
| Leadership | `/admin/leadership` | CRUD + drag reorder for leaders |
| Ministries | `/admin/ministries` | CRUD for ministry entries |
| Gallery | `/admin/gallery` | Upload and manage gallery images |
| Messages | `/admin/messages` | View contact form submissions, mark as read |

### 4.3 Authentication & Security
- NextAuth.js credentials provider with JWT sessions (1-hour expiry)
- Login page at `/admin-login` (outside admin layout to prevent redirect loops)
- Account lockout after 5 failed attempts (15-minute cooldown)
- Per-IP rate limiting on login and contact form endpoints
- RBAC with 5 roles and granular permission matrix
- AES-256-GCM encryption for stored social media tokens
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- Audit logging for all admin actions

### 4.4 Database Models (13 total)
User, Invitation, AuditLog, Leader, Ministry, BlogPost, GalleryImage, ContactSubmission, SiteSettings, SermonMedia, SocialAccount, SocialPost, WhatsAppBroadcast

### 4.5 Ministries
1. **Kid's Club** — Fun Bible lessons and activities for children
2. **Prayer Meetings** — Friday evening corporate prayer
3. **SVC Students and Twentees** — Youth & young adult ministry
4. **SVC Women's Fellowship** — Women's spiritual growth and community
5. **SVC Men's Fellowship** — Men's discipleship and service
6. **SVC Missions** — Outreach and mission projects

### 4.6 Leadership
1. **Thomas Samuel & Praisy Samuel** — Pastor & Wife
2. **Simon Varghese** — Treasurer
3. **Bijo Abraham** — Trustee

---

## 5. Planned Features (Phase 2)

### 5.1 Individual Ministry Pages
- **Route:** `/about/ministries/[slug]`
- Each ministry gets a full dedicated page with:
  - Hero banner with ministry image
  - Detailed description and mission statement
  - Schedule and location info
  - Photo gallery specific to that ministry
  - Upcoming events
  - Contact/sign-up form for that ministry
- Admin can edit each ministry's full page content

### 5.2 Rich Text Editor
- Replace plain text content fields with **TipTap** editor
- Support headings, bold, italic, lists, links, images, embeds
- Apply to blog post content and ministry descriptions

### 5.3 Image Upload to Cloud Storage
- **Vercel Blob** or **Cloudinary** for image hosting
- Upload from admin dashboard (drag & drop)
- Auto-resize and optimise images
- Replace local `/public/images/` references with CDN URLs

### 5.4 User Management Admin Page
- **Route:** `/admin/users`
- Super Admin can:
  - View all users and their roles
  - Invite new users via email (generates secure invitation token)
  - Change user roles
  - Activate/deactivate accounts
  - View login history

### 5.5 Settings Admin Page
- **Route:** `/admin/settings`
- Manage site-wide settings:
  - Church name, address, phone, email
  - Service times
  - Social media links
  - Give/donation URL
  - SEO metadata

---

## 6. Planned Features (Phase 3 — Social & Messaging)

### 6.1 Social Media Cross-Posting Engine
- **Platforms:** Facebook Page, Instagram Business, YouTube
- One-click cross-post when publishing a blog post
- Auto-format content per platform (character limits, image requirements)
- OAuth2 token management with encrypted storage
- Post status tracking (pending, posted, failed)
- Schedule posts for future publishing

#### API Integration Requirements
| Platform | API | Auth | Actions |
|----------|-----|------|---------|
| Facebook | Graph API v19+ | OAuth2 Page Token | Publish posts, upload photos |
| Instagram | Instagram Graph API | Facebook OAuth2 | Publish media posts |
| YouTube | YouTube Data API v3 | Google OAuth2 | Upload videos, set metadata |

### 6.2 WhatsApp Business Integration
- **API:** WhatsApp Business Cloud API (Meta)
- Send broadcast messages to congregation
- Use pre-approved message templates
- Audience targeting (all members, by ministry, custom groups)
- Delivery tracking (sent, delivered, read)
- Admin UI for composing and sending broadcasts
- Rate limit compliance with WhatsApp's messaging policies

### 6.3 Media Centre — Sermons
- **Route:** `/media-centre/media`
- Sermon archive with video/audio playback
- YouTube embed integration
- Search and filter by speaker, date, series
- Admin upload and management

---

## 7. Planned Features (Phase 4 — Enhancements)

### 7.1 Event Calendar
- Interactive calendar on public site
- Admin can create and manage events
- Link events to ministries
- iCal export for members

### 7.2 Newsletter / Email Integration
- Email subscription for church updates
- Integration with SendGrid, Resend, or Mailchimp
- Auto-send digest of new blog posts

### 7.3 Online Giving Integration
- Embedded giving page (currently links to Stewardship)
- Potentially Stripe integration for direct donations
- Recurring giving options

### 7.4 Member Directory (Private)
- Password-protected member area
- Contact directory for church members
- Privacy controls (opt-in only)

### 7.5 GDPR Compliance
- Cookie consent banner
- Privacy policy page
- Data export/deletion requests
- Contact form data retention policies

### 7.6 Multi-language Support
- Malayalam (primary congregation language) alongside English
- i18n framework for translatable content

### 7.7 PWA (Progressive Web App)
- Offline access to key pages
- Push notifications for events and updates
- Add to home screen

### 7.8 Analytics Dashboard
- Admin page showing site traffic metrics
- Integration with Vercel Analytics or Google Analytics
- Blog post performance metrics
- Contact form conversion rates

---

## 8. Non-Functional Requirements

| Requirement | Target |
|------------|--------|
| Page load (LCP) | < 2.5 seconds |
| Mobile Lighthouse score | > 90 |
| Uptime | 99.9% (Vercel SLA) |
| Database | Auto-scaling via Neon |
| SSL | Enforced (Vercel default) |
| Session timeout | 1 hour |
| Password policy | Min 8 chars, mixed case, number, special char |
| Backup | Neon point-in-time recovery |

## 9. Architecture Decisions

1. **Next.js 14 App Router** — Server components by default, route groups for layout separation
2. **Prisma 5** (not 7) — Prisma 7 requires adapter pattern; 5 is stable and well-supported
3. **NextAuth v4** — Mature, well-documented; v5 (Auth.js) still has breaking changes
4. **JWT sessions** (not database sessions) — Faster, no extra DB queries per request
5. **In-memory rate limiting** — Simple, sufficient for single-instance Vercel serverless; upgrade to Redis (Upstash) if needed
6. **Route groups** — `(public)` for header/footer pages, `(auth)` for login, `admin/` for dashboard
7. **No Shadcn UI** — Direct TailwindCSS for full design control without component library constraints
8. **Framer Motion** — Lightweight, React-native animation library for scroll reveals and transitions

---

## 10. Deployment

- **Platform:** Vercel (production)
- **Database:** Neon PostgreSQL (us-east-2, project: quiet-union-74906065)
- **Domain:** svchurch.co.uk (to be pointed to Vercel)
- **Build:** `prisma generate && next build`
- **CI:** Vercel auto-deploys on push to `master`
- **Environment variables:** Set via Vercel dashboard (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, ENCRYPTION_KEY)

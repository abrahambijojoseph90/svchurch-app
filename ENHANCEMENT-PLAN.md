# Spring Valley Church Website — Enhancement Plan

> **Created:** 2026-03-11
> **Stack:** Next.js 14 · Prisma · Neon PostgreSQL · Vercel · TipTap · NextAuth
> **Live:** https://svchurch-app.vercel.app

---

## Status Legend

| Icon | Meaning |
|------|---------|
| `[ ]` | To do |
| `[x]` | Completed |
| `[LATER]` | Deferred — do later |

---

## PHASE 1: Core Experience Upgrades

### 1. Google Sign-In + Self-Service Blog Writing

> **Goal:** Any church member can sign up via Google and write blog posts without waiting for admin help. Admins review and approve before publishing.

#### 1.1 Authentication Expansion

- [x] Add **Google OAuth Provider** to NextAuth configuration
  - Register OAuth app in Google Cloud Console
  - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` env vars
  - Configure callback URL: `https://svchurch.co.uk/api/auth/callback/google`
- [ ] Add **Email Magic Link Provider** (passwordless sign-in option)
  - Integrate with Resend for sending magic link emails
  - Add `EMAIL_FROM` env var
- [x] Update `User` model in Prisma schema:
  ```prisma
  model User {
    // ... existing fields
    googleId    String?   @unique
    avatar      String?
    provider    String    @default("credentials") // "credentials" | "google" | "email"
  }
  ```
- [x] Create public sign-in page at `/sign-in` (separate from `/admin-login`)
  - Google sign-in button (prominent)
  - Email magic link option
  - Clean, welcoming UI — "Join our community and share your story"
- [x] Auto-assign `CONTRIBUTOR` role to new Google/email sign-ups
- [ ] Redirect new users to `/profile/setup` to complete their name/bio

#### 1.2 New Role: CONTRIBUTOR

- [x] Add `CONTRIBUTOR` to the Role enum in Prisma schema
- [x] Define CONTRIBUTOR permissions in `src/lib/permissions.ts`:
  ```
  CONTRIBUTOR: [
    'create_own_posts',
    'edit_own_posts',
    'delete_own_drafts',
    'view_own_posts'
  ]
  ```
- [x] Update RBAC checks in all blog API routes
- [x] Contributors can NOT: publish directly, edit others' posts, access admin panel

#### 1.3 Blog Post Moderation Workflow

- [x] Add status field to `BlogPost` model:
  ```prisma
  model BlogPost {
    // ... existing fields
    status       PostStatus  @default(DRAFT)
    reviewedBy   String?
    reviewNote   String?
    reviewedAt   DateTime?
  }

  enum PostStatus {
    DRAFT
    PENDING_REVIEW
    APPROVED
    PUBLISHED
    REJECTED
  }
  ```
- [x] Create migration for new fields
- [x] Update blog API routes:
  - `POST /api/blogs` — Contributors create posts (status: DRAFT)
  - `PATCH /api/blogs/[id]/submit` — Contributor submits for review (DRAFT → PENDING_REVIEW)
  - `PATCH /api/admin/blogs/[id]/review` — Admin approves/rejects (PENDING_REVIEW → APPROVED/REJECTED)
  - `PATCH /api/admin/blogs/[id]/publish` — Admin publishes (APPROVED → PUBLISHED)
- [ ] Email notifications:
  - Notify admins when a post is submitted for review
  - Notify contributor when their post is approved/rejected (with optional note)

#### 1.4 Public Blog Writing Interface

- [x] Create `/write` page (authenticated users only)
  - Full-screen writing experience (distraction-free, like Medium)
  - TipTap rich text editor (reuse existing `RichTextEditor.tsx`)
  - Title input with auto-slug generation
  - Featured image upload
  - Excerpt/summary field
  - Category/tag selection
  - "Save Draft" and "Submit for Review" buttons
  - Auto-save every 30 seconds to prevent data loss
- [x] Create `/write/[id]` for editing existing drafts
- [x] Create `/my-posts` page — user's dashboard showing:
  - All their posts grouped by status (Draft, Pending, Published, Rejected)
  - Edit/delete actions on drafts
  - View count on published posts
  - Rejection reason displayed for rejected posts

#### 1.5 Profile System

- [x] Create `/profile` page — public author profile
  - Display name, avatar, bio, join date
  - List of their published blog posts
  - Social links (optional)
- [x] Create `/profile/edit` page — edit own profile
  - Update name, bio, avatar
  - Change notification preferences
- [x] Add author card on blog post detail pages (avatar, name, bio snippet, link to profile)

#### 1.6 Admin Review Dashboard

- [x] Add "Pending Reviews" section to admin dashboard (`/admin`)
  - Count badge showing pending posts
  - Quick-access list of posts awaiting review
- [x] Create `/admin/blogs/review` page
  - List all PENDING_REVIEW posts
  - Preview post content
  - Approve with optional edit / Reject with required note
  - Bulk approve/reject actions
- [x] Add filter tabs to `/admin/blogs`: All | Published | Drafts | Pending Review | Rejected

---

### 2. Dark/Light Mode + Theme System

`[LATER]` — Deferred to future phase.

- [ ] Install `next-themes`
- [ ] Configure Tailwind `darkMode: 'class'`
- [ ] Define dark color tokens in `globals.css`
- [ ] Add toggle in Header (sun/moon icon)
- [ ] Store preference in localStorage + respect `prefers-color-scheme`
- [ ] Admin setting: set default site theme
- [ ] Dark mode for admin panel

---

### 3. Dynamic Homepage Hero Image + Content Management

> **Goal:** Admins can change the homepage hero image, text, and sections without a developer.

#### 3.1 Homepage Content API

- [ ] Define homepage sections in `PageContent` model:
  ```
  Sections:
    hero_slides       → JSON array of { image, title, subtitle, ctaText, ctaLink }
    welcome_title     → text
    welcome_text      → text
    welcome_image     → URL
    service_times     → JSON array of { day, time, label }
    cta_banner_title  → text
    cta_banner_text   → text
    cta_banner_link   → URL
  ```
- [ ] Create `GET /api/pages/home` — fetch all homepage content
- [ ] Create `PUT /api/admin/pages/home` — update homepage content (permission: `manage_settings`)

#### 3.2 Homepage Editor (Admin)

- [ ] Build `/admin/pages/home` editor page with sections:
  - **Hero Slides Manager**
    - Add/remove/reorder slides (drag-and-drop)
    - Each slide: image upload, title, subtitle, CTA button text & link
    - Preview carousel in editor
    - Min 1 slide, max 5 slides
  - **Welcome Section**
    - Title, body text (rich text), image upload
  - **Service Times**
    - Editable list of day/time/label rows
  - **CTA Banner**
    - Title, description, button text, button link
  - **Ministries Display**
    - Toggle show/hide, select which ministries to feature
  - **Gallery Preview**
    - Toggle show/hide, number of images to display
- [ ] Live preview panel (side-by-side or toggle)
- [ ] "Save" and "Reset to Default" buttons

#### 3.3 Homepage Frontend Updates

- [ ] Refactor `src/app/(public)/page.tsx` to fetch content from API/database instead of hardcoded values
- [ ] Implement hero image carousel with auto-rotation (5-second interval)
  - Smooth crossfade transitions (Framer Motion)
  - Navigation dots
  - Pause on hover
  - Swipe on mobile
- [ ] Add `priority` and proper `sizes` to hero images for fast loading
- [ ] Implement ISR (Incremental Static Regeneration) with `revalidate: 60`

---

### 4. Advanced SEO

> **Goal:** Maintain and improve rankings for "churches near Luton", "pentecostal church near me", etc.

#### 4.1 Technical SEO Foundations

- [ ] Create dynamic `sitemap.xml` at `src/app/sitemap.ts`:
  ```ts
  export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Include: static pages, blog posts, ministry pages, custom pages, events
    // Set changeFrequency and priority per page type
  }
  ```
- [ ] Create `robots.txt` at `src/app/robots.ts`:
  ```ts
  export default function robots(): MetadataRoute.Robots {
    return {
      rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
      sitemap: 'https://svchurch.co.uk/sitemap.xml',
    }
  }
  ```
- [ ] Add canonical URLs to all pages via metadata exports

#### 4.2 JSON-LD Structured Data

- [ ] Create `src/components/StructuredData.tsx` component
- [ ] Add **Church/LocalBusiness** schema to homepage:
  ```json
  {
    "@type": "Church",
    "name": "Spring Valley Church",
    "description": "...",
    "address": { "streetAddress": "...", "addressLocality": "Luton", ... },
    "geo": { "latitude": "...", "longitude": "..." },
    "telephone": "...",
    "openingHours": ["Su 10:00-12:30", "We 19:00-20:30", ...],
    "denomination": "Pentecostal",
    "url": "https://svchurch.co.uk",
    "sameAs": ["facebook URL", "youtube URL", "instagram URL"]
  }
  ```
- [ ] Add **Article** schema to blog posts (title, author, datePublished, image)
- [ ] Add **Event** schema to event pages (when events feature is built)
- [ ] Add **BreadcrumbList** schema to all interior pages
- [ ] Add **VideoObject** schema to sermon pages (when media library is complete)

#### 4.3 Per-Page Metadata

- [ ] Add dynamic `metadata` exports to every page:
  - Blog posts: title, excerpt as description, featured image as OG image
  - Ministry pages: name, subtitle as description, image
  - Custom pages: title, excerpt, hero image
  - Events: name, date, location, image
- [ ] Add `metaDescription` and `focusKeyword` fields to BlogPost model
- [ ] Add SEO fields to admin blog editor:
  - Meta description (with character count — target 150-160)
  - Focus keyword
  - SEO preview (Google SERP mockup)
- [ ] Generate Open Graph images dynamically using `@vercel/og`:
  - `/api/og?title=...&type=blog` → branded OG image with church logo + title

#### 4.4 Performance SEO (Core Web Vitals)

- [ ] Audit all `<Image>` components for proper `sizes` prop
- [ ] Add `priority` to above-the-fold images (hero, first visible section)
- [ ] Add `loading="lazy"` to below-fold images
- [ ] Preconnect to external origins:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
  ```
- [ ] Dynamic imports for heavy components:
  ```ts
  const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })
  ```
- [ ] Target: Lighthouse score **95+** on Performance, Accessibility, Best Practices, SEO

---

## PHASE 2: Feature Parity with WordPress

### 5. Events & Calendar System

> **Goal:** Replace WordPress events plugin. Church members can see upcoming events, add to calendar, and RSVP.

#### 5.1 Database Schema

- [ ] Add Event model to Prisma schema:
  ```prisma
  model Event {
    id            String    @id @default(cuid())
    title         String
    slug          String    @unique
    description   String
    content       String?   // rich text full description
    date          DateTime
    endDate       DateTime?
    time          String    // e.g., "10:00 AM - 12:00 PM"
    location      String
    address       String?
    image         String?
    category      String?   // "worship", "youth", "community", "conference"
    recurring     Boolean   @default(false)
    recurrenceRule String?  // iCal RRULE format
    registrationUrl String?
    maxAttendees  Int?
    published     Boolean   @default(false)
    featured      Boolean   @default(false)
    createdAt     DateTime  @default(now())
    updatedAt     DateTime  @updatedAt
    rsvps         EventRsvp[]
  }

  model EventRsvp {
    id        String   @id @default(cuid())
    eventId   String
    event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
    userId    String?
    name      String
    email     String
    status    String   @default("going") // "going", "maybe", "not_going"
    createdAt DateTime @default(now())

    @@unique([eventId, email])
  }
  ```

#### 5.2 API Routes

- [ ] `GET /api/events` — list upcoming published events (public)
- [ ] `GET /api/events/[slug]` — single event detail (public)
- [ ] `GET /api/events/ical` — iCal feed of all upcoming events
- [ ] `POST /api/events/[id]/rsvp` — RSVP to an event (public, rate-limited)
- [ ] `GET/POST/PUT/DELETE /api/admin/events` — CRUD (permission: `manage_events`)

#### 5.3 Public Pages

- [ ] Create `/events` page:
  - **List view** (default): upcoming events in chronological order
  - **Calendar view** (toggle): monthly calendar grid with event dots
  - Filter by category
  - Search by title
  - Past events archive section
- [ ] Create `/events/[slug]` detail page:
  - Hero image, title, date/time, location
  - Full description (rich text)
  - Google Maps embed for location
  - "Add to Google Calendar" button
  - "Download .ics" button
  - RSVP form (name, email, going/maybe)
  - Share buttons (WhatsApp, Facebook, Twitter, copy link)
  - Attendee count (if public)

#### 5.4 Admin Management

- [ ] Create `/admin/events` page:
  - List all events (upcoming and past)
  - Create/edit/delete events
  - Rich text editor for full description
  - Image upload
  - Category selection
  - Recurring event setup (weekly, monthly, yearly)
  - RSVP list view per event
  - Export RSVPs to CSV
  - Feature toggle (show on homepage)
- [ ] Add events count to admin dashboard stats

#### 5.5 Homepage Integration

- [ ] Add "Upcoming Events" section to homepage
- [ ] Show next 3 upcoming events with date, title, and "Learn More" link
- [ ] Auto-hide past events

---

### 6. Sermon/Media Library (Full Implementation)

> **Goal:** Replace WordPress sermon plugin. Complete the currently placeholder media centre.

#### 6.1 Enhanced Schema

- [ ] Update `SermonMedia` model:
  ```prisma
  model SermonMedia {
    // ... existing fields
    series      String?      // sermon series name
    seriesOrder Int?         // order within series
    topics      String[]     // tags: "faith", "prayer", "family"
    scripture   String?      // e.g., "Romans 8:28-39"
    duration    Int?         // seconds
    audioUrl    String?      // direct audio file URL
    transcript  String?      // full transcript text
    viewCount   Int          @default(0)
    seriesId    String?
    sermonSeries SermonSeries? @relation(fields: [seriesId], references: [id])
  }

  model SermonSeries {
    id          String         @id @default(cuid())
    title       String
    slug        String         @unique
    description String?
    image       String?
    order       Int            @default(0)
    sermons     SermonMedia[]
    createdAt   DateTime       @default(now())
    updatedAt   DateTime       @updatedAt
  }
  ```

#### 6.2 API Routes

- [ ] `GET /api/sermons` — list published sermons (paginated, filterable)
- [ ] `GET /api/sermons/[id]` — single sermon detail
- [ ] `GET /api/sermons/series` — list all sermon series
- [ ] `GET /api/sermons/series/[slug]` — sermons in a series
- [ ] `GET /api/sermons/rss` — RSS/podcast feed (Apple Podcasts compatible)
- [ ] `POST /api/admin/sermons/import-youtube` — bulk import from YouTube channel
- [ ] CRUD: `GET/POST/PUT/DELETE /api/admin/sermons`
- [ ] CRUD: `GET/POST/PUT/DELETE /api/admin/sermon-series`

#### 6.3 Public Pages

- [ ] Rebuild `/media-centre/media` page:
  - Sermon list with thumbnail, title, speaker, date, duration
  - Search by keyword (searches title, speaker, scripture, description)
  - Filter by: speaker, series, topic, date range
  - Sort by: newest, oldest, most viewed
  - Pagination (12 per page)
- [ ] Create `/media-centre/media/[id]` sermon detail page:
  - Embedded YouTube player (if video)
  - Audio player (if audio)
  - Speaker, date, scripture reference
  - Description / sermon notes
  - Transcript (collapsible)
  - Share buttons
  - "Next in series" / "Previous in series" navigation
- [ ] Create `/media-centre/media/series` page:
  - Grid of sermon series with cover image, title, sermon count
- [ ] Create `/media-centre/media/series/[slug]` page:
  - Series description + ordered list of sermons

#### 6.4 YouTube Integration

- [ ] Create YouTube import service (`src/lib/youtube.ts`):
  - Fetch channel videos via YouTube Data API v3
  - Auto-populate: title, description, thumbnail, youtubeId, date, duration
  - Match speaker from video description or title pattern
- [ ] Admin UI: "Import from YouTube" button
  - Shows list of channel videos not yet imported
  - Bulk select and import
  - Manual field override before import

#### 6.5 Podcast RSS Feed

- [ ] Generate RSS feed at `/api/sermons/rss` compatible with:
  - Apple Podcasts
  - Spotify
  - Google Podcasts
- [ ] Include: title, description, audio enclosure, duration, date, series
- [ ] Add podcast subscription links on media page

#### 6.6 Admin Management

- [ ] Enhance `/admin/media` page:
  - Tabs: All Sermons | Series | Import
  - Sermon CRUD with rich text for notes
  - Series CRUD with image and ordering
  - YouTube import wizard
  - View count stats
  - Bulk actions (publish, unpublish, delete, assign to series)

---

### 7. Newsletter/Email System

> **Goal:** Replace WordPress newsletter plugins. Build subscriber list and send updates.

#### 7.1 Database Schema

- [ ] Add models:
  ```prisma
  model Subscriber {
    id            String    @id @default(cuid())
    email         String    @unique
    name          String?
    active        Boolean   @default(true)
    verifiedAt    DateTime?
    unsubscribedAt DateTime?
    preferences   Json?     // { blogs: true, events: true, newsletter: true }
    source        String    @default("website") // "website", "import", "admin"
    createdAt     DateTime  @default(now())
    updatedAt     DateTime  @updatedAt
  }

  model Newsletter {
    id          String   @id @default(cuid())
    subject     String
    content     String   // HTML content
    sentAt      DateTime?
    sentBy      String?
    recipientCount Int   @default(0)
    openCount   Int      @default(0)
    clickCount  Int      @default(0)
    status      String   @default("draft") // "draft", "scheduled", "sending", "sent"
    scheduledAt DateTime?
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
  }
  ```

#### 7.2 Subscription Flow

- [ ] Create subscription form component (reusable):
  - Email input + "Subscribe" button
  - Place in: footer, blog post sidebar, dedicated `/subscribe` page
- [ ] `POST /api/subscribe` — public endpoint (rate-limited):
  - Validate email
  - Send verification email via Resend
  - Create subscriber record (unverified)
- [ ] `GET /api/subscribe/verify?token=...` — verify email address
- [ ] `GET /api/unsubscribe?token=...` — one-click unsubscribe
- [ ] Create `/subscribe` landing page with value proposition

#### 7.3 Newsletter Sending

- [ ] Integrate **Resend** (`resend` npm package):
  - Add `RESEND_API_KEY` env var
  - Create email templates (HTML):
    - Welcome email (on subscription)
    - New blog post notification
    - Weekly digest
    - Custom newsletter
    - Event announcement
- [ ] Create email sending service (`src/lib/email.ts`):
  - Send individual emails
  - Send bulk emails (batched, rate-limited)
  - Track opens/clicks via Resend webhooks

#### 7.4 Auto-Notifications

- [ ] Trigger email when new blog post is published:
  - To all subscribers with `preferences.blogs = true`
  - Include: title, excerpt, featured image, "Read More" link
- [ ] Trigger email when new event is created:
  - To all subscribers with `preferences.events = true`
- [ ] Weekly digest (optional, cron job):
  - Summary of posts published that week
  - Upcoming events for next week
  - Use Vercel Cron or external cron service

#### 7.5 Admin Newsletter Management

- [ ] Create `/admin/newsletters` page:
  - List all newsletters (sent and draft)
  - Create new newsletter with rich text editor
  - Preview email before sending
  - Send test email to admin
  - Schedule send for later
  - View stats: sent count, open rate, click rate
- [ ] Create `/admin/subscribers` page:
  - List all subscribers (active, unsubscribed)
  - Search/filter
  - Export to CSV
  - Import from CSV (migrate from WordPress)
  - Manual add subscriber
  - Subscriber count on admin dashboard

---

### 8. Photo Gallery 2.0

> **Goal:** Replace WordPress gallery plugins with albums, lightbox, and better UX.

#### 8.1 Database Schema Updates

- [ ] Add Album model:
  ```prisma
  model GalleryAlbum {
    id          String         @id @default(cuid())
    title       String
    slug        String         @unique
    description String?
    coverImage  String?
    order       Int            @default(0)
    published   Boolean        @default(true)
    images      GalleryImage[]
    createdAt   DateTime       @default(now())
    updatedAt   DateTime       @updatedAt
  }
  ```
- [ ] Update `GalleryImage` model:
  ```prisma
  model GalleryImage {
    // ... existing fields
    albumId     String?
    album       GalleryAlbum?  @relation(fields: [albumId], references: [id])
    alt         String?        // accessibility
    width       Int?
    height      Int?
    blurDataUrl String?        // base64 blur placeholder
  }
  ```

#### 8.2 Public Gallery Pages

- [ ] Rebuild `/media-centre/gallery` page:
  - **Albums grid** (default view): album covers with title and image count
  - **All photos** view: masonry grid of all images
  - Filter by album
- [ ] Create `/media-centre/gallery/[slug]` album page:
  - Album title, description
  - Masonry grid of album photos
  - Image count
- [ ] **Lightbox viewer** component:
  - Full-screen overlay
  - Previous/next navigation (arrow keys + swipe)
  - Image caption display
  - Download button
  - Share button
  - Close on Escape key or click outside
  - Preload adjacent images
  - Zoom support (pinch on mobile)
- [ ] **Slideshow mode** button:
  - Auto-advance every 5 seconds
  - Full-screen
  - Pause/play controls
  - Useful for displaying during church events

#### 8.3 Image Upload Enhancements

- [ ] **Bulk upload**: Drag-and-drop multiple files at once
- [ ] **Auto-compression**: Resize large images (max 2000px width) before upload
- [ ] **Generate blur placeholder**: Create base64 blur-up placeholders for each image
- [ ] **Extract dimensions**: Store width/height for proper aspect ratio rendering
- [ ] **Progress indicator**: Show upload progress for each file

#### 8.4 Admin Gallery Management

- [ ] Enhance `/admin/gallery` page:
  - Tabs: Albums | All Images
  - Album CRUD (title, description, cover image)
  - Drag images between albums
  - Bulk select: move to album, delete, reorder
  - Drag-and-drop reordering within albums
  - Caption editing (inline)
  - Bulk upload with album assignment

---

## PHASE 3: Innovative Features

### 9. Giving/Donations Integration

`[LATER]` — Deferred to future phase.

- [ ] Stripe integration for one-time and recurring donations
- [ ] Multiple giving categories (tithes, missions, building fund)
- [ ] Gift Aid declaration (UK-specific)
- [ ] QR code for mobile giving
- [ ] Dedicated `/give` page
- [ ] Admin giving summary dashboard

---

### 10. Real-Time Features with Server-Sent Events

`[LATER]` — Deferred to future phase.

- [ ] Live prayer wall at `/prayer`
- [ ] Live service notes during sermons
- [ ] Site-wide announcement banner (instant, no redeploy)

---

### 11. Multi-Language Support (i18n)

`[LATER]` — Deferred to future phase.

- [ ] Install `next-intl`
- [ ] Start with English + 2-3 congregation languages
- [ ] Blog post translations
- [ ] Language switcher in header
- [ ] Auto-detect browser language

---

### 12. Progressive Web App (PWA)

> **Goal:** Church members can "install" the website on their phone like an app.

#### 12.1 PWA Setup

- [ ] Install and configure `next-pwa` (or `@ducanh2912/next-pwa` for Next.js 14)
- [ ] Create `manifest.json`:
  ```json
  {
    "name": "Spring Valley Church",
    "short_name": "SVC",
    "description": "The Valley of New Birth — Luton",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#1e232b",
    "theme_color": "#ab815a",
    "icons": [
      { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
    ]
  }
  ```
- [ ] Generate app icons (192x192, 512x512, apple-touch-icon)
- [ ] Configure service worker:
  - Cache static assets (CSS, JS, fonts, images)
  - Cache key pages for offline: home, about, contact, service times
  - Network-first strategy for dynamic content (blogs, events)

#### 12.2 Offline Support

- [ ] Offline fallback page (`/offline`) — displays:
  - Church name and logo
  - Service times
  - Contact phone number
  - Address
  - "You're offline — connect to the internet for full access"
- [ ] Cache last-viewed blog posts and sermons for offline reading

#### 12.3 Push Notifications (Phase 2 of PWA)

- [ ] Implement Web Push API:
  - Generate VAPID keys
  - Add `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` env vars
- [ ] Create `PushSubscription` model:
  ```prisma
  model PushSubscription {
    id        String   @id @default(cuid())
    userId    String?
    endpoint  String   @unique
    p256dh    String
    auth      String
    createdAt DateTime @default(now())
  }
  ```
- [ ] Notification opt-in prompt (non-intrusive, after 2nd visit)
- [ ] Send push notifications for:
  - New blog posts
  - Upcoming events (24-hour reminder)
  - Important announcements
- [ ] Admin UI: Send custom push notification to all subscribers

---

### 13. AI-Powered Features

`[LATER]` — Deferred to future phase.

- [ ] Smart search across all content (vector search)
- [ ] Blog writing assistant for contributors
- [ ] Auto-tagging for blog posts
- [ ] Sermon auto-transcription (Whisper API)
- [ ] "Ask about our church" chatbot widget

---

### 14. Community Features

`[LATER]` — Deferred to future phase.

- [ ] Member directory (opt-in)
- [ ] Small groups browser and sign-up
- [ ] Volunteer sign-up and scheduling
- [ ] Testimonies page (moderated)
- [ ] Blog post comments/discussions

---

### 15. Analytics Dashboard (Admin)

> **Goal:** Replace WordPress analytics plugins with a clean, privacy-friendly dashboard.

#### 15.1 Analytics Integration

- [ ] Install `@vercel/analytics` (zero-config with Vercel):
  ```tsx
  // src/app/layout.tsx
  import { Analytics } from '@vercel/analytics/react'
  export default function RootLayout({ children }) {
    return (
      <html>
        <body>
          {children}
          <Analytics />
        </body>
      </html>
    )
  }
  ```
- [ ] Install `@vercel/speed-insights` for Core Web Vitals tracking
- [ ] No cookie banner needed (Vercel Analytics is cookieless and GDPR-compliant)

#### 15.2 Custom Analytics Tracking

- [ ] Create `PageView` model for internal analytics:
  ```prisma
  model PageView {
    id        String   @id @default(cuid())
    path      String
    referrer  String?
    userAgent String?
    country   String?
    createdAt DateTime @default(now())

    @@index([path, createdAt])
    @@index([createdAt])
  }
  ```
- [ ] Create lightweight tracking API: `POST /api/track` (fire-and-forget, no blocking)
- [ ] Track blog post views: increment `viewCount` on BlogPost model
- [ ] Track sermon views: increment `viewCount` on SermonMedia model

#### 15.3 Admin Analytics Dashboard

- [ ] Create `/admin/analytics` page with:
  - **Overview cards**: Total page views (7d, 30d), unique visitors, top pages
  - **Blog performance**: Views per post, most popular posts, publish frequency
  - **Sermon performance**: Most watched/listened sermons
  - **Contact form**: Submissions per week, read/unread ratio
  - **Subscriber growth**: New subscribers over time
  - **Traffic sources**: Referrer breakdown
  - **Geographic data**: Visitor countries (from Vercel Analytics API)
- [ ] Time range selector: Last 7 days, 30 days, 90 days, year
- [ ] Charts using a lightweight library (e.g., `recharts` or `chart.js`)
- [ ] Add "View Analytics" link in admin sidebar

---

## PHASE 4: Performance & Infrastructure

### 16. Speed Optimizations

> **Goal:** Lighthouse 95+ across all metrics. Significantly faster than WordPress.

#### 16.1 Static Generation & Caching

- [ ] Implement ISR (Incremental Static Regeneration) for:
  - Homepage: `revalidate: 60` (rebuilds every 60 seconds)
  - Blog listing: `revalidate: 60`
  - Blog posts: `revalidate: 300` (5 minutes)
  - Ministry pages: `revalidate: 3600` (1 hour)
  - Events listing: `revalidate: 60`
- [ ] Use `generateStaticParams` for blog/ministry/event detail pages (pre-render at build)
- [ ] Add **Redis caching** (Upstash, free tier) for:
  - Site settings (avoid DB query on every page load)
  - Navigation menu items
  - Homepage content
  - Cache key pattern: `svc:settings`, `svc:nav`, `svc:home`
  - Invalidate on admin update

#### 16.2 Image Optimization

- [ ] Install `sharp` for server-side image processing
- [ ] On upload, generate multiple sizes: thumbnail (300px), medium (800px), large (1600px)
- [ ] Store blur placeholder data URL for each image
- [ ] Use `next/image` with proper `sizes` attribute everywhere:
  ```tsx
  <Image
    src={post.image}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    placeholder="blur"
    blurDataURL={post.blurDataUrl}
  />
  ```
- [ ] Serve images as WebP/AVIF automatically (Vercel does this)

#### 16.3 Bundle Optimization

- [ ] Audit bundle with `@next/bundle-analyzer`:
  ```bash
  ANALYZE=true npm run build
  ```
- [ ] Dynamic imports for heavy components:
  - TipTap editor (only loaded on write/admin pages)
  - Framer Motion animations (only on pages that use them)
  - Calendar component (only on events page)
  - Chart library (only on analytics page)
- [ ] Tree-shake unused Lucide icons (import individually, not from barrel)
- [ ] Minimize client-side JavaScript: prefer Server Components (default in Next.js 14)

#### 16.4 Database Performance

- [ ] Add database indexes for common queries:
  ```prisma
  @@index([published, publishedAt])  // blog listing
  @@index([published, date])         // event listing
  @@index([published, seriesId])     // sermon listing
  @@index([active, createdAt])       // subscriber listing
  ```
- [ ] Use Prisma `select` to fetch only needed fields (avoid fetching full content for list views)
- [ ] Connection pooling: use Neon's pooled connection string (`-pooler` suffix)

#### 16.5 Monitoring

- [ ] Set up Vercel Speed Insights for real-user Core Web Vitals
- [ ] Create `/api/health` endpoint for uptime monitoring
- [ ] Alert on Lighthouse score drops (can configure in Vercel dashboard)

---

### 17. Deployment & DevOps

`[LATER]` — Deferred to future phase.

- [ ] Preview deployments per PR
- [ ] Database branching (Neon) for testing migrations
- [ ] Staging vs production environments
- [ ] Automated database backups and export

---

## Technology Additions Summary

### Install Now (for active phases)

```bash
# Authentication
# (Google provider is built into next-auth, just configure)

# Email
npm install resend

# PWA
npm install @ducanh2912/next-pwa

# Analytics
npm install @vercel/analytics @vercel/speed-insights

# Image processing
npm install sharp

# Charts (for analytics dashboard)
npm install recharts

# OG image generation
npm install @vercel/og

# Caching
npm install @upstash/redis

# Bundle analysis
npm install -D @next/bundle-analyzer
```

### Install Later (for deferred phases)

```bash
# Theme
npm install next-themes

# i18n
npm install next-intl

# Payments
npm install stripe @stripe/stripe-js

# AI
npm install openai ai
```

---

## New Environment Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=noreply@svchurch.co.uk

# YouTube API (for sermon import)
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=

# Push Notifications (VAPID)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@svchurch.co.uk

# Caching (Upstash Redis)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Analytics (if using custom)
VERCEL_ANALYTICS_ID=
```

---

## Database Migration Plan

All schema changes should be applied incrementally:

1. **Migration 1:** User model updates (googleId, avatar, provider)
2. **Migration 2:** BlogPost status workflow (status enum, reviewedBy, reviewNote)
3. **Migration 3:** Event and EventRsvp models
4. **Migration 4:** SermonSeries model + SermonMedia updates
5. **Migration 5:** Subscriber and Newsletter models
6. **Migration 6:** GalleryAlbum model + GalleryImage updates
7. **Migration 7:** PageView model (analytics)
8. **Migration 8:** PushSubscription model

Run each migration with:
```bash
npx prisma migrate dev --name <migration-name>
```

---

## File Structure (New additions)

```
src/
├── app/
│   ├── (public)/
│   │   ├── events/
│   │   │   ├── page.tsx              # Events listing + calendar
│   │   │   └── [slug]/page.tsx       # Event detail
│   │   ├── subscribe/page.tsx        # Newsletter subscription
│   │   ├── write/
│   │   │   ├── page.tsx              # Blog writing interface
│   │   │   └── [id]/page.tsx         # Edit draft
│   │   ├── my-posts/page.tsx         # User's blog dashboard
│   │   ├── profile/
│   │   │   ├── page.tsx              # Public profile
│   │   │   └── edit/page.tsx         # Edit profile
│   │   ├── sign-in/page.tsx          # Public sign-in (Google + email)
│   │   └── media-centre/
│   │       └── gallery/
│   │           └── [slug]/page.tsx   # Album detail
│   ├── admin/
│   │   ├── analytics/page.tsx        # Analytics dashboard
│   │   ├── events/
│   │   │   ├── page.tsx              # Manage events
│   │   │   └── [id]/page.tsx         # Edit event
│   │   ├── newsletters/
│   │   │   ├── page.tsx              # Manage newsletters
│   │   │   └── [id]/page.tsx         # Edit newsletter
│   │   ├── subscribers/page.tsx      # Manage subscribers
│   │   └── sermon-series/page.tsx    # Manage series
│   ├── api/
│   │   ├── events/
│   │   │   ├── route.ts              # Public events API
│   │   │   ├── [slug]/route.ts       # Single event
│   │   │   ├── [id]/rsvp/route.ts    # RSVP endpoint
│   │   │   └── ical/route.ts         # iCal feed
│   │   ├── sermons/
│   │   │   ├── route.ts              # Public sermons API
│   │   │   ├── [id]/route.ts         # Single sermon
│   │   │   └── rss/route.ts          # Podcast RSS feed
│   │   ├── subscribe/
│   │   │   ├── route.ts              # Subscribe endpoint
│   │   │   └── verify/route.ts       # Email verification
│   │   ├── unsubscribe/route.ts      # Unsubscribe
│   │   ├── track/route.ts            # Analytics tracking
│   │   ├── og/route.tsx              # Dynamic OG images
│   │   ├── blogs/
│   │   │   └── [id]/
│   │   │       └── submit/route.ts   # Submit for review
│   │   └── admin/
│   │       ├── events/route.ts
│   │       ├── sermons/route.ts
│   │       ├── sermon-series/route.ts
│   │       ├── newsletters/route.ts
│   │       ├── subscribers/route.ts
│   │       └── blogs/
│   │           └── [id]/
│   │               └── review/route.ts  # Approve/reject
│   ├── sitemap.ts                    # Dynamic sitemap
│   ├── robots.ts                     # Robots.txt
│   └── manifest.ts                   # PWA manifest
├── components/
│   ├── StructuredData.tsx            # JSON-LD component
│   ├── Lightbox.tsx                  # Gallery lightbox viewer
│   ├── SubscribeForm.tsx             # Newsletter subscription form
│   ├── EventCalendar.tsx             # Calendar view component
│   ├── AudioPlayer.tsx               # Sermon audio player
│   ├── SEOPreview.tsx                # Google SERP preview in editor
│   └── ShareButtons.tsx              # Social share buttons
├── lib/
│   ├── email.ts                      # Resend email service
│   ├── youtube.ts                    # YouTube API integration
│   ├── cache.ts                      # Redis caching helpers
│   └── analytics.ts                  # Tracking helpers
└── ...
```

---

## Implementation Priority (Active Items)

| Order | Feature | Est. Complexity | Dependencies |
|-------|---------|-----------------|--------------|
| 1 | Google Sign-In + Self-Service Blogs | High | Prisma migration, NextAuth config |
| 2 | Dynamic Homepage Editor | Medium | PageContent API |
| 3 | Advanced SEO (sitemap, structured data) | Medium | None |
| 4 | Events & Calendar | High | Prisma migration |
| 5 | Sermon/Media Library | High | Prisma migration, YouTube API key |
| 6 | Photo Gallery 2.0 | Medium | Prisma migration |
| 7 | Newsletter/Email System | High | Resend API key |
| 8 | Analytics Dashboard | Medium | Vercel Analytics |
| 9 | PWA | Medium | Icons, manifest |
| 10 | Speed Optimizations | Medium | Redis (Upstash), sharp |

---

*This document is the single source of truth for all planned enhancements. Update checkboxes as features are completed.*

# Backend Infrastructure

## Overview
This project uses Supabase (PostgreSQL) as the database and Next.js API routes for the backend.

## Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Run the migration in `supabase/migrations/001_initial_schema.sql` via the SQL Editor
3. Copy your project URL and API keys

### 2. Environment Variables
Add these to your `.env.local` (and Vercel dashboard):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NOTIFICATION_EMAIL=admin@yourdomain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Install Dependencies
```bash
npm install @supabase/supabase-js bcryptjs uuid
npm install -D @types/bcryptjs @types/uuid
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout (clears session)
- `GET /api/auth/me` - Get current user

### Blog Posts
- `GET /api/blog` - List published posts (paginated)
- `POST /api/blog` - Create post (admin only)
- `GET /api/blog/[slug]` - Get single post
- `PUT /api/blog/[slug]` - Update post (admin only)
- `DELETE /api/blog/[slug]` - Delete post (admin only)
- `POST /api/blog/[slug]/publish` - Publish/unpublish post (admin only)
  - Body: `{ "action": "publish" | "unpublish" }`

### Contact Form
- `POST /api/contact` - Submit contact form
  - Body: `{ name, email, subject, message, honeypot, submittedAt }`
- `GET /api/contact` - List submissions (admin only)

## Security Features
- **Rate Limiting**: IP-based rate limiting stored in DB
- **Spam Detection**: Honeypot field + keyword/pattern analysis
- **Password Hashing**: bcrypt with 12 rounds
- **Session Tokens**: UUID-based tokens with 7-day expiry
- **HTTP-only Cookies**: Auth tokens stored securely
- **Admin Middleware**: Route protection for /admin paths
- **Input Validation**: All inputs validated server-side

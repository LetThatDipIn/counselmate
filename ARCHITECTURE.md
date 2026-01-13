# CounselMate Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CounselMate Platform                     │
└─────────────────────────────────────────────────────────────┘

┌───────────────────────┐          ┌───────────────────────┐
│   Frontend (Next.js)  │  ←────→  │   Backend (Go/Gin)    │
│   Port: 3000          │   HTTP   │   Port: 8080          │
│   TypeScript + React  │   REST   │   PostgreSQL          │
└───────────────────────┘          └───────────────────────┘
         │                                    │
         │                                    │
         ↓                                    ↓
┌───────────────────────┐          ┌───────────────────────┐
│   User's Browser      │          │   OpenAI API          │
│   (Chrome, Safari)    │          │   (AI Features)       │
└───────────────────────┘          └───────────────────────┘
```

## Frontend Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Next.js Application                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────┐  ┌─────────────┐  ┌────────────────┐   │
│  │   Pages    │  │ Components  │  │  API Client    │   │
│  │            │  │             │  │                │   │
│  │ • Home     │  │ • Navigation│  │ • auth.ts      │   │
│  │ • Login    │  │ • ProfileCard│  │ • profiles.ts │   │
│  │ • Register │  │ • SearchBar │  │ • search.ts    │   │
│  │ • Profile  │  │ • Forms     │  │ • users.ts     │   │
│  │ • Search   │  │ • Dialogs   │  │ • ai.ts        │   │
│  └────────────┘  └─────────────┘  └────────────────┘   │
│                                                           │
│  ┌────────────┐  ┌─────────────┐  ┌────────────────┐   │
│  │  Context   │  │   Hooks     │  │   Utils        │   │
│  │            │  │             │  │                │   │
│  │ • Auth     │  │ • useProfile│  │ • types.ts     │   │
│  │ • Theme    │  │ • useSearch │  │ • utils.ts     │   │
│  └────────────┘  └─────────────┘  └────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
```
User → Register Page → API Client → POST /auth/register → Backend
                                                              │
                                                              ↓
                                              Create User + Send Email
                                                              │
                                                              ↓
Backend → JWT Token → API Client → localStorage → Auth Context
                                                       │
                                                       ↓
                                              Update UI (Show user info)
```

### Profile Search Flow
```
User → Professionals Page → Enter Search + Filters
                                      │
                                      ↓
                            useProfileSearch Hook
                                      │
                                      ↓
                          GET /search?query=tax&profession=CA
                                      │
                                      ↓
                              Backend Searches DB
                                      │
                                      ↓
                           Return Profiles Array
                                      │
                                      ↓
                         Display Results with Cards
```

### Profile Creation Flow
```
User → Profile Page → Fill Form → Click AI Suggestions (optional)
                                           │
                                           ↓
                                 POST /ai/suggest-tags
                                           │
                                           ↓
                                  OpenAI Generates Tags
                                           │
                                           ↓
                              Add Tags to Skills Field
                                           │
                                           ↓
User → Submit Form → POST /profiles → Backend Saves → Redirect to Public Profile
```

## API Endpoints Mapping

### Authentication
```
Frontend                    Backend
─────────────────────────────────────────────
/auth/login        →        POST /api/auth/login
/auth/register     →        POST /api/auth/register
Auth Context       →        GET /api/auth/me
                   →        POST /api/auth/refresh
                   →        POST /api/auth/logout
                   →        POST /api/auth/verify-email
                   →        POST /api/auth/forgot-password
                   →        POST /api/auth/reset-password
```

### Profiles
```
Frontend                    Backend
─────────────────────────────────────────────
/profile           →        POST /api/profiles
/profile           →        PUT /api/profiles
/profile           →        GET /api/profiles/me
/professionals     →        GET /api/profiles/search
/professionals/[id]→        GET /api/profiles/:id
Contact Dialog     →        POST /api/profiles/:id/contact
```

### Search
```
Frontend                    Backend
─────────────────────────────────────────────
Search Filters     →        GET /api/search
Auto-complete      →        GET /api/search/suggestions
Filter Options     →        GET /api/search/tags
```

### AI Features
```
Frontend                    Backend
─────────────────────────────────────────────
Profile Editor     →        POST /api/ai/suggest-tags
```

### Subscriptions
```
Frontend                    Backend
─────────────────────────────────────────────
Settings Page      →        GET /api/subscription
Usage Stats        →        GET /api/subscription/usage
Upgrade Button     →        POST /api/subscription/upgrade
Downgrade Button   →        POST /api/subscription/downgrade
```

## State Management

```
┌─────────────────────────────────────────┐
│          Application State              │
├─────────────────────────────────────────┤
│                                         │
│  AuthContext (Global)                   │
│  ├─ user: User | null                   │
│  ├─ isAuthenticated: boolean            │
│  ├─ loading: boolean                    │
│  ├─ login()                             │
│  ├─ register()                          │
│  ├─ logout()                            │
│  └─ refreshUser()                       │
│                                         │
│  Component State (Local)                │
│  ├─ Form data                           │
│  ├─ Loading states                      │
│  ├─ Error states                        │
│  └─ UI states                           │
│                                         │
│  Server State (React Query-like)        │
│  ├─ useProfile()                        │
│  ├─ useProfileSearch()                  │
│  ├─ useSubscription()                   │
│  └─ useTags()                           │
│                                         │
└─────────────────────────────────────────┘
```

## Security Flow

```
┌──────────────────────────────────────────────────────┐
│                  Security Layers                      │
├──────────────────────────────────────────────────────┤
│                                                       │
│  1. HTTPS (Production)                               │
│     └─ All traffic encrypted                         │
│                                                       │
│  2. JWT Authentication                               │
│     ├─ Access Token (15min)                          │
│     └─ Refresh Token (7 days)                        │
│                                                       │
│  3. CORS Protection                                  │
│     └─ Only allowed origins                          │
│                                                       │
│  4. Rate Limiting (Backend)                          │
│     ├─ Auth: Special rate limit                      │
│     ├─ AI: Plan-based limits                         │
│     └─ General: 100 req/min                          │
│                                                       │
│  5. Input Validation                                 │
│     ├─ Frontend: React Hook Form + Zod              │
│     └─ Backend: Gin validators                       │
│                                                       │
│  6. SQL Injection Protection                         │
│     └─ GORM ORM (parameterized queries)             │
│                                                       │
│  7. XSS Protection                                   │
│     └─ React auto-escaping                          │
│                                                       │
└──────────────────────────────────────────────────────┘
```

## User Roles & Permissions

```
┌────────────────────────────────────────────────┐
│                 APPRENTICE                      │
│  (Client / User looking for professionals)     │
├────────────────────────────────────────────────┤
│  ✅ Browse professionals                       │
│  ✅ Search and filter                          │
│  ✅ View profiles                              │
│  ✅ Contact professionals                      │
│  ✅ Manage own account                         │
│  ❌ Create professional profile                │
│  ❌ AI features (limited)                      │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│               PROFESSIONAL                      │
│  (CA, Lawyer, etc. offering services)          │
├────────────────────────────────────────────────┤
│  ✅ All APPRENTICE permissions                 │
│  ✅ Create/edit professional profile           │
│  ✅ Receive contact requests                   │
│  ✅ AI tag suggestions                         │
│  ✅ View analytics (planned)                   │
│  ✅ Manage subscription                        │
│  ❌ Access admin features                      │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│                    ADMIN                        │
│  (Platform administrators)                     │
├────────────────────────────────────────────────┤
│  ✅ All PROFESSIONAL permissions               │
│  ✅ Manage all users                           │
│  ✅ Delete users/profiles                      │
│  ✅ View platform analytics                    │
│  ✅ Verify professionals                       │
│  ✅ Moderate content                           │
└────────────────────────────────────────────────┘
```

## Subscription Plans

```
┌───────────────────────┬────────────────────────┐
│         FREE          │       PREMIUM          │
├───────────────────────┼────────────────────────┤
│ • 5 AI queries/day    │ • 100 AI queries/day   │
│ • 10 contacts/day     │ • 50 contacts/day      │
│ • Basic search        │ • Advanced search      │
│ • Profile listing     │ • Profile boost        │
│ • ₹0/month           │ • ₹999/month (planned) │
└───────────────────────┴────────────────────────┘
```

## Technology Stack Details

### Frontend Stack
```
┌────────────────────────────────────┐
│  Next.js 14 (App Router)           │
│  ├─ React 19                       │
│  ├─ TypeScript 5                   │
│  ├─ Tailwind CSS 4                 │
│  └─ Server Components              │
├────────────────────────────────────┤
│  UI Framework                      │
│  ├─ Shadcn UI                      │
│  ├─ Radix UI (primitives)          │
│  └─ Lucide React (icons)           │
├────────────────────────────────────┤
│  State & Data                      │
│  ├─ React Context                  │
│  ├─ Custom Hooks                   │
│  └─ localStorage (tokens)          │
├────────────────────────────────────┤
│  Forms & Validation                │
│  ├─ React Hook Form                │
│  └─ Zod                            │
├────────────────────────────────────┤
│  Developer Experience              │
│  ├─ ESLint                         │
│  ├─ Prettier (via Tailwind)        │
│  └─ TypeScript strict mode         │
└────────────────────────────────────┘
```

### Backend Stack (for reference)
```
┌────────────────────────────────────┐
│  Go 1.21+                          │
│  ├─ Gin (Web framework)            │
│  ├─ GORM (ORM)                     │
│  └─ PostgreSQL                     │
├────────────────────────────────────┤
│  Authentication                    │
│  ├─ JWT tokens                     │
│  └─ OAuth 2.0 (Google)             │
├────────────────────────────────────┤
│  AI Integration                    │
│  └─ OpenAI API                     │
├────────────────────────────────────┤
│  Email                             │
│  └─ SMTP                           │
└────────────────────────────────────┘
```

## Development Workflow

```
1. Local Development
   ├─ Backend: localhost:8080
   └─ Frontend: localhost:3000

2. Code Changes
   ├─ Edit TypeScript files
   ├─ Hot reload (Next.js)
   └─ Test in browser

3. API Integration
   ├─ Update types if backend changes
   ├─ Update API functions
   └─ Test endpoints

4. Build & Deploy
   ├─ pnpm build
   ├─ Test production build
   └─ Deploy to hosting
```

## Future Enhancements

```
Phase 1 (Current) ✅
├─ Authentication
├─ Profile management
├─ Search & filters
├─ AI suggestions
└─ Basic subscription

Phase 2 (Planned)
├─ Real-time messaging
├─ Calendar & booking
├─ Payment integration
├─ Reviews & ratings
└─ Advanced analytics

Phase 3 (Future)
├─ Mobile app
├─ Video consultations
├─ Document sharing
├─ Team collaboration
└─ API for third parties
```

---

**Architecture Status**: ✅ Production Ready  
**Integration**: ✅ Complete  
**Documentation**: ✅ Comprehensive

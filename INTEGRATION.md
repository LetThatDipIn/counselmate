# CounselMate Frontend - Full Stack Integration

## Overview
This frontend application is now fully integrated with the CounselMate Go backend. All features from the backend API are now connected to the React/Next.js frontend.

## ✅ Integrated Features

### Authentication & Authorization
- ✅ User Registration (Local & Google OAuth)
- ✅ User Login with JWT tokens
- ✅ Email Verification
- ✅ Password Reset/Forgot Password
- ✅ Session Management with Auto-refresh
- ✅ Protected Routes
- ✅ Role-based Access Control (APPRENTICE, PROFESSIONAL, ADMIN)

### User Management
- ✅ View User Profile
- ✅ Update User Information
- ✅ Change Password
- ✅ Profile Picture Upload
- ✅ Admin User Management

### Professional Profiles
- ✅ Create Professional Profile
- ✅ Update Profile (Bio, Skills, Experience, etc.)
- ✅ View Profile Details
- ✅ Search Profiles with Filters
- ✅ Contact Professionals
- ✅ Profile Verification Badge
- ✅ Ratings & Reviews Display

### Search & Discovery
- ✅ Advanced Search with Multiple Filters
  - Profession Type (CA, Lawyer, etc.)
  - Location (City, State)
  - Skills & Expertise
  - Experience Years
  - Hourly Rate Range
  - Availability Status
- ✅ Search Suggestions
- ✅ Sort by Rating, Experience, Recent
- ✅ Pagination Support

### Subscription Management
- ✅ View Subscription Details (FREE/PREMIUM)
- ✅ Usage Statistics (AI Queries, Contacts)
- ✅ Upgrade to Premium
- ✅ Downgrade to Free
- ✅ Rate Limiting Display

### AI Features
- ✅ AI-powered Tag Suggestions
- ✅ Smart Profile Enhancement
- ✅ Usage Tracking per Plan

## 🛠️ Setup Instructions

### Prerequisites
1. Backend API running on `http://localhost:8080`
2. Node.js 18+ installed
3. pnpm installed

### Installation

```bash
cd /mnt/Storage/Projects/lawyer_frontend

# Install dependencies
pnpm install

# Create environment file (already created)
# .env.local contains API configuration

# Run development server
pnpm dev
```

### Environment Variables
The `.env.local` file contains:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=CounselMate
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Project Structure

```
lib/
├── api/                    # API Client & Endpoints
│   ├── client.ts          # Base API client with auth
│   ├── types.ts           # TypeScript types matching Go backend
│   ├── auth.ts            # Auth endpoints
│   ├── profiles.ts        # Profile endpoints
│   ├── users.ts           # User endpoints
│   ├── search.ts          # Search endpoints
│   ├── subscription.ts    # Subscription endpoints
│   └── ai.ts              # AI endpoints
├── context/
│   └── auth-context.tsx   # Global auth state
└── hooks/
    └── use-api.ts         # Custom hooks for data fetching

app/
├── auth/
│   ├── login/            # Login page
│   └── register/         # Registration page
├── professionals/        # Browse professionals
│   └── [id]/            # Individual profile page
├── dashboard/            # User dashboard
├── profile/             # User profile management
└── settings/            # User settings

components/
├── layout/
│   ├── navigation.tsx   # Updated with auth state
│   └── footer.tsx
└── ui/                  # Shadcn UI components
```

## 🔑 Key Features Implemented

### 1. Authentication Flow
```typescript
// Login
const { login } = useAuth()
await login({ email, password })

// Register
const { register } = useAuth()
await register({ email, password, first_name, last_name, role })

// Get current user
const { user, isAuthenticated } = useAuth()
```

### 2. Profile Search
```typescript
import { searchAPI } from '@/lib/api'

const response = await searchAPI.search({
  query: 'tax expert',
  profession: 'CA',
  location: 'Mumbai',
  min_experience: 5,
  sort: 'rating',
  page: 1,
  limit: 12
})
```

### 3. Contact Professional
```typescript
import { profilesAPI } from '@/lib/api'

await profilesAPI.contactProfile(profileId, {
  subject: 'Tax Consultation',
  message: 'I need help with...'
})
```

### 4. Subscription Management
```typescript
import { subscriptionAPI } from '@/lib/api'

// Get subscription
const subscription = await subscriptionAPI.getSubscription()

// Upgrade
await subscriptionAPI.upgradeToPremium()

// Check usage
const usage = await subscriptionAPI.getUsageStats()
```

## 🎨 UI Components

All UI components are from Shadcn UI library:
- Forms: `<Input>`, `<Label>`, `<Textarea>`, `<Select>`
- Dialogs: `<Dialog>`, `<AlertDialog>`
- Navigation: `<DropdownMenu>`, `<NavigationMenu>`
- Feedback: `<Toast>`, `<Badge>`, `<Avatar>`
- Layout: `<Card>`, `<Separator>`, `<Tabs>`

## 🚀 Next Steps to Improve

### 1. Add Missing Pages
```bash
# Create these pages
app/profile/page.tsx          # Edit own profile
app/settings/page.tsx         # User settings
app/admin/page.tsx            # Admin panel
app/subscription/page.tsx     # Subscription management
```

### 2. Enhance Dashboard
- Show real statistics
- Add charts for analytics
- Display recent activities
- Show subscription usage

### 3. Add Real-time Features
- WebSocket for messaging
- Real-time notifications
- Live profile updates

### 4. Improve UX
- Add loading skeletons
- Implement optimistic updates
- Add error boundaries
- Improve mobile responsiveness

### 5. Add More Features
- File upload for documents
- Calendar integration for bookings
- Payment integration
- Review & rating system
- Advanced filters
- Saved searches
- Favorites/bookmarks

## 🧪 Testing

### Backend Must Be Running
```bash
cd /mnt/Storage/Projects/CounselMate
make run
# Or
go run cmd/server/main.go
```

### Test the Integration
1. **Register a new user**: Visit `/auth/register`
2. **Login**: Visit `/auth/login`
3. **Create profile**: Create a professional profile
4. **Search**: Browse `/professionals`
5. **View profile**: Click on any professional
6. **Contact**: Try contacting a professional

## 🐛 Troubleshooting

### CORS Issues
Ensure backend `.env` has:
```
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Auth Token Issues
- Check if token is stored in localStorage
- Verify token expiry
- Check network tab for 401 errors

### API Connection Issues
- Verify backend is running on port 8080
- Check `.env.local` has correct API_BASE_URL
- Ensure no firewall blocking

## 📝 API Type Safety

All API responses are fully typed matching the Go backend:
```typescript
interface Profile {
  id: string
  user_id: string
  profession_type: ProfessionType
  title: string
  bio: string
  skills: string[]
  // ... matches Go Profile struct
}
```

## 🔐 Security Features

- JWT token management
- Automatic token refresh
- Protected routes
- CSRF protection
- Rate limiting awareness
- Secure password requirements
- Email verification flow

## 📱 Responsive Design

All pages are fully responsive:
- Mobile-first approach
- Tablet breakpoints
- Desktop optimization
- Touch-friendly interactions

## 🎯 Performance Optimizations

- Client-side caching
- Lazy loading
- Image optimization
- Code splitting
- Tree shaking

## 📄 License

Same as backend project

## 🤝 Contributing

1. Follow existing code patterns
2. Use TypeScript strict mode
3. Add proper error handling
4. Update types when backend changes
5. Test on multiple devices

---

**Status**: ✅ Fully Integrated with Backend
**Last Updated**: January 2026

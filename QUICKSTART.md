# CounselMate - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Backend
```bash
cd /mnt/Storage/Projects/CounselMate
make run
```
Backend will run on `http://localhost:8080`

### Step 2: Start the Frontend
```bash
cd /mnt/Storage/Projects/lawyer_frontend
./start.sh
# Or manually:
# pnpm install
# pnpm dev
```
Frontend will run on `http://localhost:3000`

### Step 3: Test It Out!
1. Visit `http://localhost:3000`
2. Click "Get Started" to register
3. Create a professional profile
4. Browse and search professionals

---

## 📱 Test Scenarios

### Scenario 1: Register as a Client
1. Go to `/auth/register`
2. Fill in details
3. Select role: "Client / Apprentice"
4. Complete registration
5. Browse professionals at `/professionals`
6. Click on a professional to view their profile
7. Send them a message

### Scenario 2: Register as a Professional
1. Go to `/auth/register`
2. Fill in details
3. Select role: "Professional (CA / Lawyer)"
4. Complete registration
5. Go to `/profile` to create your profile
6. Fill in all details (bio, skills, etc.)
7. Click "AI Suggest Skills" for smart suggestions
8. Save your profile
9. View your public profile

### Scenario 3: Search & Filter
1. Go to `/professionals`
2. Try searching for skills (e.g., "tax", "contract")
3. Use filters:
   - Select profession type
   - Choose location
   - Filter by availability
4. Sort results by rating or experience
5. Navigate through pages

---

## 🎯 Key Features to Test

### ✅ Authentication
- [ ] Register new account
- [ ] Login with credentials
- [ ] View profile in navigation dropdown
- [ ] Logout

### ✅ Profile Management
- [ ] Create professional profile
- [ ] Edit profile details
- [ ] Add skills, certifications, languages
- [ ] Use AI to suggest skills
- [ ] Set hourly rate
- [ ] Update availability

### ✅ Search & Discovery
- [ ] Browse all professionals
- [ ] Search by keywords
- [ ] Filter by profession
- [ ] Filter by location
- [ ] Sort results
- [ ] Pagination

### ✅ Professional Profile
- [ ] View detailed profile
- [ ] See ratings and reviews
- [ ] View skills and certifications
- [ ] Contact professional (requires login)

### ✅ UI/UX
- [ ] Responsive on mobile
- [ ] Loading states work
- [ ] Error messages appear
- [ ] Toast notifications work
- [ ] Navigation is smooth

---

## 🔧 Troubleshooting

### Backend not connecting?
```bash
# Check if backend is running
curl http://localhost:8080/health

# Should return: {"status":"healthy","version":"1.0.0"}
```

### CORS errors?
Check backend `.env` has:
```
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Can't create profile?
- Make sure you're logged in as PROFESSIONAL role
- Check browser console for errors
- Verify backend is receiving requests

### Token expired?
- Refresh the page
- Login again
- Check localStorage for `access_token`

---

## 📊 API Endpoints Being Used

| Endpoint | Method | Purpose | Page |
|----------|--------|---------|------|
| `/auth/register` | POST | Register user | Register page |
| `/auth/login` | POST | Login user | Login page |
| `/auth/me` | GET | Get current user | Navigation |
| `/profiles/me` | GET | Get my profile | Profile page |
| `/profiles` | POST | Create profile | Profile page |
| `/profiles` | PUT | Update profile | Profile page |
| `/profiles/:id` | GET | Get profile | Profile view |
| `/search` | GET | Search profiles | Professionals |
| `/search/tags` | GET | Get filter tags | Professionals |
| `/profiles/:id/contact` | POST | Contact pro | Profile view |
| `/ai/suggest-tags` | POST | AI suggestions | Profile page |
| `/subscription` | GET | Get subscription | (Coming) |

---

## 🎨 Pages Available

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Homepage | No |
| `/auth/login` | Login page | No |
| `/auth/register` | Register page | No |
| `/professionals` | Browse pros | No |
| `/professionals/[id]` | Profile view | No* |
| `/profile` | Edit profile | Yes (Professional) |
| `/dashboard` | Dashboard | Yes |
| `/messages` | Messages | Yes |

*Contact requires auth

---

## 💡 Tips

1. **Use AI Suggestions**: When creating a profile, write a good bio then click "AI Suggest Skills"
2. **Complete Profile**: Fill all fields for better visibility
3. **Test Search**: Try different combinations of filters
4. **Mobile View**: Test on mobile (Chrome DevTools)
5. **Network Tab**: Check API calls in browser DevTools

---

## 🎓 For Development

### Adding a new feature:
1. Add backend endpoint (if needed)
2. Add TypeScript types in `lib/api/types.ts`
3. Add API function in appropriate `lib/api/*.ts` file
4. Create/update page component
5. Use hooks for data fetching
6. Handle loading & error states
7. Add toast notifications

### File structure:
```
lib/api/        → API client & types
lib/context/    → React contexts
lib/hooks/      → Custom hooks
app/            → Next.js pages
components/     → React components
```

---

## 🚀 Next Features to Add

### Priority 1
- [ ] Settings page (change password, update user)
- [ ] Enhanced dashboard with real stats
- [ ] Subscription management page
- [ ] Email verification page

### Priority 2
- [ ] Admin panel for user management
- [ ] Reviews and ratings system
- [ ] Booking/scheduling system
- [ ] Payment integration

### Priority 3
- [ ] Real-time messaging
- [ ] Notifications system
- [ ] File uploads
- [ ] Advanced analytics

---

## 📞 Need Help?

1. Check `INTEGRATION.md` for detailed docs
2. Check `SUMMARY.md` for overview
3. Look at browser console for errors
4. Check backend logs
5. Verify environment variables

---

**Happy coding! 🎉**

Your CounselMate platform is ready to connect professionals with clients!

# API Testing Guide

## 🧪 Quick Access

Visit: **http://localhost:3000/api-test**

Or click the **"🧪 API Test"** link in the navigation bar.

---

## 📋 What This Page Does

The API Testing Dashboard helps you verify that all backend endpoints are properly connected and working. It provides:

1. **Visual Testing Interface** - Click buttons to test endpoints
2. **Automatic Test Suite** - Run all tests with one click
3. **Real-time Results** - See success/failure immediately
4. **Response Viewer** - Inspect API responses and errors
5. **Authentication Status** - Know which tests require login

---

## 🚀 How to Use

### Option 1: Quick Test (Recommended)

1. **Go to Quick Tests tab**
2. **Click "Run All Tests"**
3. **Watch the progress bar**
4. **Review results** - Green = Success, Red = Error

This will automatically test:
- ✅ Backend health check
- ✅ Search tags endpoint
- ✅ Profile search
- ✅ Current user (if logged in)
- ✅ User profile (if logged in)
- ✅ Subscription (if logged in)
- ✅ AI features (if logged in)

### Option 2: Manual Testing

1. **Go to Manual Tests tab**
2. **Click individual test buttons**
3. **For some tests, enter test data:**
   - Search Query: Enter search term (e.g., "lawyer", "tax")
   - Profile ID: Enter a UUID from your database

### Option 3: View Results

1. **Go to Results tab**
2. **See all test results in a list**
3. **Click any result to view details**
4. **See full API response or error message**

---

## 📊 Understanding Results

### Success ✅
```
✓ Search Profiles
  Success in 245ms
```
- Green checkmark
- Shows response time
- API is working correctly

### Error ❌
```
✗ Get My Profile
  Failed in 123ms
  Error: Profile not found
```
- Red X mark
- Shows error message
- Check what went wrong

### Pending ⏳
```
⏳ AI Suggest Tags
  Testing...
```
- Blue spinner
- Test is currently running

---

## 🔐 Authentication Tests

Some tests require you to be logged in:

### Without Login
- ❌ Get Current User
- ❌ Get My Profile
- ❌ Get Subscription
- ❌ AI Suggest Tags

### After Login
- ✅ All above tests become available

**To test authenticated endpoints:**
1. Login at `/auth/login`
2. Return to `/api-test`
3. Run tests again

---

## 🎯 Common Test Scenarios

### Scenario 1: Fresh Start (Backend Just Started)
```bash
Expected Results:
✅ Health Check - Should pass
✅ Get Search Tags - Should pass
✅ Search Profiles - Might return empty if no data
❌ Auth tests - Will fail if not logged in
```

### Scenario 2: After Registration
```bash
1. Register at /auth/register
2. Go to /api-test
3. Run "Get Current User" - Should show your user data
4. Run "Get My Profile" - Might fail if no profile created
5. Run "Get Subscription" - Should show FREE plan
```

### Scenario 3: Professional User
```bash
1. Login as PROFESSIONAL
2. Create profile at /profile
3. Run "Get My Profile" - Should show your profile
4. Run "AI Suggest Tags" - Should return skill suggestions
```

---

## 📝 Individual Test Details

### Public Endpoints (No Auth Required)

#### GET /health
```json
Expected Response:
{
  "status": "healthy",
  "version": "1.0.0"
}
```
**Purpose**: Check if backend is running

#### GET /search/tags
```json
Expected Response:
{
  "ca_skills": ["Taxation", "Audit", ...],
  "lawyer_skills": ["Corporate Law", ...],
  "states": ["Maharashtra", "Delhi", ...],
  "availability": ["AVAILABLE", "NOT_AVAILABLE", ...],
  "professions": ["CA", "LAWYER", ...]
}
```
**Purpose**: Get all available filter options

#### GET /search?query=lawyer
```json
Expected Response:
{
  "profiles": [...],
  "total": 10,
  "page": 1,
  "limit": 10,
  "total_pages": 1
}
```
**Purpose**: Search for professionals

#### GET /profiles/:id
```json
Expected Response:
{
  "id": "uuid",
  "title": "Senior Tax Consultant",
  "profession_type": "CA",
  ...
}
```
**Purpose**: Get specific profile details

---

### Protected Endpoints (Auth Required)

#### GET /auth/me
```json
Expected Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "PROFESSIONAL",
  ...
}
```
**Purpose**: Get current logged-in user

#### GET /profiles/me
```json
Expected Response:
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "Tax Expert",
  "bio": "...",
  "skills": ["Taxation", "GST"],
  ...
}
```
**Purpose**: Get current user's professional profile

#### GET /subscription
```json
Expected Response:
{
  "id": "uuid",
  "plan": "FREE",
  "ai_queries_used": 2,
  "ai_queries_limit": 5,
  "contacts_used": 1,
  "contacts_limit": 10,
  ...
}
```
**Purpose**: Get subscription details

#### GET /subscription/usage
```json
Expected Response:
{
  "ai_queries_used": 2,
  "ai_queries_limit": 5,
  "ai_queries_remaining": 3,
  "contacts_used": 1,
  "contacts_limit": 10,
  "contacts_remaining": 9,
  "reset_date": "2026-01-13T00:00:00Z"
}
```
**Purpose**: Get usage statistics

#### POST /ai/suggest-tags
```json
Request:
{
  "text": "Experienced tax consultant...",
  "profession_type": "CA"
}

Expected Response:
{
  "suggested_tags": ["Taxation", "GST", "Compliance", ...]
}
```
**Purpose**: Get AI-suggested skills based on text

---

## 🐛 Troubleshooting

### All Tests Failing?
**Check:**
1. Is backend running? `curl http://localhost:8080/health`
2. Is backend on correct port? Check `.env.local`
3. CORS configured? Check backend `.env`

### Health Check Fails?
```
Error: Failed to fetch
```
**Solution**: Backend is not running. Start it:
```bash
cd /mnt/Storage/Projects/CounselMate
make run
```

### Auth Tests Fail?
```
Error: Authentication required
```
**Solution**: You need to login first
1. Go to `/auth/login`
2. Login with your credentials
3. Return to `/api-test`

### Profile Not Found?
```
Error: Profile not found
```
**Solution**: 
- Professional users: Create a profile at `/profile`
- Apprentice users: This is expected (only professionals have profiles)

### Subscription Tests Fail?
```
Error: Subscription not found
```
**Solution**: This should auto-create on user registration. Check backend logs.

### CORS Error?
```
Error: CORS policy blocked
```
**Solution**: Add frontend URL to backend `.env`:
```
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## 💡 Tips

1. **Run Quick Tests First**: Gets you a comprehensive overview
2. **Check Results Tab**: See all responses in detail
3. **Test After Changes**: Verify endpoints after backend updates
4. **Use for Debugging**: Helps identify which endpoint is failing
5. **Response Times**: Keep an eye on durations - should be < 1000ms

---

## 📈 Expected Performance

| Endpoint | Expected Time | Status |
|----------|--------------|--------|
| Health Check | < 50ms | 🟢 Fast |
| Search Tags | < 200ms | 🟢 Fast |
| Search Profiles | < 500ms | 🟡 Medium |
| Get Profile | < 300ms | 🟢 Fast |
| AI Suggest Tags | 1-3s | 🔴 Slow (OpenAI API) |
| Auth Endpoints | < 500ms | 🟢 Fast |

---

## 🎓 Understanding the Code

The test page uses the same API client as your production code:

```typescript
// Same functions you use in your app
import { authAPI, profilesAPI, searchAPI } from '@/lib/api'

// Test function
const testGetMe = async () => {
  return await authAPI.getMe()
}
```

This means:
- ✅ Tests real API integration
- ✅ Uses actual authentication
- ✅ Same error handling
- ✅ If tests pass, your app will work!

---

## 🚀 Quick Commands

### Start Everything
```bash
# Terminal 1 - Backend
cd /mnt/Storage/Projects/CounselMate
make run

# Terminal 2 - Frontend
cd /mnt/Storage/Projects/lawyer_frontend
pnpm dev

# Browser
Visit: http://localhost:3000/api-test
```

### Check Backend Health
```bash
curl http://localhost:8080/health
```

### View Backend Logs
```bash
# In the terminal running the backend
# Watch for errors when tests run
```

---

## 📋 Checklist for Complete Verification

- [ ] Backend is running
- [ ] Health check passes
- [ ] Search tags returns data
- [ ] Search profiles works (even if empty)
- [ ] Can register new user
- [ ] Can login
- [ ] Get current user works
- [ ] Create profile works (PROFESSIONAL)
- [ ] Get my profile works
- [ ] Subscription shows FREE plan
- [ ] AI suggest tags works (if OpenAI configured)
- [ ] All tests show green checkmarks

---

## 🎉 Success Criteria

**All tests passing means:**
- ✅ Backend is properly running
- ✅ Database is connected
- ✅ API endpoints are accessible
- ✅ Authentication is working
- ✅ CORS is configured
- ✅ Frontend-Backend integration is complete

**You're ready to develop features!** 🚀

---

## 📞 Still Having Issues?

1. Check backend logs
2. Check browser console (F12)
3. Verify environment variables
4. Ensure database is running
5. Check firewall settings
6. Review `INTEGRATION.md` for setup steps

---

**Happy Testing! 🧪**

This tool ensures your full-stack integration is rock solid!

# 🧪 API Testing Dashboard - Quick Reference

## Access

**URL**: `http://localhost:3000/api-test`

**Navigation**: Click **"🧪 API Test"** in the top menu

---

## Features

### 1️⃣ Quick Tests
- Run all tests with one click
- See real-time progress
- Get success/failure summary

### 2️⃣ Manual Tests
- Test individual endpoints
- Enter custom test data
- Test public and protected endpoints

### 3️⃣ Results Viewer
- View all test results
- Click to see detailed responses
- Debug errors with full stack traces

---

## Quick Start

### 1. Start Backend
```bash
cd /mnt/Storage/Projects/CounselMate
make run
```

### 2. Start Frontend
```bash
cd /mnt/Storage/Projects/lawyer_frontend
pnpm dev
```

### 3. Open Test Page
```
http://localhost:3000/api-test
```

### 4. Run Tests
Click **"Run All Tests"** button

---

## Test Coverage

### ✅ Public Endpoints (No Auth)
- `GET /health` - Backend health check
- `GET /search/tags` - Get filter options
- `GET /search` - Search profiles
- `GET /profiles/:id` - Get profile by ID

### 🔐 Protected Endpoints (Requires Auth)
- `GET /auth/me` - Current user
- `GET /profiles/me` - My profile
- `GET /subscription` - Subscription details
- `GET /subscription/usage` - Usage stats
- `POST /ai/suggest-tags` - AI suggestions

---

## Result Indicators

| Icon | Status | Meaning |
|------|--------|---------|
| ✅ | Success | Endpoint working correctly |
| ❌ | Error | Endpoint failed (see error details) |
| ⏳ | Pending | Test currently running |

---

## Common Issues & Solutions

### ❌ "Failed to fetch"
**Problem**: Backend not running  
**Solution**: Start backend with `make run`

### ❌ "Authentication required"
**Problem**: Not logged in  
**Solution**: Login at `/auth/login` first

### ❌ "Profile not found"
**Problem**: No profile created  
**Solution**: Create profile at `/profile` (PROFESSIONAL users only)

### ❌ "CORS policy blocked"
**Problem**: CORS not configured  
**Solution**: Add `CORS_ALLOWED_ORIGINS=http://localhost:3000` to backend `.env`

---

## Tips

💡 **Run tests after backend updates** to verify changes  
💡 **Check response times** - should be < 1 second (except AI)  
💡 **View full responses** by clicking on results  
💡 **Test both logged in and logged out** states  

---

## Documentation

- **Full Guide**: `API-TEST-GUIDE.md`
- **API Docs**: `INTEGRATION.md`
- **Architecture**: `ARCHITECTURE.md`

---

**Note**: This is a development tool. Remove the link from navigation before deploying to production!

```typescript
// In components/layout/navigation.tsx
// Remove these lines before production:
<Link href="/api-test" className="text-amber-600...">
  🧪 API Test
</Link>
```

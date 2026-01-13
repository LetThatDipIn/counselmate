# API Test Page - Visual Guide

## 🎨 Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  CounselMate - API Testing Dashboard                        │
│  [🧪 API Test]  [Find Professionals]  [Dashboard]  [Login] │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  API Testing Dashboard                                       │
│  Test all backend endpoints and verify integration          │
│                                    [Logged in as: user@...] │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐│
│  │ 📡 Backend API                        [Check Status]   ││
│  │ http://localhost:8080/api                              ││
│  └────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  [Quick Tests]  [Manual Tests]  [Results (15)]              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  QUICK TESTS TAB:                                           │
│  ┌────────────────────────────────────────────────────────┐│
│  │  Quick Test Suite                                      ││
│  │  Run all available tests automatically                 ││
│  │                                                         ││
│  │  [▶ Run All Tests]    [🗑 Clear Results]               ││
│  │                                                         ││
│  │  Progress                                    12 / 15   ││
│  │  ████████████████████░░░░░░  80%                       ││
│  └────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Success  │  │  Failed  │  │ Pending  │                 │
│  │   ✅ 12  │  │   ❌ 2   │  │   ⏳ 1   │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘

MANUAL TESTS TAB:
┌─────────────────────────────────────────────────────────────┐
│  Public Endpoints        │  Protected Endpoints             │
│  ─────────────────       │  ──────────────────              │
│  [📊 GET /health]        │  [📊 GET /auth/me]               │
│  [📊 GET /search/tags]   │  [📊 GET /profiles/me]           │
│                          │  [📊 GET /subscription]          │
│  Search Query:           │  [📊 POST /ai/suggest-tags]      │
│  [lawyer_______] [Search]│                                  │
│                          │  ⚠️ Please login to test these   │
│  Profile ID:             │                                  │
│  [uuid______] [Get]      │                                  │
└─────────────────────────────────────────────────────────────┘

RESULTS TAB:
┌─────────────────────────────────────────────────────────────┐
│  Test Results            │  Details                         │
│  ─────────────           │  ───────                         │
│  ┌─────────────────────┐ │  Test Name: Health Check        │
│  │ ✅ Health Check     │ │  Status: ✅ success             │
│  │ Success in 45ms     │ │                                 │
│  └─────────────────────┘ │  Response:                      │
│  ┌─────────────────────┐ │  {                              │
│  │ ✅ Search Tags      │ │    "status": "healthy",         │
│  │ Success in 123ms    │ │    "version": "1.0.0"           │
│  └─────────────────────┘ │  }                              │
│  ┌─────────────────────┐ │                                 │
│  │ ❌ Get My Profile   │ │                                 │
│  │ Failed in 201ms     │ │                                 │
│  └─────────────────────┘ │                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Mobile View

```
┌───────────────────┐
│  API Testing      │
│  [≡ Menu]         │
└───────────────────┘

┌───────────────────┐
│ Backend Status    │
│ ✅ Connected      │
└───────────────────┘

┌───────────────────┐
│ [Quick] [Manual]  │
│ [Results (12)]    │
└───────────────────┘

┌───────────────────┐
│ Run All Tests     │
│ ▶ Start           │
└───────────────────┘

┌───────────────────┐
│ Results:          │
│ ✅ 10 Success     │
│ ❌ 2 Failed       │
│ ⏳ 1 Pending      │
└───────────────────┘
```

---

## 🎯 User Flow Diagrams

### Flow 1: Quick Test
```
User Clicks "Run All Tests"
         │
         ▼
Tests Start Running (Show Spinner)
         │
         ▼
Progress Bar Updates (0% → 100%)
         │
         ▼
Results Display
         │
    ┌────┴────┐
    │         │
Success ✅   Failed ❌
    │         │
    │         └─→ Click to See Error Details
    │
    └─→ Click to See Response Data
```

### Flow 2: Manual Test
```
User Selects Endpoint
         │
         ├─→ Public? → Click Button → Test Runs
         │
         └─→ Protected? → Check Auth
                    │
                ┌───┴───┐
                │       │
          Logged In  Not Logged In
                │       │
           Test Runs   Show Error
                │       "Login Required"
                ▼
            Results Display
```

### Flow 3: View Results
```
Tests Complete
      │
      ▼
Go to Results Tab
      │
      ▼
See List of All Tests
      │
      ▼
Click on a Test
      │
      ▼
View Full Details
      │
  ┌───┴───┐
  │       │
Success  Error
  │       │
  │       └─→ See Error Message
  │           See Stack Trace
  │
  └─→ See Response JSON
      Copy Response
```

---

## 🎨 Color Coding

### Status Colors
```
Success  → Green Background (bg-green-50)
         → Green Border (border-green-200)
         → Green Icon ✅

Error    → Red Background (bg-red-50)
         → Red Border (border-red-200)
         → Red Icon ❌

Pending  → Blue Background (bg-blue-50)
         → Blue Border (border-blue-200)
         → Blue Spinner ⏳

Selected → Blue Ring (ring-blue-500)
```

---

## 📊 Example Screens

### Success State
```
┌──────────────────────────────────────┐
│ ✅ Health Check                      │
│ Success in 45ms                      │
│                                      │
│ Response:                            │
│ {                                    │
│   "status": "healthy",               │
│   "version": "1.0.0"                 │
│ }                                    │
└──────────────────────────────────────┘
```

### Error State
```
┌──────────────────────────────────────┐
│ ❌ Get My Profile                    │
│ Failed in 201ms                      │
│                                      │
│ Error:                               │
│ Profile not found                    │
│                                      │
│ Details:                             │
│ User does not have a professional    │
│ profile. Create one at /profile      │
└──────────────────────────────────────┘
```

### Loading State
```
┌──────────────────────────────────────┐
│ ⏳ AI Suggest Tags                   │
│ Testing...                           │
│                                      │
│ [████████░░░░] 67%                   │
└──────────────────────────────────────┘
```

---

## 🔍 Interactive Elements

### Buttons
```
Primary Action:    [▶ Run All Tests]
Secondary Action:  [🗑 Clear Results]
Endpoint Test:     [📊 GET /health]
Status Check:      [🔄 Check Status]
```

### Inputs
```
Text Input:   [Search term________________]
UUID Input:   [Profile ID (UUID)_________]
```

### Cards
```
Clickable:    [Hover: Shadow + Border Highlight]
Selected:     [Blue Ring Around Card]
Disabled:     [Gray + Cursor: not-allowed]
```

---

## 💡 Visual Feedback

### Test Running
```
Button Changes: [▶ Run] → [⏳ Running...]
Progress Bar: Empty → Fills Up
Results Counter: Updates in Real-time
```

### Test Complete
```
Success: ✅ + Green Background
Error:   ❌ + Red Background
Toast: "All tests completed" (top-right)
```

### Authentication Status
```
Logged In:     [🟢 user@example.com]
Not Logged In: [🔴 Not authenticated]
```

---

## 📐 Responsive Breakpoints

### Desktop (> 1024px)
- Two-column layout
- Full navigation visible
- Side-by-side results and details

### Tablet (768px - 1024px)
- Single column layout
- Stacked cards
- Collapsible sections

### Mobile (< 768px)
- Full-width cards
- Hamburger menu
- Vertical tabs
- Touch-friendly buttons

---

## 🎭 Animation Effects

### On Load
```
Fade In: Page content
Slide Up: Cards
Delay: Stagger animations
```

### On Interaction
```
Hover: Shadow increases
Click: Scale down slightly
Success: Checkmark animation
Error: Shake animation
```

### Progress
```
Progress Bar: Smooth width transition
Spinner: Continuous rotation
Counters: Number count up
```

---

## 🎨 Theme Integration

Uses CounselMate's design system:
- Primary Color: Blue (#3b82f6)
- Success: Green (#22c55e)
- Error: Red (#ef4444)
- Warning: Amber (#f59e0b)
- Gray Scale: Tailwind defaults

---

## 📱 Accessibility Features

- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Screen reader friendly
- ✅ High contrast mode
- ✅ Focus indicators
- ✅ Semantic HTML

---

## 🚀 Performance

- Fast initial load (< 1s)
- Instant UI updates
- Lazy load responses
- Optimized re-renders
- Efficient state management

---

**This test page gives you a professional, user-friendly interface to verify all your API connections are working perfectly!** 🎉

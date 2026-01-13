# CounselMate - TODO & Roadmap

## ✅ Completed Features

### Backend Integration
- [x] Complete API client with JWT authentication
- [x] TypeScript types matching Go models
- [x] All auth endpoints integrated
- [x] All profile endpoints integrated
- [x] All search endpoints integrated
- [x] All subscription endpoints integrated
- [x] AI tag suggestions integrated
- [x] Error handling and toast notifications
- [x] Loading states for all operations

### Pages & Components
- [x] Authentication pages (Login, Register)
- [x] Professional browse page with filters
- [x] Individual profile view page
- [x] Profile creation/edit page
- [x] Navigation with auth state
- [x] Responsive design for all pages
- [x] Protected route handling

### User Experience
- [x] Form validation
- [x] Toast notifications
- [x] Loading spinners
- [x] Error messages
- [x] Success confirmations
- [x] Mobile responsiveness
- [x] Accessible components

---

## 🚧 High Priority (Next Sprint)

### 1. Settings Page
**Priority**: 🔴 High  
**Effort**: Medium (2-3 days)

```typescript
// app/settings/page.tsx
- [ ] Personal information section
  - [ ] Update name, email
  - [ ] Upload profile picture
  - [ ] Update user preferences
  
- [ ] Security section
  - [ ] Change password
  - [ ] Two-factor authentication (future)
  - [ ] Active sessions management
  
- [ ] Notifications settings
  - [ ] Email preferences
  - [ ] Push notifications (future)
  
- [ ] Account management
  - [ ] Download data
  - [ ] Delete account
```

### 2. Enhanced Dashboard
**Priority**: 🔴 High  
**Effort**: High (4-5 days)

```typescript
// app/dashboard/page.tsx
- [ ] Real-time statistics from backend
  - [ ] Profile views count
  - [ ] Contact requests received
  - [ ] Search appearances
  
- [ ] Recent activities
  - [ ] Recent profile views
  - [ ] Recent messages
  - [ ] Recent contacts
  
- [ ] Charts and analytics
  - [ ] Profile views over time
  - [ ] Popular search keywords
  - [ ] Conversion metrics
  
- [ ] Quick actions
  - [ ] Edit profile button
  - [ ] View public profile
  - [ ] Manage subscription
```

### 3. Subscription Management Page
**Priority**: 🔴 High  
**Effort**: Medium (2-3 days)

```typescript
// app/subscription/page.tsx
- [ ] Current plan display
  - [ ] Plan name and price
  - [ ] Billing cycle
  - [ ] Next billing date
  
- [ ] Usage statistics
  - [ ] AI queries used/limit
  - [ ] Contacts used/limit
  - [ ] Progress bars
  - [ ] Reset date countdown
  
- [ ] Plan comparison
  - [ ] FREE vs PREMIUM table
  - [ ] Upgrade/downgrade buttons
  - [ ] Feature highlights
  
- [ ] Billing history (future)
  - [ ] Past invoices
  - [ ] Payment method
```

### 4. Email Verification Page
**Priority**: 🟡 Medium  
**Effort**: Low (1 day)

```typescript
// app/auth/verify/page.tsx
- [ ] Token verification on load
- [ ] Success message
- [ ] Error handling
- [ ] Redirect after verification
- [ ] Resend verification button
```

---

## 🎯 Medium Priority (Sprint 2)

### 5. Admin Panel
**Priority**: 🟡 Medium  
**Effort**: High (5-7 days)

```typescript
// app/admin/page.tsx
- [ ] User management
  - [ ] List all users
  - [ ] Search and filter users
  - [ ] View user details
  - [ ] Delete users
  - [ ] Ban/suspend users
  
- [ ] Profile management
  - [ ] List all profiles
  - [ ] Verify profiles
  - [ ] Feature profiles
  - [ ] Delete profiles
  
- [ ] Analytics dashboard
  - [ ] Total users
  - [ ] Total professionals
  - [ ] Active subscriptions
  - [ ] Revenue metrics (future)
  
- [ ] System settings
  - [ ] Platform configurations
  - [ ] Email templates
  - [ ] AI settings
```

### 6. Reviews & Ratings System
**Priority**: 🟡 Medium  
**Effort**: High (5-6 days)

**Backend Required**: Yes - New endpoints needed

```typescript
// Backend additions needed:
POST /api/profiles/:id/reviews
GET /api/profiles/:id/reviews
PUT /api/reviews/:id
DELETE /api/reviews/:id

// Frontend components:
- [ ] Leave review dialog
  - [ ] Star rating input
  - [ ] Review text
  - [ ] Submit button
  
- [ ] Reviews list on profile
  - [ ] Display all reviews
  - [ ] Pagination
  - [ ] Sort by date/rating
  
- [ ] Review moderation (admin)
  - [ ] Flag inappropriate reviews
  - [ ] Delete reviews
```

### 7. Messaging System
**Priority**: 🟡 Medium  
**Effort**: Very High (7-10 days)

**Backend Required**: Yes - WebSocket/Chat system

```typescript
// Backend additions needed:
WebSocket endpoint for real-time chat
Chat message storage
Notification system

// Frontend components:
- [ ] Chat list page
  - [ ] Conversation list
  - [ ] Unread message counts
  - [ ] Search conversations
  
- [ ] Chat window
  - [ ] Real-time messages
  - [ ] Send messages
  - [ ] File attachments
  - [ ] Typing indicators
  
- [ ] Notifications
  - [ ] New message alerts
  - [ ] Desktop notifications
```

### 8. Booking/Scheduling System
**Priority**: 🟡 Medium  
**Effort**: Very High (7-10 days)

**Backend Required**: Yes - Calendar/Booking system

```typescript
// Backend additions needed:
Availability management
Booking CRUD operations
Calendar integration

// Frontend components:
- [ ] Availability calendar (professionals)
  - [ ] Set available time slots
  - [ ] Block time slots
  - [ ] Recurring availability
  
- [ ] Book appointment (clients)
  - [ ] View professional availability
  - [ ] Select time slot
  - [ ] Confirm booking
  
- [ ] Booking management
  - [ ] View upcoming bookings
  - [ ] Cancel/reschedule
  - [ ] Add to calendar
```

---

## 🌟 Low Priority (Sprint 3+)

### 9. Payment Integration
**Priority**: 🟢 Low  
**Effort**: Very High (10+ days)

**Backend Required**: Yes - Payment gateway

```typescript
- [ ] Stripe/Razorpay integration
- [ ] Subscription payments
- [ ] Consultation payments
- [ ] Refund handling
- [ ] Invoice generation
- [ ] Payment history
```

### 10. Advanced Search Features
**Priority**: 🟢 Low  
**Effort**: Medium (3-4 days)

```typescript
- [ ] Saved searches
- [ ] Search history
- [ ] Advanced filters
  - [ ] Price range slider
  - [ ] Multiple skill selection
  - [ ] Radius-based location
- [ ] Search result sorting improvements
- [ ] Favorites/bookmarks
```

### 11. File Upload System
**Priority**: 🟢 Low  
**Effort**: High (4-5 days)

**Backend Required**: Yes - File storage

```typescript
- [ ] Profile picture upload
  - [ ] Image cropping
  - [ ] Image optimization
  
- [ ] Document uploads
  - [ ] Certificates
  - [ ] Licenses
  - [ ] Portfolio items
  
- [ ] Cloud storage integration
  - [ ] AWS S3 or similar
  - [ ] CDN for images
```

### 12. Enhanced Analytics
**Priority**: 🟢 Low  
**Effort**: High (5-6 days)

```typescript
- [ ] Professional analytics
  - [ ] Profile performance
  - [ ] Engagement metrics
  - [ ] Conversion rates
  
- [ ] Charts and visualizations
  - [ ] Recharts integration
  - [ ] Custom dashboards
  
- [ ] Export data
  - [ ] PDF reports
  - [ ] CSV exports
```

### 13. Mobile App
**Priority**: 🟢 Low  
**Effort**: Very High (15-20 days)

```typescript
- [ ] React Native app
- [ ] iOS and Android
- [ ] Push notifications
- [ ] Offline support
- [ ] App store deployment
```

### 14. SEO Optimization
**Priority**: 🟢 Low  
**Effort**: Medium (2-3 days)

```typescript
- [ ] Meta tags for all pages
- [ ] Open Graph tags
- [ ] Twitter cards
- [ ] Structured data (JSON-LD)
- [ ] Sitemap generation
- [ ] robots.txt
- [ ] Dynamic meta based on content
```

---

## 🔧 Technical Improvements

### Performance Optimization
- [ ] Implement React Query or SWR
  - [ ] Better caching
  - [ ] Automatic refetching
  - [ ] Optimistic updates
  
- [ ] Code splitting improvements
  - [ ] Dynamic imports
  - [ ] Route-based splitting
  
- [ ] Image optimization
  - [ ] Next.js Image component
  - [ ] Lazy loading
  - [ ] WebP format
  
- [ ] Bundle size reduction
  - [ ] Tree shaking
  - [ ] Remove unused dependencies

### Code Quality
- [ ] Add unit tests
  - [ ] Jest + React Testing Library
  - [ ] Component tests
  - [ ] Hook tests
  
- [ ] Add E2E tests
  - [ ] Playwright or Cypress
  - [ ] Critical user flows
  
- [ ] Improve error boundaries
  - [ ] Global error boundary
  - [ ] Page-level error boundaries
  
- [ ] Add proper logging
  - [ ] Error tracking (Sentry)
  - [ ] Analytics (Google Analytics)

### Security Enhancements
- [ ] Implement CSRF protection
- [ ] Add rate limiting on frontend
- [ ] Implement content security policy
- [ ] Add security headers
- [ ] Regular dependency updates
- [ ] Security audit

### Developer Experience
- [ ] Add Storybook
  - [ ] Component documentation
  - [ ] Visual testing
  
- [ ] Improve TypeScript
  - [ ] Stricter types
  - [ ] Remove any types
  
- [ ] Better error messages
  - [ ] User-friendly errors
  - [ ] Helpful debugging info
  
- [ ] Documentation
  - [ ] Component documentation
  - [ ] API documentation
  - [ ] Contributing guidelines

---

## 📝 Bug Fixes & Small Improvements

### UI/UX Polish
- [ ] Add skeleton loaders for better loading UX
- [ ] Improve form validation messages
- [ ] Add confirmation dialogs for destructive actions
- [ ] Better empty states
- [ ] Improve mobile navigation
- [ ] Add keyboard shortcuts
- [ ] Improve accessibility (ARIA labels)

### Backend Integration Improvements
- [ ] Handle token refresh automatically
- [ ] Better error messages from API
- [ ] Retry failed requests
- [ ] Queue offline actions
- [ ] Better WebSocket handling (future)

### Content Improvements
- [ ] Better placeholder images
- [ ] Improved empty states
- [ ] Help/tutorial content
- [ ] FAQ page
- [ ] Terms of service
- [ ] Privacy policy

---

## 🎯 Roadmap Timeline

### Month 1 (Current)
✅ Complete backend integration  
✅ Core pages and features  
✅ Authentication system  
✅ Profile management  

### Month 2
- Settings page
- Enhanced dashboard
- Subscription page
- Email verification
- Bug fixes

### Month 3
- Reviews & ratings
- Admin panel
- Advanced search
- Performance optimization

### Month 4
- Messaging system
- Booking system
- Payment integration

### Month 5+
- Mobile app
- Advanced analytics
- Additional features based on user feedback

---

## 🤝 How to Contribute

### Adding a New Feature
1. Create a new branch
2. Add feature to appropriate section in this TODO
3. Implement feature
4. Add tests
5. Update documentation
6. Create pull request

### Priority Labels
- 🔴 High - Critical for MVP
- 🟡 Medium - Important but not critical
- 🟢 Low - Nice to have

### Effort Estimates
- **Low**: 1-2 days
- **Medium**: 3-5 days
- **High**: 5-7 days
- **Very High**: 7+ days

---

## 📊 Progress Tracking

### Feature Completion
- ✅ Backend Integration: 95%
- ✅ Core Pages: 85%
- ⚠️ Dashboard: 40%
- ⚠️ Admin Features: 0%
- ⚠️ Messaging: 0%
- ⚠️ Booking: 0%
- ⚠️ Payments: 0%

### Overall Progress
**Current**: 45% Complete  
**Target for MVP**: 75%  
**Full Feature Set**: 100%

---

**Last Updated**: January 2026  
**Next Review**: After Sprint 1 completion

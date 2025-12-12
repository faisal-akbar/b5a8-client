# 🗺️ Local Guide Platform - Frontend

A modern, full-featured platform connecting travelers with passionate local guides who offer authentic, personalized experiences. Built with Next.js 16, TypeScript, and Tailwind CSS, featuring role-based authentication, booking management, payment processing, and comprehensive dashboards for tourists, guides, and admins.

---

## 🧱 Features

### Core Functionality

- **Multi-Role Authentication**: Secure JWT-based authentication for Tourists, Guides, and Admins
- **Tour Listings**: Create, edit, and manage tour listings with rich descriptions, images, and pricing
- **Advanced Search & Filtering**: Search tours by destination, category, price range, language, and more
- **Booking System**: Complete booking workflow with availability management and status tracking
- **Payment Integration**: Stripe payment processing with secure checkout and payment release
- **Review & Rating**: Post-tour review system for tourists to rate guides
- **Wishlist**: Save favorite tours for later booking
- **Availability Management**: Guides can set specific dates and times for tour availability
- **Badge System**: Achievement badges for guides (Super Guide, Newcomer, Foodie Expert, etc.)
- **Admin Dashboard**: Comprehensive admin panel for managing users, listings, bookings, and analytics

### User Experience

- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Built with shadcn/ui and Radix UI components
- **Real-time Updates**: Dynamic data fetching and state management
- **Form Validation**: Zod schema validation for all forms
- **Error Handling**: Robust error handling and user feedback
- **Loading States**: Skeleton loaders and suspense boundaries for better UX

---

## 🧩 Tech Stack

- **Next.js 16** — React framework with App Router and Server Components
- **TypeScript** — Full type safety across the application
- **Tailwind CSS v4** — Utility-first CSS framework
- **shadcn/ui** — Modern, accessible UI component library
- **Radix UI** — Unstyled, accessible component primitives
- **React Hook Form** — Performant form library
- **Zod** — TypeScript-first schema validation
- **Stripe** — Payment processing integration
- **Framer Motion** — Smooth animations and transitions
- **TanStack Table** — Powerful data table component
- **date-fns** — Date utility library
- **Sonner** — Toast notification system
- **Cloudinary** — Image and video storage
- **vercel** — Deployment platform

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Backend API server running (see backend repository)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd b5a8-client

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Update .env.local with your configuration
NEXT_PUBLIC_BASE_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_....
JWT_ACCESS_SECRET=secret
NODE_ENV=development

# 5. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
.
├── app/
│   ├── (commonLayout)/          # Public pages layout
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── login/           # Login page
│   │   │   ├── register/        # Registration page
│   │   │   ├── forgot-password/ # Password recovery
│   │   │   └── verify-otp/      # OTP verification
│   │   ├── explore/             # Tour search and filtering
│   │   ├── tours/[id]/          # Tour details page
│   │   ├── profile/[id]/         # Public profile pages
│   │   ├── become-guide/         # Guide registration CTA
│   │   ├── payment/             # Payment pages
│   │   │   ├── [bookingId]/     # Payment checkout
│   │   │   └── success/         # Payment success page
│   │   └── page.tsx             # Homepage
│   ├── (dashboardLayout)/       # Authenticated dashboard layout
│   │   ├── guide/               # Guide dashboard
│   │   │   └── dashboard/
│   │   │       ├── listings/    # Listing management
│   │   │       ├── availability/# Availability management
│   │   │       └── payments/    # Payment management
│   │   ├── tourist/             # Tourist dashboard
│   │   │   └── dashboard/       # Bookings, wishlist
│   │   ├── admin/               # Admin dashboard
│   │   │   └── dashboard/
│   │   │       ├── users-management/    # User management
│   │   │       ├── listings-management/  # Listing management
│   │   │       └── booking-management/  # Booking management
│   │   └── profile/             # User profile management
│   ├── globals.css              # Global styles
│   └── layout.tsx              # Root layout
├── components/
│   ├── auth/                   # Authentication components
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── availability/           # Availability management
│   │   ├── availability-client.tsx
│   │   ├── availability-table.tsx
│   │   ├── availability-create-dialog.tsx
│   │   ├── availability-edit-dialog.tsx
│   │   └── availability-delete-dialog.tsx
│   ├── dashboard/              # Dashboard components
│   │   ├── data-table.tsx
│   │   ├── dashboard-pagination.tsx
│   │   └── stat-card.tsx
│   ├── layout/                 # Layout components
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── modals/                 # Modal components
│   │   ├── booking-confirmation-modal.tsx
│   │   ├── booking-details-modal.tsx
│   │   └── review-modal.tsx
│   ├── payments/               # Payment components
│   │   ├── payment-form.tsx
│   │   ├── payments-client.tsx
│   │   ├── payments-table.tsx
│   │   └── payment-release-dialog.tsx
│   ├── profile/                # Profile components
│   │   ├── profile-header.tsx
│   │   ├── guide-profile.tsx
│   │   ├── tourist-profile.tsx
│   │   ├── admin-profile.tsx
│   │   └── edit-profile-dialog.tsx
│   ├── sections/               # Homepage sections
│   │   ├── hero-section.tsx
│   │   ├── search-section.tsx
│   │   ├── categories-section.tsx
│   │   ├── destinations-section.tsx
│   │   ├── guides-section.tsx
│   │   ├── how-it-works-section.tsx
│   │   ├── features-section.tsx
│   │   ├── testimonials-section.tsx
│   │   └── cta-section.tsx
│   ├── tours/                  # Tour components
│   │   └── tour-details-client.tsx
│   ├── shared/                 # Shared components
│   │   ├── InputFieldError.tsx
│   │   └── stat-card.tsx
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       └── ...
├── services/                   # API service layer
│   ├── auth/                   # Authentication services
│   ├── listing/                # Listing services
│   ├── booking/                # Booking services
│   ├── payment/                # Payment services
│   ├── review/                 # Review services
│   ├── availability/           # Availability services
│   ├── wishlist/               # Wishlist services
│   ├── user/                   # User services
│   ├── badge/                  # Badge services
│   └── stats/                  # Statistics services
├── lib/                        # Utility functions
│   ├── auth-context.tsx        # Auth context provider
│   ├── auth-utils.ts           # Auth utilities
│   ├── server-fetch.ts         # Server-side fetch helper
│   ├── stripe.ts               # Stripe configuration
│   └── utils.ts                # General utilities
├── types/                      # TypeScript type definitions
│   ├── guide.ts
│   └── profile.ts
├── zod/                        # Zod validation schemas
│   ├── auth.validation.ts
│   ├── listing.validation.ts
│   ├── availability.validation.ts
│   └── user.validation.ts
├── hooks/                      # Custom React hooks
│   └── useDebounce.ts
├── constants/                  # Application constants
│   └── service-fee.ts
└── public/                     # Static assets
```

---

## 🎨 Key Features Breakdown

### Homepage (`/`)

- **Hero Section**: Hero section with search, categories, destination filters functionality
- **Search Section**: Quick search bar for finding tours
- **Categories Section**: Browse tours by category (Food, Art, Adventure, etc.)
- **Destinations Section**: Featured cities and popular destinations
- **Guides Section**: Top-rated guides showcase
- **How It Works**: Step-by-step guide for using the platform
- **Features Section**: Platform highlights and benefits
- **Testimonials Section**: User reviews and testimonials
- **CTA Section**: Call-to-action for becoming a guide

### Authentication

- **Registration**: Role-based registration (Tourist/Guide) with profile setup
- **Login**: Secure email/password authentication with JWT tokens
- **Password Recovery**: Forgot password flow with OTP verification
- **OTP Verification**: Email-based OTP for password reset
- **Token Management**: Automatic token refresh and secure storage

### Explore Tours (`/explore`)

- **Advanced Filtering**: Filter by category, city, price range, language
- **Search Functionality**: Full-text search across tour listings
- **Pagination**: Efficient pagination for large result sets
- **Sorting Options**: Sort by price, rating, date, etc.
- **Responsive Grid**: Beautiful tour card layout

### Tour Details (`/tours/[id]`)

- **Rich Tour Information**: Detailed descriptions, images, itinerary
- **Guide Profile**: Guide information and ratings
- **Availability Calendar**: View and select available dates
- **Booking Widget**: Select date/time and request booking
- **Reviews Section**: Read past traveler reviews
- **Image Gallery**: Multiple tour images with lightbox
- **Pricing Details**: Transparent pricing with service fees

### Tourist Dashboard (`/tourist/dashboard`)

- **My Bookings**: View upcoming and past bookings
- **Booking Management**: View details, cancel bookings, make payments
- **Wishlist**: Saved tours for later booking
- **Payment History**: Track all payment transactions
- **Review Management**: Leave reviews for completed tours

### Guide Dashboard (`/guide/dashboard`)

- **My Listings**: Create, edit, and manage tour listings
- **Availability Management**: Set available dates and times
- **Booking Requests**: Accept or decline booking requests
- **Booking Management**: View and manage all bookings
- **Payment Tracking**: View earnings and payment status
- **Statistics**: Tour performance and booking analytics

### Admin Dashboard (`/admin/dashboard`)

- **User Management**: View, block, and manage all users
- **Listing Management**: Approve, edit, or remove tour listings
- **Booking Management**: Monitor all bookings across the platform
- **Analytics**: Comprehensive statistics and revenue reports
- **Badge Management**: Recalculate and manage guide badges

### Profile Management (`/profile`)

- **Profile View**: Public profile with stats and reviews
- **Profile Edit**: Update profile information, bio, languages
- **Guide-Specific**: Expertise areas and daily rate
- **Tourist-Specific**: Travel preferences
- **Image Upload**: Profile picture management

### Payment System

- **Stripe Integration**: Secure payment processing
- **Payment Checkout**: Complete payment flow for bookings
- **Payment Release**: Guides can release payments after tour completion
- **Payment History**: Track all payment transactions
- **Service Fee**: Transparent service fee calculation

### Availability Management

- **Create Availability**: Set specific dates and times for tours
- **Bulk Creation**: Create multiple availability slots at once
- **Edit/Delete**: Manage existing availability slots
- **Quick Add**: Fast availability creation interface

### Review System

- **Post-Tour Reviews**: Tourists can review guides after completion
- **Rating System**: 1-5 star rating system
- **Review Display**: Show reviews on guide profiles and tour pages
- **Review Management**: Edit or delete own reviews

---

## 🌐 API Integration

The frontend integrates with a comprehensive REST API. Key endpoints include:

### Authentication

- `POST /auth/register` - Register new user (Tourist/Guide)
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/change-password` - Change password (authenticated)

### User Management

- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user profile
- `GET /users/top-rated-guides` - Get top-rated guides
- `GET /users` - Get all users (Admin)
- `PATCH /users/:id/block` - Block user (Admin)
- `POST /users/create-admin` - Create admin account (Admin)

### Listings

- `GET /listings` - Get all listings with filters
- `GET /listings/:id` - Get listing by ID
- `GET /listings/featured-cities` - Get featured cities
- `GET /listings/categories` - Get distinct categories
- `GET /listings/my-listings` - Get guide's listings
- `POST /listings` - Create listing (Guide)
- `PATCH /listings/:id` - Update listing (Guide)
- `DELETE /listings/:id` - Delete listing (Guide)

### Availability

- `GET /availabilities` - Get all availabilities
- `GET /availabilities/:id` - Get availability by ID
- `GET /availabilities/my-availabilities` - Get guide's availabilities
- `POST /availabilities` - Create availability (Guide)
- `POST /availabilities/bulk` - Create bulk availability (Guide)
- `PATCH /availabilities/:id` - Update availability (Guide)
- `DELETE /availabilities/:id` - Delete availability (Guide)

### Bookings

- `POST /bookings` - Create booking (Tourist)
- `GET /bookings/my-bookings` - Get tourist's bookings
- `GET /bookings/guide-bookings` - Get guide's bookings
- `GET /bookings` - Get all bookings (Admin)
- `GET /bookings/:id` - Get booking by ID
- `PATCH /bookings/:id/status` - Update booking status (Guide)

### Payments

- `POST /payments/confirm` - Confirm payment (Tourist)
- `GET /payments/my-payments` - Get user's payments
- `GET /payments/booking/:bookingId` - Get payment by booking ID
- `GET /payments/:id` - Get payment by ID
- `POST /payments/:id/release` - Release payment to guide

### Reviews

- `GET /reviews` - Get all reviews
- `GET /reviews/:id` - Get review by ID
- `POST /reviews` - Create review (Tourist)
- `PATCH /reviews/:id` - Update review (Tourist)
- `DELETE /reviews/:id` - Delete review (Tourist)
- `GET /reviews/guide/:guideId` - Get reviews by guide ID
- `GET /reviews/reviewable-bookings` - Get reviewable bookings (Tourist)

### Wishlist

- `POST /wishlist` - Add to wishlist (Tourist)
- `GET /wishlist` - Get wishlist (Tourist)
- `GET /wishlist/check/:listingId` - Check wishlist status
- `DELETE /wishlist/:listingId` - Remove from wishlist (Tourist)

### Badges

- `GET /badges/guide/:guideId` - Get guide badges
- `POST /badges/recalculate/:guideId` - Recalculate badges (Admin)
- `POST /badges/recalculate-all` - Recalculate all badges (Admin)

### Statistics (Admin)

- `GET /stats/overview` - Get overview statistics
- `GET /stats/users` - Get user statistics
- `GET /stats/tourists` - Get tourist statistics
- `GET /stats/guides` - Get guide statistics
- `GET /stats/listings` - Get listing statistics
- `GET /stats/bookings` - Get booking statistics
- `GET /stats/revenue` - Get revenue statistics
- `GET /stats/profit` - Get profit statistics

### OTP

- `POST /otp/send` - Send OTP
- `POST /otp/verify` - Verify OTP

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API URL
NEXT_PUBLIC_BASE_API_URL=http://localhost:5000/api/v1

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## 🎯 User Roles & Permissions

### Tourist

- Browse and search tours
- View tour details and guide profiles
- Create booking requests
- Make payments
- Leave reviews after tour completion
- Manage wishlist
- View booking history

### Guide

- Create and manage tour listings
- Set availability dates and times
- Accept or decline booking requests
- View booking details and manage bookings
- Track earnings and payments
- View reviews and ratings

### Admin

- Manage all users (view, block, create admin)
- Manage all listings (approve, edit, delete)
- Monitor all bookings
- View comprehensive analytics and statistics
- Manage guide badges
- Access revenue and profit reports

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Setup

Ensure all environment variables are configured in your deployment platform (Vercel, Netlify, etc.)

### Backend Requirements

- Backend API server must be running and accessible
- CORS must be configured to allow frontend domain
- Database must be properly configured

---

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all code
- Prefer `type` over `interface` for consistency
- Use PascalCase for components and types
- Follow Next.js App Router conventions
- Use Server Components where possible

### Component Structure

- Server Components for data fetching
- Client Components for interactivity
- Shared UI components in `components/ui/`
- Feature-specific components in respective folders

### Form Handling

- Use React Hook Form for all forms
- Validate with Zod schemas
- Display errors using `InputFieldError` component

### API Integration

- Use service layer in `services/` directory
- Handle errors gracefully
- Show loading states during API calls
- Use toast notifications for user feedback

---

## 🐛 Troubleshooting

### Backend Connection Issues

If you see connection errors, ensure:

- Backend server is running on the configured port
- `NEXT_PUBLIC_BASE_API_URL` is correctly set
- CORS is properly configured on the backend

### Stripe Payment Issues

- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Ensure Stripe account is properly configured
- Check browser console for detailed error messages

### Authentication Issues

- Clear browser cookies
- Verify JWT token is being stored correctly
- Check token expiration and refresh logic

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [Zod Documentation](https://zod.dev/)

---

## 👨‍💻 Author

Faisal Akbar

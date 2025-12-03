# LocalGuide Platform - Frontend

This is the frontend application for the LocalGuide Platform, built with [Next.js](https://nextjs.org) 16.

## Prerequisites

- Node.js 20.9+ 
- npm, yarn, pnpm, or bun
- Backend server running (see Backend Setup below)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Backend API URL
NEXT_PUBLIC_BASE_API_URL=http://localhost:5000/api/v1

# JWT Secret (must match backend JWT_ACCESS_SECRET)
JWT_ACCESS_SECRET=your-jwt-secret-key-here
```

**Important:** The `JWT_ACCESS_SECRET` must match the `JWT_ACCESS_SECRET` in your backend server's environment variables.

### 3. Start the Backend Server

**Before starting the frontend, you must start the backend server:**

```bash
cd b5a8-server
npm install
npm run dev
```

The backend server should be running on `http://localhost:5000`

### 4. Start the Frontend Development Server

In a new terminal (keep the backend server running):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
app/
├── (commonLayout)/          # Public pages with navbar/footer
│   ├── (auth)/             # Authentication pages
│   ├── explore/            # Tour search/explore
│   ├── tours/              # Tour detail pages
│   └── profile/            # User profile pages
└── (dashboardLayout)/       # Protected dashboard pages
    ├── admin/dashboard/    # Admin dashboard
    ├── guide/dashboard/    # Guide dashboard
    └── tourist/dashboard/  # Tourist dashboard

lib/                        # Utility functions
services/                   # API service functions
zod/                        # Validation schemas
components/                 # React components
```

## Troubleshooting

### Backend Connection Error

If you see `ECONNREFUSED` or "Cannot connect to backend server" errors:

1. **Check if backend server is running:**
   ```bash
   cd b5a8-server
   npm run dev
   ```

2. **Verify the backend URL in `.env.local`:**
   ```bash
   NEXT_PUBLIC_BASE_API_URL=http://localhost:5000/api/v1
   ```

3. **Check backend server logs** to ensure it started successfully

### JWT Token Errors

If you see JWT-related errors:

1. Ensure `JWT_ACCESS_SECRET` in `.env.local` matches `JWT_ACCESS_SECRET` in backend `.env`
2. Restart both frontend and backend servers after changing JWT secrets

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [LocalGuide Requirements](./LocalGuide.md)

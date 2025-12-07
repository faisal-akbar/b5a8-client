# Explore Tours Page

## Overview
The Explore page is a fully-functional tour discovery interface that allows users to search, filter, and browse available tour listings. It implements server-side rendering with client-side interactivity for optimal performance and user experience.

## Architecture

### Server Component (`page.tsx`)
- Handles initial data fetching on the server
- Parses URL search parameters
- Fetches listings from the API with filters
- Provides loading states via Suspense
- Passes initial data to client component

### Client Component (`explore-client.tsx`)
- Manages interactive filtering UI
- Handles URL-based state management
- Provides real-time filter updates
- Implements pagination
- Shows active filters with clear options

## Features

### 🔍 Search Functionality
- **Search Term**: Full-text search across:
  - Title
  - Description
  - City
  - Meeting Point
- **City Search**: Dedicated city/location filter

### 🎯 Filtering Options

#### 1. **Price Range**
- Min/Max price slider (0 - $1000)
- Dynamic price range selection
- Apply button to trigger filter

#### 2. **Category**
- Popular categories displayed as badges
- Single category selection
- Mapped from backend enum to display names
- Includes: Food, History, Culture, Adventure, Photography, etc.

#### 3. **Language**
- Dropdown selection
- Filters by guide's spoken languages
- Supports multiple languages:
  - English, Spanish, French, German, Italian
  - Japanese, Chinese, Arabic, Portuguese, Russian

### 📄 Pagination
- Server-side pagination
- Smart page number display with ellipsis
- Previous/Next navigation
- URL-based page state

### 🏷️ Active Filters Display
- Visual badges showing active filters
- Individual filter removal (X button)
- "Clear all" option
- Real-time URL updates

### 🎨 Tour Card Display
Each tour card shows:
- Primary image with hover zoom effect
- Category badge
- Title and guide name
- City/location
- Price per person
- Average rating and review count
- Duration (days)
- Max group size
- Truncated description
- Inactive badge (if listing is not active)

## Technical Implementation

### URL-Based State Management
All filters are stored in URL search parameters:
```
/explore?page=1&city=Tokyo&category=FOOD&minPrice=50&maxPrice=200&language=English
```

Benefits:
- Shareable URLs
- Browser back/forward support
- Server-side rendering compatible
- SEO-friendly

### Data Flow
1. **Server Component** fetches initial data based on URL params
2. **Client Component** receives initial data as props
3. User interactions update URL via `useRouter`
4. Next.js re-renders server component with new params
5. New data is fetched and passed to client component

### API Integration
Uses the `getAllListings` service function with parameters:
- `page`: Current page number
- `limit`: Items per page (default: 12)
- `city`: City filter (case-insensitive search)
- `category`: Category enum value
- `minPrice`: Minimum tour fee
- `maxPrice`: Maximum tour fee
- `language`: Guide language filter

### Type Safety
- Full TypeScript implementation
- Uses `GuideListing` type from `/types/guide.ts`
- Category mapping with proper enum types
- Pagination metadata typing

## Usage Examples

### Basic Search
```
/explore?searchTerm=food+tour
```

### City Filter
```
/explore?city=Tokyo
```

### Combined Filters
```
/explore?city=Paris&category=PHOTOGRAPHY&minPrice=50&maxPrice=150&language=French
```

### Paginated Results
```
/explore?page=2&limit=12&category=ADVENTURE
```

## Performance Optimizations

1. **Server-Side Rendering**: Initial data fetched on server
2. **Suspense Boundaries**: Loading states during navigation
3. **Transition States**: Smooth UI updates with `useTransition`
4. **Image Optimization**: Uses Next.js Image component (can be added)
5. **Debounced Search**: Price range uses apply button to reduce API calls

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Future Enhancements

### Possible Additions
- [ ] Sort options (price, rating, date)
- [ ] Date availability filter
- [ ] Map view integration
- [ ] Save search functionality
- [ ] Recently viewed tours
- [ ] Tour comparison feature
- [ ] Wishlist integration
- [ ] Advanced filters (duration, group size, rating)
- [ ] Infinite scroll option
- [ ] Tour preview on hover

## Related Files
- `/services/listing/listing.service.ts` - API service
- `/types/guide.ts` - Type definitions
- `/types/profile.ts` - Category enum
- Backend: `/b5a8-server/src/app/modules/listing/` - API endpoints

## Testing Checklist
- [ ] Search functionality works
- [ ] All filters apply correctly
- [ ] Pagination navigates properly
- [ ] URL updates reflect filters
- [ ] Back/forward browser buttons work
- [ ] Mobile responsive design
- [ ] Loading states display
- [ ] Empty state shows when no results
- [ ] Clear filters resets all selections
- [ ] Individual filter removal works
- [ ] Price slider updates correctly


# Testing Checklist: Intercepting Routes Implementation

## Pre-Testing Setup

- [ ] Start the development server: `npm run dev`
- [ ] Open browser to `http://localhost:3000`
- [ ] Open browser DevTools (Console + Network tabs)

---

## Test Suite 1: Modal from Home Page

### Test 1.1: Search Box Navigation ✓
**Steps:**
1. Navigate to home page (`/`)
2. Locate SearchSection component
3. Type "Paris" in the search input
4. Click "Search" button

**Expected Results:**
- [ ] Modal opens with Dialog overlay
- [ ] URL updates to `/explore?searchTerm=Paris`
- [ ] Tours filtered by "Paris" visible in modal
- [ ] Background (home page) is dimmed/blurred
- [ ] Close button (X) visible in top-right
- [ ] Modal is scrollable if content overflows

### Test 1.2: Empty Search
**Steps:**
1. Navigate to home page (`/`)
2. Leave search input empty
3. Click "Search" button

**Expected Results:**
- [ ] Modal opens
- [ ] URL is `/explore` (no searchTerm param)
- [ ] All tours displayed (no filter)

### Test 1.3: Popular Cities
**Steps:**
1. Navigate to home page (`/`)
2. Click "Miami" badge in popular cities

**Expected Results:**
- [ ] Modal opens immediately
- [ ] URL updates to `/explore?searchTerm=Miami`
- [ ] Tours filtered by "Miami"

**Repeat for each city:**
- [ ] New York
- [ ] Los Angeles
- [ ] California

### Test 1.4: Category Cards
**Steps:**
1. Navigate to home page (`/`)
2. Scroll to "Explore by Interest" section
3. Click "Food" category card

**Expected Results:**
- [ ] Modal opens
- [ ] URL updates to `/explore?category=FOOD`
- [ ] Only food tours visible
- [ ] Category badge shows "Food" as selected

**Repeat for each category:**
- [ ] History
- [ ] Wildlife
- [ ] Shopping
- [ ] Nightlife
- [ ] Adventure
- [ ] Beach
- [ ] Nature

---

## Test Suite 2: Modal Interaction

### Test 2.1: Close Modal via Button
**Steps:**
1. Open modal (any method)
2. Click X button in top-right

**Expected Results:**
- [ ] Modal closes with animation
- [ ] Returns to home page
- [ ] URL is `/` (back to home)
- [ ] No console errors

### Test 2.2: Close Modal via Outside Click
**Steps:**
1. Open modal (any method)
2. Click outside the modal (on overlay)

**Expected Results:**
- [ ] Modal closes
- [ ] Returns to home page
- [ ] URL updates correctly

### Test 2.3: Close Modal via Escape Key
**Steps:**
1. Open modal (any method)
2. Press ESC key

**Expected Results:**
- [ ] Modal closes
- [ ] Returns to home page

### Test 2.4: Modal Scrolling
**Steps:**
1. Open modal with many results
2. Scroll within modal

**Expected Results:**
- [ ] Modal content scrolls
- [ ] Background stays fixed
- [ ] Scrollbar visible only on modal
- [ ] Smooth scrolling

---

## Test Suite 3: Filters in Modal

### Test 3.1: Search Filter in Modal
**Steps:**
1. Open modal from home
2. Type "London" in modal search bar
3. Wait for debounce (500ms)

**Expected Results:**
- [ ] URL updates to include searchTerm
- [ ] Results filter automatically
- [ ] "Search: London" badge appears
- [ ] Can click X on badge to clear

### Test 3.2: Category Filter in Modal
**Steps:**
1. Open modal (any initial filter)
2. Click "Adventure" category badge in filters

**Expected Results:**
- [ ] URL updates with category=ADVENTURE
- [ ] Results filter to adventure tours
- [ ] "Adventure" badge appears in active filters
- [ ] Can click X to remove filter

### Test 3.3: Price Filter in Modal
**Steps:**
1. Open modal
2. Adjust price slider (e.g., 100-500)
3. Click "Apply Price Filter"

**Expected Results:**
- [ ] URL updates with minPrice and maxPrice
- [ ] Results filter to price range
- [ ] "$100 - $500" badge appears
- [ ] Can click X to reset price

### Test 3.4: Language Filter in Modal
**Steps:**
1. Open modal
2. Click language dropdown
3. Select "Spanish"

**Expected Results:**
- [ ] URL updates with language=Spanish
- [ ] Results filter to Spanish tours
- [ ] "Spanish" badge appears
- [ ] Can click X to clear language

### Test 3.5: Multiple Filters
**Steps:**
1. Open modal
2. Apply: searchTerm="Paris", category="FOOD", minPrice=50
3. Observe results

**Expected Results:**
- [ ] URL has all parameters
- [ ] Results match ALL filters (intersection)
- [ ] All filter badges visible
- [ ] "Clear all" button visible

### Test 3.6: Clear All Filters
**Steps:**
1. Apply multiple filters
2. Click "Clear all" button

**Expected Results:**
- [ ] All filters reset
- [ ] URL is `/explore` (no params)
- [ ] All tours displayed
- [ ] No filter badges visible

---

## Test Suite 4: Full Page Access

### Test 4.1: Direct URL Navigation
**Steps:**
1. Type `/explore` in address bar
2. Press Enter

**Expected Results:**
- [ ] Full page loads (NO modal)
- [ ] Navbar visible at top
- [ ] Footer visible at bottom
- [ ] All tours displayed
- [ ] Filters sidebar visible

### Test 4.2: Direct URL with Filters
**Steps:**
1. Type `/explore?category=FOOD&searchTerm=Paris` in address bar
2. Press Enter

**Expected Results:**
- [ ] Full page loads (NO modal)
- [ ] Filters applied correctly
- [ ] URL parameters preserved
- [ ] Filter badges visible

### Test 4.3: Page Refresh
**Steps:**
1. Open modal from home with filters
2. Press Cmd+R (or F5) to refresh

**Expected Results:**
- [ ] Modal disappears
- [ ] Full page loads instead
- [ ] Filters preserved from URL
- [ ] No modal wrapper

### Test 4.4: Full Page Filter Changes
**Steps:**
1. Navigate to `/explore` directly
2. Apply filters (search, category, price)
3. Observe behavior

**Expected Results:**
- [ ] Filters work exactly like modal
- [ ] URL updates with parameters
- [ ] Results filter correctly
- [ ] No modal appears

---

## Test Suite 5: Browser Navigation

### Test 5.1: Back Button from Modal
**Steps:**
1. Home page → Open modal
2. Click browser back button

**Expected Results:**
- [ ] Modal closes
- [ ] Returns to home page
- [ ] URL is `/`
- [ ] No page reload

### Test 5.2: Forward Button to Modal
**Steps:**
1. Home → Modal → Back
2. Click browser forward button

**Expected Results:**
- [ ] Modal reopens
- [ ] Same filters applied
- [ ] URL restored

### Test 5.3: Multiple Navigation
**Steps:**
1. Home → Search "Paris" → Back
2. Home → Category "Food" → Back
3. Click forward twice

**Expected Results:**
- [ ] History stack correct
- [ ] Each forward shows correct modal
- [ ] Filters preserved

### Test 5.4: Back from Full Page
**Steps:**
1. Navigate to `/explore` directly
2. Click browser back button

**Expected Results:**
- [ ] Goes to previous page (not home)
- [ ] Normal browser history behavior
- [ ] No modal behavior

---

## Test Suite 6: URL Synchronization

### Test 6.1: Shareable URLs (Modal)
**Steps:**
1. Open modal with filters
2. Copy URL from address bar
3. Open URL in new tab

**Expected Results:**
- [ ] Full page loads (not modal, different context)
- [ ] Filters applied from URL
- [ ] Results match original

### Test 6.2: Shareable URLs (Direct)
**Steps:**
1. Navigate to `/explore?category=FOOD`
2. Copy URL
3. Share with someone / open in new tab

**Expected Results:**
- [ ] Full page loads with filters
- [ ] Category "Food" selected
- [ ] Results correct

### Test 6.3: Query Parameter Encoding
**Steps:**
1. Search for "New York City"
2. Check URL in address bar

**Expected Results:**
- [ ] URL encoded properly (`New%20York%20City`)
- [ ] Decodes correctly on page load
- [ ] Special characters handled

---

## Test Suite 7: Pagination

### Test 7.1: Pagination in Modal
**Steps:**
1. Open modal with many results
2. Change page number dropdown
3. Select page 2

**Expected Results:**
- [ ] URL updates with page=2
- [ ] Results for page 2 displayed
- [ ] Pagination controls updated
- [ ] Stays in modal (no close)

### Test 7.2: Items Per Page
**Steps:**
1. Open modal
2. Change "Rows per page" to 20
3. Observe

**Expected Results:**
- [ ] URL updates with limit=20
- [ ] Resets to page 1
- [ ] 20 items displayed
- [ ] Total pages recalculated

---

## Test Suite 8: Responsive Design

### Test 8.1: Mobile Modal
**Steps:**
1. Resize browser to mobile (375px)
2. Open modal from home

**Expected Results:**
- [ ] Modal takes full screen
- [ ] Filters toggle via button
- [ ] Search bar full width
- [ ] Scrollable

### Test 8.2: Tablet View
**Steps:**
1. Resize to tablet (768px)
2. Open modal

**Expected Results:**
- [ ] Modal properly sized
- [ ] Filters visible/collapsible
- [ ] Grid layout adjusts

### Test 8.3: Desktop
**Steps:**
1. Full desktop size (1920px)
2. Open modal

**Expected Results:**
- [ ] Modal centered (95vw × 90vh)
- [ ] Filters sidebar visible
- [ ] Optimal layout

---

## Test Suite 9: Performance

### Test 9.1: Search Debouncing
**Steps:**
1. Open modal
2. Type quickly in search: "P-a-r-i-s"
3. Count API calls in Network tab

**Expected Results:**
- [ ] Only 1 API call (after 500ms pause)
- [ ] No call on every keystroke
- [ ] Smooth typing experience

### Test 9.2: Filter Transitions
**Steps:**
1. Open modal
2. Rapidly change filters

**Expected Results:**
- [ ] useTransition prevents blocking
- [ ] UI stays responsive
- [ ] No crashes or errors

### Test 9.3: Large Result Sets
**Steps:**
1. Open modal with no filters (all tours)
2. Scroll through results

**Expected Results:**
- [ ] Smooth scrolling
- [ ] No layout shifts
- [ ] Images load properly

---

## Test Suite 10: Error Handling

### Test 10.1: No Results
**Steps:**
1. Search for gibberish "xyzabc123"

**Expected Results:**
- [ ] "No tours found" message
- [ ] Search icon displayed
- [ ] "Clear all filters" button shown
- [ ] No errors in console

### Test 10.2: API Failure
**Steps:**
1. Stop backend server
2. Try to open modal

**Expected Results:**
- [ ] Graceful error handling
- [ ] Error message displayed
- [ ] No white screen
- [ ] Console shows error (but handled)

### Test 10.3: Invalid URL Parameters
**Steps:**
1. Navigate to `/explore?page=abc&limit=xyz`

**Expected Results:**
- [ ] Fallback to defaults (page=1, limit=12)
- [ ] No JavaScript errors
- [ ] Page loads normally

---

## Test Suite 11: Accessibility

### Test 11.1: Keyboard Navigation
**Steps:**
1. Use only Tab key to navigate
2. Open modal via keyboard
3. Navigate filters

**Expected Results:**
- [ ] Focus indicators visible
- [ ] Can reach all interactive elements
- [ ] Modal traps focus
- [ ] ESC closes modal

### Test 11.2: Screen Reader
**Steps:**
1. Enable VoiceOver (Mac) or NVDA (Windows)
2. Navigate the modal

**Expected Results:**
- [ ] Modal announced
- [ ] Filters announced
- [ ] Results announced
- [ ] ARIA labels present

### Test 11.3: Color Contrast
**Steps:**
1. Check all text in modal
2. Use contrast checker tool

**Expected Results:**
- [ ] All text meets WCAG AA
- [ ] Badges readable
- [ ] Hover states visible

---

## Test Suite 12: Edge Cases

### Test 12.1: Rapid Open/Close
**Steps:**
1. Quickly open and close modal 10 times

**Expected Results:**
- [ ] No memory leaks
- [ ] No console errors
- [ ] Smooth transitions

### Test 12.2: Multiple Tabs
**Steps:**
1. Open modal in tab 1
2. Open same URL in tab 2

**Expected Results:**
- [ ] Tab 1: Modal (if from home)
- [ ] Tab 2: Full page (new context)
- [ ] Both work independently

### Test 12.3: Browser Extension Interference
**Steps:**
1. Enable ad blockers, privacy tools
2. Test modal functionality

**Expected Results:**
- [ ] Modal still works
- [ ] No blocked resources
- [ ] Images load

---

## Post-Testing Verification

- [ ] No console errors throughout testing
- [ ] No network errors (except Test 10.2)
- [ ] All URLs valid and shareable
- [ ] TypeScript compiled without errors
- [ ] Linter shows no warnings
- [ ] Build succeeds: `npm run build`

---

## Performance Benchmarks

Run these checks:

```bash
# Check bundle size
npm run build
# Look for modal chunk size

# Lighthouse score (full page)
# Should be 90+ on all metrics

# Check for memory leaks
# Open/close modal 100 times
# Memory should stabilize
```

---

## Known Limitations

Document any issues found:

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## Sign-off

- [ ] All critical tests passing
- [ ] Documentation complete
- [ ] Ready for production
- [ ] Team review completed

**Tested by:** _________________  
**Date:** _________________  
**Environment:** Dev / Staging / Production  
**Browser(s):** _________________  
**Device(s):** _________________


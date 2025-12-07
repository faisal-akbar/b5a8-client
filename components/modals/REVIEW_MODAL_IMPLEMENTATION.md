# View/Edit Review Modal Implementation

## 🎯 Overview
Implemented a comprehensive review modal that supports both creating new reviews and viewing/editing existing reviews with a clean, intuitive interface.

---

## ✅ What Was Implemented

### **1. New Service Function**
Added `getReviewByBookingId()` in `review.service.ts`:
```typescript
export async function getReviewByBookingId(bookingId: string)
```
- Fetches existing review for a specific booking
- Uses endpoint: `GET /reviews/booking/${bookingId}`

### **2. Enhanced ReviewModal Component**
Completely redesigned to support **two modes**:

#### **Create Mode** (Default)
- Write a new review
- Select rating (1-5 stars)
- Write review text
- Submit button

#### **Edit Mode** (View/Edit Existing)
- **View State**: Display existing review (read-only)
- **Edit State**: Modify rating and review text
- Toggle between view and edit
- Update button

---

## 🎨 Modal Features

### **Three States:**

#### 1️⃣ **Create Mode**
```
┌──────────────────────────┐
│ Write a Review           │
├──────────────────────────┤
│ ⭐⭐⭐⭐⭐              │
│ [Your Review Textarea]   │
├──────────────────────────┤
│ [Cancel] [Submit Review] │
└──────────────────────────┘
```

#### 2️⃣ **View Mode** (Existing Review)
```
┌──────────────────────────┐
│ Your Review              │
├──────────────────────────┤
│ ⭐⭐⭐⭐⭐ (Read-only)  │
│ [Review Text - Disabled] │
├──────────────────────────┤
│ [Close] [Edit Review]    │
└──────────────────────────┘
```

#### 3️⃣ **Edit Mode** (Modifying Existing)
```
┌──────────────────────────┐
│ Edit Review              │
├──────────────────────────┤
│ ⭐⭐⭐⭐⭐ (Editable)   │
│ [Your Review Textarea]   │
├──────────────────────────┤
│ [Cancel] [Update Review] │
└──────────────────────────┘
```

---

## 🔧 Implementation Details

### **Modal Props:**
```typescript
interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  tourTitle: string
  guideName: string
  bookingId: string
  mode?: "create" | "edit"  // NEW: Mode selector
  onSuccess?: () => void
}
```

### **State Management:**
```typescript
const [rating, setRating] = useState(0)
const [review, setReview] = useState("")
const [isEditMode, setIsEditMode] = useState(false)
const [reviewId, setReviewId] = useState<string | null>(null)
const [originalRating, setOriginalRating] = useState(0)
const [originalReview, setOriginalReview] = useState("")
```

### **Load Existing Review:**
```typescript
useEffect(() => {
  if (isOpen && mode === "edit") {
    loadExistingReview()
  }
}, [isOpen, mode, bookingId])
```

---

## 🎬 User Flow

### **Create New Review:**
1. User clicks "Write review" on unreviewed booking
2. Modal opens in **create mode**
3. User selects rating and writes review
4. User clicks "Submit Review"
5. Review is created via API
6. Modal closes, dashboard refreshes

### **View Existing Review:**
1. User clicks "View review" on reviewed booking
2. Modal opens in **edit mode** (view state)
3. Review is loaded via `getReviewByBookingId`
4. User sees their existing review (read-only)
5. User can click "Close" or "Edit Review"

### **Edit Existing Review:**
1. From view state, user clicks "Edit Review"
2. Modal switches to edit state
3. Rating and review become editable
4. User modifies rating/review
5. User clicks "Update Review"
6. Review is updated via API
7. Modal closes, dashboard refreshes

### **Cancel Edit:**
1. User clicks "Cancel" while editing
2. Original values are restored
3. Modal returns to view state

---

## 🔄 Dashboard Integration

### **Updated Tourist Dashboard Client:**

#### **New State:**
```typescript
const [reviewMode, setReviewMode] = useState<"create" | "edit">("create")
```

#### **New Handlers:**
```typescript
// Create new review
const handleWriteReview = (booking: Booking) => {
  setBookingToReview(booking)
  setReviewMode("create")
  setIsReviewModalOpen(true)
}

// View/edit existing review
const handleViewReview = (booking: Booking) => {
  setBookingToReview(booking)
  setReviewMode("edit")
  setIsReviewModalOpen(true)
}
```

#### **Dropdown Menu Actions:**
```typescript
{!booking.reviewed ? (
  <DropdownMenuItem onClick={() => handleWriteReview(booking)}>
    <Star className="mr-2 h-4 w-4" />
    Write review
  </DropdownMenuItem>
) : (
  <DropdownMenuItem onClick={() => handleViewReview(booking)}>
    <MessageCircle className="mr-2 h-4 w-4" />
    View review
  </DropdownMenuItem>
)}
```

---

## 💡 Key Features

### **Smart Loading:**
- ✅ Shows loading spinner while fetching review
- ✅ Handles API errors gracefully
- ✅ Auto-closes on load failure

### **Data Preservation:**
- ✅ Stores original values when entering edit mode
- ✅ Restores original values on cancel
- ✅ Prevents accidental data loss

### **Validation:**
- ✅ Requires rating (1-5 stars)
- ✅ Requires review text
- ✅ Disables submit if validation fails

### **User Feedback:**
- ✅ Loading states during API calls
- ✅ Success/error toast messages
- ✅ Dynamic button text based on mode
- ✅ Star rating descriptions (Excellent, Great, etc.)

### **Accessibility:**
- ✅ Disabled inputs in view mode
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Clear visual states

---

## 📋 API Integration

### **Service Functions Used:**

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `getReviewByBookingId()` | `GET /reviews/booking/:bookingId` | Load existing review |
| `createReview()` | `POST /reviews` | Create new review |
| `updateReview()` | `PATCH /reviews/:id` | Update existing review |

---

## 🎨 Visual States

### **Star Rating:**
- **Hover Effect**: Shows preview of rating
- **Selected State**: Filled stars
- **Unselected State**: Outlined stars
- **Disabled State**: No hover effect in view mode

### **Buttons:**
- **Create Mode**: "Cancel" + "Submit Review"
- **View Mode**: "Close" + "Edit Review"
- **Edit Mode**: "Cancel" + "Update Review"
- **Loading State**: Spinner + "Submitting..." / "Updating..."

### **Dialog Title:**
- **Create**: "Write a Review"
- **View**: "Your Review"
- **Edit**: "Edit Review"

---

## ✅ Testing Checklist

- [x] Create new review works
- [x] View existing review loads correctly
- [x] Edit button switches to edit mode
- [x] Update review saves changes
- [x] Cancel restores original values
- [x] Validation prevents invalid submissions
- [x] Loading states display properly
- [x] Toast messages show success/errors
- [x] Dashboard refreshes after save
- [x] No linting errors

---

## 🎉 Result

The review system now provides a **complete create/view/edit experience**:

✅ **Create reviews** for completed tours  
✅ **View reviews** you've already written  
✅ **Edit reviews** to update rating or comment  
✅ **Seamless UX** with loading states and validation  
✅ **Data safety** with cancel and restore functionality  
✅ **Clean design** matching the application style  

Users can now fully manage their reviews through an intuitive modal interface! 🚀


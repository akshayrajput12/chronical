# Kiosk Manufacturers Image Display Fix

## 🐛 **Issue Identified**
Images were not displaying in both the admin interface and the frontend kiosk manufacturers section due to:

1. **Database Schema Issue**: SQL functions were returning hardcoded placeholder URLs (`https://your-supabase-url.supabase.co`)
2. **Frontend Component Issue**: Component was trying to use placeholder URLs from database
3. **Admin Component Issue**: Admin interface was also using placeholder URLs as fallbacks

## 🔧 **Fixes Applied**

### **Fix 1: Database Schema Update**
**File**: `kiosk/sql/kiosk-manufacturers-schema-fix.sql`

- Updated `get_kiosk_manufacturers_section()` function to return file paths instead of full URLs
- Updated `get_kiosk_manufacturers_images()` function to return file paths instead of full URLs
- Let frontend components handle proper Supabase URL construction

**Key Changes**:
```sql
-- Before (broken)
CONCAT('https://your-supabase-url.supabase.co/storage/v1/object/public/kiosk-manufacturers/', kmi.file_path)

-- After (fixed)
kmi.file_path  -- Return just the file path, let frontend handle URL construction
```

### **Fix 2: Frontend Component Update**
**File**: `src/app/kiosk/components/kiosk-manufacturers.tsx`

- Updated `loadKioskManufacturersData()` function to construct proper Supabase URLs
- Used `supabase.storage.from('kiosk-manufacturers').getPublicUrl()` for proper URL generation

**Key Changes**:
```typescript
// Construct proper image URL if file path exists
let imageUrl = null;
if (manufacturersSection.main_image_url) {
    // Get the public URL from Supabase storage
    const { data: urlData } = supabase.storage
        .from('kiosk-manufacturers')
        .getPublicUrl(manufacturersSection.main_image_url);
    imageUrl = urlData.publicUrl;
}

setManufacturersData({
    ...manufacturersSection,
    main_image_url: imageUrl,
});
```

### **Fix 3: Admin Component Update**
**File**: `src/app/admin/pages/kiosk/manufacturers/page.tsx`

- Updated `loadKioskManufacturersImages()` to construct proper URLs for all images
- Updated `handleImageUpload()` to add proper URLs to newly uploaded images
- Removed all hardcoded placeholder URLs from image rendering

**Key Changes**:
```typescript
// In loadKioskManufacturersImages()
const imagesWithUrls = data.map(image => {
    const { data: urlData } = supabase.storage
        .from('kiosk-manufacturers')
        .getPublicUrl(image.file_path);
    
    return {
        ...image,
        file_url: urlData.publicUrl,
    };
});

// In handleImageUpload()
const { data: urlData } = supabase.storage
    .from('kiosk-manufacturers')
    .getPublicUrl(newImage.file_path);

const imageWithUrl = {
    ...newImage,
    file_url: urlData.publicUrl,
};
```

## 📋 **Steps to Apply the Fix**

### **Step 1: Update Database Functions**
Run the schema fix script in Supabase SQL Editor:
```sql
-- Copy and paste the content from kiosk/sql/kiosk-manufacturers-schema-fix.sql
```

### **Step 2: Frontend and Admin Updates**
The frontend and admin components have been automatically updated with proper URL construction.

### **Step 3: Verification**
1. **Admin Interface**: Upload a new image and verify it displays correctly
2. **Frontend**: Check that the main image displays on the kiosk manufacturers section
3. **Image Selection**: Verify that selecting a main image in admin shows correctly in preview

## ✅ **Expected Results**

After applying these fixes:

1. **✅ Admin Interface**: 
   - Images upload and display correctly
   - Image selection works properly
   - Preview shows images correctly

2. **✅ Frontend Component**:
   - Main image displays correctly on the kiosk manufacturers section
   - Fallback handling works for missing images

3. **✅ Database Functions**:
   - Return proper file paths for frontend URL construction
   - No more hardcoded placeholder URLs

## 🔍 **Technical Details**

### **Root Cause**
The issue was caused by the database functions returning hardcoded placeholder URLs instead of letting the frontend construct proper Supabase storage URLs using the official SDK methods.

### **Solution Approach**
1. **Database Layer**: Return file paths only, not full URLs
2. **Frontend Layer**: Use `supabase.storage.getPublicUrl()` for proper URL construction
3. **Consistency**: Apply the same pattern across admin and frontend components

### **Benefits of This Approach**
- ✅ **Proper URL Generation**: Uses official Supabase SDK methods
- ✅ **Environment Agnostic**: Works across different Supabase projects
- ✅ **Maintainable**: No hardcoded URLs to update
- ✅ **Consistent**: Same pattern used across all components

## 🚀 **Verification Commands**

```sql
-- Test the updated database functions
SELECT * FROM get_kiosk_manufacturers_section();
SELECT * FROM get_kiosk_manufacturers_images();
```

The functions should now return file paths in the `main_image_url` and `file_url` fields, which the frontend will convert to proper Supabase storage URLs.

## 📝 **Notes**

- The fix maintains backward compatibility with existing data
- No data migration is required
- The solution follows Supabase best practices for storage URL generation
- All placeholder URLs have been removed from the codebase

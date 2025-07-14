# Portfolio Gallery Setup Guide

This guide will help you set up the portfolio gallery functionality with image upload capabilities.

## Current Status

✅ **Storage Bucket**: `portfolio-gallery-images` bucket exists and is properly configured
✅ **Frontend Code**: Portfolio admin interface is enhanced with drag & drop upload
✅ **Error Handling**: Improved error handling and validation

## Setup Steps

### Step 1: Run the SQL Schema

The portfolio gallery requires database tables and policies. Run the following in your Supabase SQL Editor:

**Go to**: Supabase Dashboard > SQL Editor > New Query

**Copy and paste** the contents of `portfolio/sql/portfolio-gallery-schema.sql`

**Important**: The schema has been updated to handle existing constraints and policies properly using `DROP POLICY IF EXISTS` and conditional constraint creation.

### Step 2: Verify Setup

After running the SQL schema, verify the setup:

1. **Check Tables**: Ensure these tables exist:
   - `portfolio_items`
   - `portfolio_images`

2. **Check Storage Bucket**: 
   - Bucket: `portfolio-gallery-images`
   - Public: Yes
   - File Size Limit: 10MB
   - Allowed Types: JPG, PNG, WebP

3. **Check Policies**: Ensure RLS policies are created for:
   - `portfolio_items` (public read for active, authenticated CRUD)
   - `portfolio_images` (public read, authenticated CRUD)
   - `storage.objects` (public read, authenticated upload for portfolio-gallery-images)

### Step 3: Test the Admin Interface

1. Navigate to `/admin/pages/portfolio`
2. Click "Add Item" to create a new portfolio item
3. Try uploading an image using:
   - Click the upload button
   - Drag and drop an image
   - Enter a manual URL

## Features

### Enhanced Upload Interface

- **Drag & Drop**: Drag images directly onto upload areas
- **Visual Feedback**: Loading states and progress indicators
- **File Validation**: Type and size validation (JPG, PNG, WebP up to 10MB)
- **Error Handling**: Detailed error messages for debugging

### Portfolio Management

- **Grid Layouts**: Choose from 1x1, 1x2, 1x3 grid sizes
- **Display Order**: Organize items with custom ordering
- **Active/Inactive**: Control visibility of items
- **Preview**: See how the gallery will look on the website

## Troubleshooting

### Common Issues

1. **"Portfolio gallery images bucket not found"**
   - Run: `node scripts/create-portfolio-bucket.js`
   - Or manually create the bucket in Supabase Dashboard

2. **"Constraint already exists" error**
   - The updated schema handles this automatically
   - Use the fixed `portfolio/sql/portfolio-gallery-schema.sql`

3. **Upload fails with empty error**
   - Check browser console for detailed errors
   - Verify you're logged in to the admin panel
   - Check Supabase authentication status

4. **Images don't display**
   - Verify the bucket is public
   - Check storage policies are correctly set
   - Ensure image URLs are accessible

### Debug Scripts

Use these scripts to diagnose issues:

```bash
# Check all storage buckets
node scripts/check-buckets.js

# Create portfolio bucket if missing
node scripts/create-portfolio-bucket.js

# Debug upload functionality
node scripts/debug-portfolio-upload.js
```

## File Structure

```
portfolio/
├── sql/
│   └── portfolio-gallery-schema.sql    # Database schema
scripts/
├── check-buckets.js                    # List all buckets
├── create-portfolio-bucket.js          # Create portfolio bucket
└── debug-portfolio-upload.js           # Debug upload issues
src/app/admin/pages/portfolio/
└── page.tsx                            # Enhanced admin interface
```

## Next Steps

After setup is complete:

1. **Add Portfolio Items**: Create portfolio entries with images
2. **Organize Layout**: Use different grid sizes for visual variety
3. **Test Frontend**: Visit `/portfolio` to see the public gallery
4. **Customize Styling**: Modify the gallery appearance as needed

## Support

If you encounter issues:

1. Check the browser console for detailed error messages
2. Verify Supabase project permissions and authentication
3. Run the debug scripts to identify specific problems
4. Ensure all environment variables are correctly set

The portfolio gallery should now be fully functional with image upload capabilities!

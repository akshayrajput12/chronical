# Portfolio Gallery - Setup Instructions

This document provides step-by-step instructions for setting up the dynamic Portfolio Gallery management system.

## 📋 Overview

The Portfolio Gallery system provides:
- **Dynamic Content Management**: Create, edit, and delete portfolio items
- **Image Management**: Upload and manage images with Supabase storage
- **Masonry Layout**: Different grid sizes (1, 2, or 3 rows) for varied layouts
- **Admin Interface**: Complete CRUD operations with tabbed interface
- **Real-time Preview**: See changes before publishing
- **Professional Notifications**: Success/error popups instead of browser alerts

## 🚀 Quick Setup

### 1. Execute SQL Schema

Run the SQL schema file in your Supabase SQL Editor:

```bash
portfolio/sql/portfolio-gallery-schema.sql
```

This will create:
- `portfolio_items` table for main content
- `portfolio_images` table for image management
- `portfolio-gallery-images` storage bucket
- RLS policies for security
- Indexes for performance
- Database functions for complex queries
- Initial sample data (12 portfolio items)

### 2. Verify Database Setup

After running the SQL schema, verify the setup:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE tablename IN ('portfolio_items', 'portfolio_images');

-- Check storage bucket
SELECT id, name, public FROM storage.buckets 
WHERE id = 'portfolio-gallery-images';

-- Check initial data
SELECT title, alt_text, grid_class, display_order, is_active FROM portfolio_items ORDER BY display_order;

-- Test database function
SELECT * FROM get_portfolio_items_with_images();
```

### 3. Access Admin Interface

Navigate to the admin interface:

```
/admin/pages/portfolio
```

Or access via:
1. Go to `/admin`
2. Click "Portfolio" in sidebar

## 🎯 Features

### Portfolio Items Management
- **Title**: Optional title for each portfolio item
- **Description**: Optional description text
- **Alt Text**: Required accessibility text
- **Grid Size**: Choose from Small (1 row), Medium (2 rows), Large (3 rows)
- **Display Order**: Control the order of items in the gallery
- **Image URL**: External image URL or uploaded image
- **Status**: Active/inactive toggle

### Image Management
- **Upload Images**: Drag-and-drop or click to upload
- **Copy URLs**: Easy URL copying for use in portfolio items
- **Delete Images**: Remove unused images
- **File Validation**: Automatic validation of file types and sizes

### Admin Interface
- **Tabbed Layout**: Portfolio Items, Image Management, Preview
- **Real-time Preview**: See changes before saving
- **Professional Notifications**: Success/error popups with icons
- **Responsive Design**: Works on all device sizes

## 📁 File Structure

```
portfolio/
├── sql/
│   ├── portfolio-gallery-schema.sql          # Main schema
│   └── cleanup-portfolio-gallery.sql         # Cleanup script
└── SETUP_INSTRUCTIONS.md                     # This file

src/
├── app/
│   ├── admin/pages/portfolio/
│   │   └── page.tsx                          # Admin interface
│   └── portfolio/components/
│       └── portfolio-gallery.tsx             # Dynamic component
└── types/
    └── portfolio-gallery.ts                  # TypeScript interfaces
```

## 🔧 Configuration

### Database Tables

#### `portfolio_items`
- Main content table for portfolio items
- Includes title, description, alt text, grid class, display order
- Links to images via `image_id` or external `image_url`
- Supports active/inactive status

#### `portfolio_images`
- Image storage metadata
- File path, size, MIME type information
- Alt text and display order

### Storage Bucket
- **Name**: `portfolio-gallery-images`
- **Access**: Public read, authenticated write
- **File Limits**: 10MB max, JPG/PNG/WebP only

### RLS Policies
- **Public**: Read access to active content only
- **Authenticated**: Full CRUD access for admin users
- **Storage**: Public read, authenticated upload/delete

## 🎨 Customization

### Grid Layout Options
- **Small (row-span-1)**: Single row height, good for landscape images
- **Medium (row-span-2)**: Double row height, good for portraits or featured items
- **Large (row-span-3)**: Triple row height, for hero/showcase items

### Styling
The component uses Tailwind CSS classes and follows the website's design system:
- **Masonry Grid**: Responsive grid with auto-rows
- **Hover Effects**: Scale and overlay effects
- **Typography**: Consistent with website font hierarchy
- **Responsive**: Mobile-first responsive design

### Content Limits
- **Title**: 0-200 characters (optional)
- **Description**: 0-500 characters (optional)
- **Alt Text**: 3-200 characters (required)
- **Display Order**: Positive integers

### File Limits
- **Image Size**: 10MB maximum
- **Image Types**: JPG, PNG, WebP
- **Recommended**: 800x600px, under 2MB

## 🔍 Testing

### Verify Frontend Integration
1. Visit `/portfolio` page
2. Verify portfolio gallery displays correctly
3. Check responsive behavior on mobile
4. Test hover effects and animations

### Test Admin Interface
1. Access admin interface
2. Create new portfolio items
3. Upload and manage images
4. Use preview tab to verify changes
5. Test different grid sizes

### Database Verification
```sql
-- Check active items
SELECT * FROM portfolio_items WHERE is_active = true ORDER BY display_order;

-- Check images
SELECT * FROM portfolio_images WHERE is_active = true;

-- Test database function
SELECT * FROM get_portfolio_items_with_images();
```

## 🚨 Common Issues

**"relation 'portfolio_items' does not exist" Error:**
- Run the schema creation script first
- Check if tables were created successfully

**Image Upload Issues:**
- Verify storage bucket exists: `SELECT * FROM storage.buckets WHERE id = 'portfolio-gallery-images';`
- Check bucket is public: `public` column should be `true`
- Ensure proper storage policies are applied

**RLS Policy Conflicts:**
- Drop existing policies before recreating
- Use unique policy names to avoid conflicts

**Foreign Key Constraint Errors:**
- Make sure images table is created before items table
- The schema file handles this correctly

**Admin Access Issues:**
- Ensure user is authenticated
- Check RLS policies are properly configured

**Content Not Displaying:**
- Check if items are marked as active
- Verify database connection
- Check browser console for errors

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify database setup with provided queries
3. Check browser console for JavaScript errors
4. Ensure Supabase connection is working
5. Try the cleanup and re-setup process

## ✅ Success Checklist

- [ ] Database schema created successfully
- [ ] Storage bucket configured
- [ ] RLS policies applied
- [ ] Initial data inserted
- [ ] Admin interface accessible
- [ ] Portfolio items CRUD works
- [ ] Image upload/management works
- [ ] Preview functionality works
- [ ] Frontend displays dynamic content
- [ ] Responsive design works
- [ ] Notifications display properly

## 🎯 Migration from Static to Dynamic

The system automatically includes the original 12 portfolio items as initial data. The dynamic component:

1. **Preserves Layout**: Exact same masonry grid design
2. **Maintains Styling**: All hover effects and animations preserved
3. **Adds Features**: Title overlays, better alt text, admin management
4. **Improves Performance**: Optimized loading and error states

The Portfolio Gallery is now fully dynamic and ready for content management!

## 🔄 Cleanup and Reset

If you need to start fresh or fix issues, use the cleanup script:

```bash
portfolio/sql/cleanup-portfolio-gallery.sql
```

This will remove all tables, policies, and data, allowing you to run the setup again.

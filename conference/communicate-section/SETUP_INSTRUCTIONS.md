# Communicate Section - Setup Instructions

This document provides step-by-step instructions for setting up the Communicate Section admin system.

## 📋 Overview

The Communicate Section system provides:
- **Dynamic Content Management**: Edit main heading, company name, and description paragraphs
- **Image Management**: Upload and manage section images with activation/deactivation
- **Admin Interface**: Complete CRUD operations with tabbed interface
- **Real-time Preview**: See changes before publishing
- **Professional Notifications**: Success/error popups instead of browser alerts

## 🚀 Quick Setup

### 1. Execute SQL Schema

**Option A: Main Schema File (Recommended)**
Run the main SQL schema file in your Supabase SQL Editor:

```bash
conference/sql/communicate-section-schema.sql
```

**Option B: Simple Step-by-Step (If Option A fails)**
If you encounter the "relation does not exist" error, use the simple version:

```bash
conference/sql/communicate-section-schema-simple.sql
```

**Option C: Cleanup and Reset (If needed)**
If you need to start fresh or fix issues:

```bash
conference/sql/cleanup-communicate-section.sql
```

This will create:
- `communicate_sections` table for main content
- `communicate_images` table for image management
- `communicate-section-images` storage bucket
- RLS policies for security
- Indexes for performance
- Database functions for complex queries
- Initial default data

### 2. Verify Database Setup

After running the SQL schema, verify the setup:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE tablename IN ('communicate_sections', 'communicate_images');

-- Check storage bucket
SELECT id, name, public FROM storage.buckets 
WHERE id = 'communicate-section-images';

-- Check initial data
SELECT main_heading, company_name, is_active FROM communicate_sections;
```

### 3. Access Admin Interface

Navigate to the admin interface:

```
/admin/pages/conference/communicate-section
```

Or access via:
1. Go to `/admin`
2. Click "Conference" in sidebar
3. Click "Communicate Section"

## 🎯 Features

### Content Management
- **Main Heading**: Edit the section title
- **Company Name**: Edit the highlighted company name
- **First Paragraph**: Edit the main description paragraph
- **Second Paragraph**: Edit the supporting description
- **Image Management**: Upload and manage section images
- **Alt Text**: Configure accessibility text for images

### Image Management
- **Upload Images**: Drag-and-drop or click to upload
- **Activate Images**: Set which image is currently active
- **Delete Images**: Remove unused images
- **File Validation**: Automatic validation of file types and sizes

### Admin Interface
- **Tabbed Layout**: Content Settings, Image Management, Preview
- **Real-time Preview**: See changes before saving
- **Professional Notifications**: Success/error popups with icons
- **Responsive Design**: Works on all device sizes

## 📁 File Structure

```
conference/
├── sql/
│   ├── communicate-section-schema.sql          # Main schema
│   ├── communicate-section-schema-simple.sql   # Step-by-step schema
│   └── cleanup-communicate-section.sql         # Cleanup script
└── communicate-section/
    └── SETUP_INSTRUCTIONS.md                   # This file

src/
├── app/
│   ├── admin/pages/conference/communicate-section/
│   │   └── page.tsx                            # Admin interface
│   └── conference/components/
│       └── communicate-section.tsx             # Dynamic component
└── types/
    └── communicate-section.ts                  # TypeScript interfaces
```

## 🔧 Configuration

### Database Tables

#### `communicate_sections`
- Main content table for section heading, company name, and paragraphs
- Links to active image via `main_image_id`
- Only one active section at a time

#### `communicate_images`
- Image storage metadata
- File path, size, MIME type information
- Only one active image at a time

### Storage Bucket
- **Name**: `communicate-section-images`
- **Access**: Public read, authenticated write
- **File Limits**: 10MB max, JPG/PNG/WebP only

### RLS Policies
- **Public**: Read access to active content only
- **Authenticated**: Full CRUD access for admin users
- **Storage**: Public read, authenticated upload/delete

## 🎨 Customization

### Styling
The component uses Tailwind CSS classes and follows the website's design system:
- **Green Color**: `#a5cd39` for company name highlighting
- **Typography**: Consistent with website font hierarchy
- **Responsive**: Mobile-first responsive design
- **Layout**: Two-column grid with image and content

### Content Structure
The section displays content in this format:
```
[Main Heading]

[Company Name] [First Paragraph]

[Second Paragraph]
```

### Content Limits
- **Main Heading**: 5-200 characters
- **Company Name**: 3-100 characters
- **First Paragraph**: 10-1000 characters
- **Second Paragraph**: 10-1000 characters
- **Alt Text**: 3-200 characters

### File Limits
- **Image Size**: 10MB maximum
- **Image Types**: JPG, PNG, WebP
- **Recommended**: 1200x800px, under 2MB

## 🔍 Testing

### Verify Frontend Integration
1. Visit `/conference` page
2. Scroll to Communicate Section
3. Verify content displays correctly
4. Check responsive behavior on mobile
5. Verify company name is highlighted in green

### Test Admin Interface
1. Access admin interface
2. Edit content and save
3. Upload and activate images
4. Use preview tab to verify changes
5. Check that company name highlighting works

### Database Verification
```sql
-- Check active section
SELECT * FROM communicate_sections WHERE is_active = true;

-- Check active image
SELECT * FROM communicate_images WHERE is_active = true;

-- Test database function
SELECT * FROM get_communicate_section_with_image();
```

## 🚨 Common Issues

**"relation 'communicate_images' does not exist" Error:**
- This occurs due to circular dependency in table creation
- **Solution 1**: Use the fixed main schema file (already corrected)
- **Solution 2**: Use the simple step-by-step schema file
- **Solution 3**: Run cleanup script first, then schema creation

**"Multiple rows returned" Error:**
- Ensure only one active section exists
- Run cleanup query if needed:
```sql
UPDATE communicate_sections 
SET is_active = false 
WHERE id NOT IN (
    SELECT id FROM communicate_sections 
    ORDER BY created_at DESC LIMIT 1
);
```

**Foreign Key Constraint Errors:**
- Make sure images table is created before sections table
- Use the simple schema file which creates tables in correct order
- Check that foreign key references are properly defined

**RLS Policy Conflicts:**
- Drop existing policies before recreating
- Use unique policy names to avoid conflicts
- Check for policies with similar names in Supabase dashboard

**Storage Bucket Issues:**
- Verify bucket exists: `SELECT * FROM storage.buckets WHERE id = 'communicate-section-images';`
- Check bucket is public: `public` column should be `true`
- Ensure proper storage policies are applied

**Image Upload Issues:**
- Verify storage bucket exists and is public
- Check file size limits (10MB max)
- Ensure supported formats (JPG, PNG, WebP)
- Check storage policies allow authenticated uploads

**Admin Access Issues:**
- Ensure user is authenticated
- Check RLS policies are properly configured
- Verify admin permissions in Supabase Auth

**Content Not Displaying:**
- Check if section is marked as active
- Verify database connection
- Check browser console for errors
- Ensure tables have proper data

**Company Name Not Highlighted:**
- Verify the company name field is properly set
- Check that the green color styling is applied
- Ensure the component is using dynamic data

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
- [ ] Content editing works
- [ ] Image upload/management works
- [ ] Preview functionality works
- [ ] Frontend displays dynamic content
- [ ] Company name highlighting works
- [ ] Responsive design works
- [ ] Notifications display properly

The Communicate Section admin system is now ready for use!

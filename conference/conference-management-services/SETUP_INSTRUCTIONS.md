# Conference Management Services - Setup Instructions

This document provides step-by-step instructions for setting up the Conference Management Services admin system.

## 📋 Overview

The Conference Management Services system provides:
- **Dynamic Content Management**: Edit main heading, description, and service items
- **Service Management**: Add, edit, delete, and reorder individual service items
- **Image Management**: Upload and manage images with activation/deactivation
- **Admin Interface**: Complete CRUD operations with tabbed interface
- **Real-time Preview**: See changes before publishing
- **Professional Notifications**: Success/error popups instead of browser alerts

## 🚀 Quick Setup

### 1. Execute SQL Schema

**Option A: Main Schema File (Recommended)**
Run the main SQL schema file in your Supabase SQL Editor:

```bash
conference/sql/conference-management-services-schema.sql
```

**Option B: Simple Step-by-Step (If Option A fails)**
If you encounter the "relation does not exist" error, use the simple version:

```bash
conference/sql/conference-management-services-schema-simple.sql
```

**Option C: Cleanup and Reset (If needed)**
If you need to start fresh or fix issues:

```bash
conference/sql/cleanup-conference-management-services.sql
```

This will create:
- `conference_management_sections` table for main content
- `conference_management_services` table for individual service items
- `conference_management_images` table for image management
- `conference-management-images` storage bucket
- RLS policies for security
- Indexes for performance
- Database functions for complex queries
- Initial default data

### 2. Verify Database Setup

After running the SQL schema, verify the setup:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE tablename IN ('conference_management_sections', 'conference_management_services', 'conference_management_images');

-- Check storage bucket
SELECT id, name, public FROM storage.buckets 
WHERE id = 'conference-management-images';

-- Check initial data
SELECT main_heading, is_active FROM conference_management_sections;
SELECT title, display_order FROM conference_management_services ORDER BY display_order;
```

### 3. Access Admin Interface

Navigate to the admin interface:

```
/admin/pages/conference/conference-management-services
```

Or access via:
1. Go to `/admin`
2. Click "Conference" in sidebar
3. Click "Conference Management Services"

## 🎯 Features

### Content Management
- **Main Heading**: Edit the section title
- **Main Description**: Edit the section description
- **Image Management**: Upload and manage section images
- **Alt Text**: Configure accessibility text for images

### Service Management
- **Add Services**: Create new service items
- **Edit Services**: Modify existing service content
- **Delete Services**: Remove unwanted services
- **Reorder Services**: Change display order
- **Activate/Deactivate**: Control service visibility

### Image Management
- **Upload Images**: Drag-and-drop or click to upload
- **Activate Images**: Set which image is currently active
- **Delete Images**: Remove unused images
- **File Validation**: Automatic validation of file types and sizes

### Admin Interface
- **Tabbed Layout**: Content Settings, Services Management, Images, Preview
- **Real-time Preview**: See changes before saving
- **Professional Notifications**: Success/error popups with icons
- **Responsive Design**: Works on all device sizes

## 📁 File Structure

```
conference/
├── sql/
│   ├── conference-management-services-schema.sql          # Main schema
│   ├── conference-management-services-schema-simple.sql   # Step-by-step schema
│   └── cleanup-conference-management-services.sql        # Cleanup script
└── conference-management-services/
    └── SETUP_INSTRUCTIONS.md                             # This file

src/
├── app/
│   ├── admin/pages/conference/conference-management-services/
│   │   └── page.tsx                                      # Admin interface
│   └── conference/components/
│       └── conference-management-services.tsx            # Dynamic component
└── types/
    └── conference-management-services.ts                 # TypeScript interfaces
```

## 🔧 Configuration

### Database Tables

#### `conference_management_sections`
- Main content table for section heading and description
- Links to active image via `main_image_id`
- Only one active section at a time

#### `conference_management_services`
- Individual service items displayed in grid
- Configurable display order
- Can be activated/deactivated individually

#### `conference_management_images`
- Image storage metadata
- File path, size, MIME type information
- Only one active image at a time

### Storage Bucket
- **Name**: `conference-management-images`
- **Access**: Public read, authenticated write
- **File Limits**: 10MB max, JPG/PNG/WebP only

### RLS Policies
- **Public**: Read access to active content only
- **Authenticated**: Full CRUD access for admin users
- **Storage**: Public read, authenticated upload/delete

## 🎨 Customization

### Styling
The component uses Tailwind CSS classes and follows the website's design system:
- **Green Color**: `#a5cd39` for highlights and active states
- **Typography**: Consistent with website font hierarchy
- **Responsive**: Mobile-first responsive design

### Content Limits
- **Main Heading**: 5-200 characters
- **Main Description**: 10-1000 characters
- **Service Title**: 3-100 characters
- **Service Description**: 10-500 characters
- **Alt Text**: 3-200 characters

### File Limits
- **Image Size**: 10MB maximum
- **Image Types**: JPG, PNG, WebP
- **Recommended**: 1200x800px, under 2MB

## 🔍 Testing

### Verify Frontend Integration
1. Visit `/conference` page
2. Scroll to Conference Management Services section
3. Verify content displays correctly
4. Check responsive behavior on mobile

### Test Admin Interface
1. Access admin interface
2. Edit content and save
3. Upload and activate images
4. Add/edit/delete services
5. Use preview tab to verify changes

### Database Verification
```sql
-- Check active section
SELECT * FROM conference_management_sections WHERE is_active = true;

-- Check active services
SELECT * FROM conference_management_services WHERE is_active = true ORDER BY display_order;

-- Check active image
SELECT * FROM conference_management_images WHERE is_active = true;
```

## 🚨 Common Issues

**"relation 'conference_management_images' does not exist" Error:**
- This occurs due to circular dependency in table creation
- **Solution 1**: Use the fixed main schema file (already corrected)
- **Solution 2**: Use the simple step-by-step schema file
- **Solution 3**: Run cleanup script first, then schema creation

**"Multiple rows returned" Error:**
- Ensure only one active section exists
- Run cleanup query if needed:
```sql
UPDATE conference_management_sections 
SET is_active = false 
WHERE id NOT IN (
    SELECT id FROM conference_management_sections 
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
- Verify bucket exists: `SELECT * FROM storage.buckets WHERE id = 'conference-management-images';`
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
- [ ] Service management works
- [ ] Preview functionality works
- [ ] Frontend displays dynamic content
- [ ] Responsive design works
- [ ] Notifications display properly

The Conference Management Services admin system is now ready for use!

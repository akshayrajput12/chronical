# Conference Solution Section - Setup Instructions

This document provides step-by-step instructions for setting up the Conference Solution Section admin system.

## 📋 Overview

The Conference Solution Section system provides:
- **Dynamic Content Management**: Edit main heading, phone number, and call-to-action text
- **Background Color Customization**: Choose from predefined colors or enter custom hex values
- **Image Management**: Upload and manage section images with activation/deactivation
- **Admin Interface**: Complete CRUD operations with tabbed interface
- **Real-time Preview**: See changes before publishing with live background color preview
- **Professional Notifications**: Success/error popups instead of browser alerts

## 🚀 Quick Setup

### 1. Execute SQL Schema

**Option A: Main Schema File (Recommended)**
Run the main SQL schema file in your Supabase SQL Editor:

```bash
conference/sql/conference-solution-section-schema.sql
```

**Option B: Simple Step-by-Step (If Option A fails)**
If you encounter the "relation does not exist" error, use the simple version:

```bash
conference/sql/conference-solution-section-schema-simple.sql
```

**Option C: Cleanup and Reset (If needed)**
If you need to start fresh or fix issues:

```bash
conference/sql/cleanup-conference-solution-section.sql
```

This will create:
- `conference_solution_sections` table for main content
- `conference_solution_images` table for image management
- `conference-solution-section-images` storage bucket
- RLS policies for security
- Indexes for performance
- Database functions for complex queries
- Initial default data

### 2. Verify Database Setup

After running the SQL schema, verify the setup:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE tablename IN ('conference_solution_sections', 'conference_solution_images');

-- Check storage bucket
SELECT id, name, public FROM storage.buckets 
WHERE id = 'conference-solution-section-images';

-- Check initial data
SELECT main_heading, phone_number, background_color, is_active FROM conference_solution_sections;
```

### 3. Access Admin Interface

Navigate to the admin interface:

```
/admin/pages/conference/conference-solution-section
```

Or access via:
1. Go to `/admin`
2. Click "Conference" in sidebar
3. Click "Conference Solution Section"

## 🎯 Features

### Content Management
- **Main Heading**: Edit the section title
- **Phone Number**: Edit the contact phone number
- **Call-to-Action Text**: Edit the supporting text
- **Background Color**: Choose from predefined colors or enter custom hex values
- **Image Management**: Upload and manage section images
- **Alt Text**: Configure accessibility text for images

### Background Color Options
- **Predefined Colors**: Green, Blue, Red, Purple, Orange, Gray, Black
- **Custom Colors**: Enter any hex color value (#rrggbb format)
- **Live Preview**: See color changes in real-time
- **Color Picker**: Visual color selection interface

### Image Management
- **Upload Images**: Drag-and-drop or click to upload
- **Activate Images**: Set which image is currently active
- **Delete Images**: Remove unused images
- **File Validation**: Automatic validation of file types and sizes

### Admin Interface
- **Tabbed Layout**: Content Settings, Image Management, Preview
- **Real-time Preview**: See changes before saving with live background color
- **Professional Notifications**: Success/error popups with icons
- **Responsive Design**: Works on all device sizes

## 📁 File Structure

```
conference/
├── sql/
│   ├── conference-solution-section-schema.sql          # Main schema
│   ├── conference-solution-section-schema-simple.sql   # Step-by-step schema
│   └── cleanup-conference-solution-section.sql         # Cleanup script
└── conference-solution-section/
    └── SETUP_INSTRUCTIONS.md                          # This file

src/
├── app/
│   ├── admin/pages/conference/conference-solution-section/
│   │   └── page.tsx                                   # Admin interface
│   └── conference/components/
│       └── conference-solution-section.tsx            # Dynamic component
└── types/
    └── conference-solution-section.ts                 # TypeScript interfaces
```

## 🔧 Configuration

### Database Tables

#### `conference_solution_sections`
- Main content table for section heading, phone number, and call-to-action text
- Background color configuration with hex validation
- Links to active image via `main_image_id`
- Only one active section at a time

#### `conference_solution_images`
- Image storage metadata
- File path, size, MIME type information
- Only one active image at a time

### Storage Bucket
- **Name**: `conference-solution-section-images`
- **Access**: Public read, authenticated write
- **File Limits**: 10MB max, JPG/PNG/WebP only

### RLS Policies
- **Public**: Read access to active content only
- **Authenticated**: Full CRUD access for admin users
- **Storage**: Public read, authenticated upload/delete

## 🎨 Customization

### Styling
The component uses Tailwind CSS classes and follows the website's design system:
- **Dynamic Background**: Configurable background color from database
- **Typography**: Consistent with website font hierarchy
- **Responsive**: Mobile-first responsive design
- **Layout**: Centered call-to-action with phone number in black box

### Content Structure
The section displays content in this format:
```
[Main Heading]

[Call Phone Number] [Call-to-Action Text]
```

### Content Limits
- **Main Heading**: 5-200 characters
- **Phone Number**: 5-50 characters
- **Call-to-Action Text**: 5-200 characters
- **Background Color**: Valid hex format (#rrggbb)
- **Alt Text**: 3-200 characters

### File Limits
- **Image Size**: 10MB maximum
- **Image Types**: JPG, PNG, WebP
- **Recommended**: 1200x800px, under 2MB

## 🔍 Testing

### Verify Frontend Integration
1. Visit `/conference` page
2. Scroll to Conference Solution Section
3. Verify content displays correctly
4. Check responsive behavior on mobile
5. Verify background color is applied correctly

### Test Admin Interface
1. Access admin interface
2. Edit content and save
3. Change background color and verify preview
4. Upload and activate images
5. Use preview tab to verify changes

### Database Verification
```sql
-- Check active section
SELECT * FROM conference_solution_sections WHERE is_active = true;

-- Check active image
SELECT * FROM conference_solution_images WHERE is_active = true;

-- Test database function
SELECT * FROM get_conference_solution_section_with_image();
```

## 🚨 Common Issues

**"relation 'conference_solution_images' does not exist" Error:**
- This occurs due to circular dependency in table creation
- **Solution 1**: Use the fixed main schema file (already corrected)
- **Solution 2**: Use the simple step-by-step schema file
- **Solution 3**: Run cleanup script first, then schema creation

**"Multiple rows returned" Error:**
- Ensure only one active section exists
- Run cleanup query if needed:
```sql
UPDATE conference_solution_sections 
SET is_active = false 
WHERE id NOT IN (
    SELECT id FROM conference_solution_sections 
    ORDER BY created_at DESC LIMIT 1
);
```

**Background Color Validation Errors:**
- Ensure color values are in valid hex format (#rrggbb)
- Use the color picker interface for proper formatting
- Check that the hex regex constraint is properly applied

**Foreign Key Constraint Errors:**
- Make sure images table is created before sections table
- Use the simple schema file which creates tables in correct order
- Check that foreign key references are properly defined

**RLS Policy Conflicts:**
- Drop existing policies before recreating
- Use unique policy names to avoid conflicts
- Check for policies with similar names in Supabase dashboard

**Storage Bucket Issues:**
- Verify bucket exists: `SELECT * FROM storage.buckets WHERE id = 'conference-solution-section-images';`
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

**Background Color Not Applied:**
- Verify the background color field is properly set
- Check that the color value is in valid hex format
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
- [ ] Background color customization works
- [ ] Image upload/management works
- [ ] Preview functionality works
- [ ] Frontend displays dynamic content
- [ ] Background color is applied correctly
- [ ] Responsive design works
- [ ] Notifications display properly

The Conference Solution Section admin system is now ready for use!

# Event Management Services Admin System - Setup Instructions

## 📋 Overview

This document provides complete setup instructions for the Event Management Services admin management system. The system allows dynamic content management for the event management services section of the conference page.

## 🗄️ Database Setup

### 1. Execute SQL Schema

**Option A: Main Schema File (Recommended)**
Run the main SQL schema file in your Supabase SQL Editor:

```bash
conference/sql/event-management-services-schema.sql
```

**Option B: Simple Step-by-Step (If Option A fails)**
If you encounter the "relation does not exist" error, use the simple version:

```bash
conference/sql/event-management-services-schema-simple.sql
```

**Option C: Cleanup and Reset (If needed)**
If you need to start fresh or fix issues:

```bash
conference/sql/cleanup-event-management-services.sql
```

This will create:
- `event_management_sections` table for content
- `event_management_images` table for image management
- `event-management-images` storage bucket
- RLS policies for security
- Indexes for performance
- Database functions for complex queries
- Initial default data

### 2. Verify Database Setup

After running the schema, verify the setup:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE tablename IN ('event_management_sections', 'event_management_images');

-- Check storage bucket
SELECT name FROM storage.buckets WHERE name = 'event-management-images';

-- Check initial data
SELECT main_heading, is_active FROM event_management_sections;
```

## 🔧 Frontend Integration

### 1. Dynamic Component

The existing component has been updated to be fully dynamic:
- `src/app/conference/components/event-management-services.tsx`
- Fetches content from Supabase database
- Displays uploaded images from storage
- Includes loading states and error handling

### 2. Admin Interface

New admin interface created at:
- `src/app/admin/pages/conference/event-management-services/page.tsx`
- Full CRUD operations for content management
- Image upload and management
- Real-time preview functionality
- Professional notification system

### 3. TypeScript Types

Complete type definitions in:
- `src/types/event-management-services.ts`
- Database models and form inputs
- Validation interfaces
- Constants and enums

## 🎯 Features Implemented

### Content Management
- ✅ Dynamic main heading editing
- ✅ Main description with textarea
- ✅ Secondary heading management
- ✅ First and second paragraph editing
- ✅ Image alt text for accessibility
- ✅ Manual image URL input option

### Image Management
- ✅ Drag-and-drop image upload
- ✅ Automatic image activation on upload
- ✅ Visual active/inactive indicators
- ✅ Image deletion with confirmation
- ✅ File size and format validation
- ✅ Supabase storage integration

### User Experience
- ✅ Professional popup notifications
- ✅ Loading states and error handling
- ✅ Real-time preview functionality
- ✅ Responsive design across devices
- ✅ Tabbed interface (Content/Images/Preview)

### Technical Implementation
- ✅ Direct Supabase database queries
- ✅ Proper error handling with try/catch
- ✅ TypeScript interfaces for type safety
- ✅ Consistent code patterns
- ✅ RLS policies for security

## 🚀 Usage Instructions

### Accessing the Admin Interface

1. Navigate to `/admin/pages/conference/event-management-services`
2. Use the tabbed interface to manage content:
   - **Content Settings**: Edit all text content
   - **Image Management**: Upload and manage images
   - **Preview**: See how changes will appear

### Content Management Workflow

1. **Edit Content**:
   - Update main heading and description
   - Modify secondary heading
   - Edit first and second paragraphs
   - Update image alt text

2. **Manage Images**:
   - Upload new images (JPG, PNG, WebP up to 10MB)
   - Activate/deactivate images
   - Delete unused images

3. **Preview Changes**:
   - Use the Preview tab to see how content will appear
   - Save changes to apply to the live website

4. **Save and Publish**:
   - Click "Save Changes" to persist to database
   - Visit `/conference` to see live changes

## 🔒 Security Features

### Row Level Security (RLS)
- Public read access for active content
- Authenticated write access for admin users
- Proper data isolation and protection

### Storage Security
- Public read access for images
- Authenticated upload/delete access
- File type and size restrictions

### Input Validation
- Text length limits and constraints
- File format and size validation
- SQL injection prevention

## 📊 Database Schema Details

### event_management_sections Table
```sql
- id (UUID, Primary Key)
- main_heading (TEXT, Required)
- main_description (TEXT, Required)
- secondary_heading (TEXT, Required)
- first_paragraph (TEXT, Required)
- second_paragraph (TEXT, Required)
- main_image_id (UUID, Foreign Key)
- main_image_url (TEXT)
- main_image_alt (TEXT)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### event_management_images Table
```sql
- id (UUID, Primary Key)
- filename, original_filename (TEXT)
- file_path (TEXT, Unique)
- file_size (BIGINT, Max 10MB)
- mime_type (TEXT, Restricted)
- alt_text (TEXT)
- width, height (INTEGER)
- is_active (BOOLEAN)
- display_order (INTEGER)
- created_at, updated_at (TIMESTAMP)
```

## 🛠️ Troubleshooting

### Common Issues

**"relation 'event_management_images' does not exist" Error:**
- This occurs due to circular dependency in table creation
- **Solution 1**: Use the fixed main schema file (already corrected)
- **Solution 2**: Use the simple step-by-step schema file
- **Solution 3**: Run cleanup script first, then schema creation

**"Multiple rows returned" Error:**
- Ensure only one active section exists
- Run cleanup query if needed:
```sql
UPDATE event_management_sections
SET is_active = false
WHERE id NOT IN (
    SELECT id FROM event_management_sections
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
- Verify bucket exists: `SELECT * FROM storage.buckets WHERE id = 'event-management-images';`
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

### Debug Features

**Development Mode:**
- Debug overlay shows current image URL
- Console logging for data fetching
- Detailed error messages

**Production Mode:**
- Clean error handling
- User-friendly messages
- Performance optimizations

## 📈 Performance Considerations

### Database Optimization
- Proper indexing on frequently queried columns
- Efficient queries with `.limit(1)` for single records
- Connection pooling and query optimization

### Image Optimization
- Recommended image sizes: 1200x800px
- Automatic public URL generation
- CDN delivery through Supabase

### Frontend Performance
- Lazy loading for images
- Minimal re-renders with proper state management
- Efficient data fetching patterns

## 🔄 Maintenance

### Regular Tasks
- Monitor storage usage and clean up unused images
- Review and update content regularly
- Check for any database performance issues

### Updates and Migrations
- Follow semantic versioning for schema changes
- Test all changes in development environment
- Backup database before major updates

## ✅ Verification Checklist

- [ ] Database schema executed successfully
- [ ] Storage bucket created and configured
- [ ] RLS policies active and working
- [ ] Admin interface accessible
- [ ] Content editing functional
- [ ] Image upload working
- [ ] Preview functionality operational
- [ ] Live website displaying dynamic content
- [ ] Notifications working properly
- [ ] Error handling tested

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase logs for database errors
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

The Event Management Services admin system is now fully functional and ready for content management!

# Kiosk Admin Management System

This directory contains the complete admin management system for the kiosk page hero section, following the established patterns from the conference admin section.

## 🎯 Overview

The kiosk admin management system provides a comprehensive interface for managing the kiosk page hero section content, including:

- Dynamic content management (heading, background images)
- Image upload and management with Supabase storage
- Real-time preview functionality
- Complete CRUD operations
- Responsive admin interface with tabbed layout

## 📁 File Structure

```
kiosk/
├── sql/
│   └── kiosk-hero-schema.sql          # Database schema and setup
├── README.md                          # This documentation
└── (Referenced files in src/)
    ├── src/types/kiosk.ts             # TypeScript interfaces
    ├── src/app/admin/pages/kiosk/hero/page.tsx  # Admin interface
    └── src/app/kiosk/components/kiosk-main.tsx  # Dynamic frontend component
```

## 🗄️ Database Schema

### Tables Created

1. **kiosk_hero_images**
   - Stores uploaded images for hero section backgrounds
   - Includes metadata: filename, file size, mime type, alt text
   - Tracks upload user and active status

2. **kiosk_hero_sections**
   - Stores hero section content and configuration
   - Links to background images via foreign key
   - Supports heading text and image URL fallbacks

### Storage Bucket

- **kiosk-hero-images**: Supabase storage bucket for image files
- 50MB file size limit
- Supports: JPEG, PNG, WebP, GIF formats
- Public read access, authenticated write access

### Database Functions

- **get_kiosk_hero_section_with_image()**: Returns active hero section with associated image data

## 🔧 Setup Instructions

### 1. Database Setup

Run the SQL schema in your Supabase SQL Editor:

```sql
-- Execute the contents of kiosk/sql/kiosk-hero-schema.sql
```

This will create:
- Required tables with proper constraints
- Storage bucket with RLS policies
- Database functions for data retrieval
- Initial seed data

### 2. Admin Navigation

The admin navigation has been automatically updated to include:
- "Kiosk" section in the admin sidebar
- "Hero Section" sub-link under Kiosk

### 3. TypeScript Types

All necessary TypeScript interfaces are defined in `src/types/kiosk.ts`:
- KioskHeroSection, KioskHeroImage
- Input/response types for API operations
- Admin interface state types
- Validation and error types

## 🎨 Admin Interface Features

### Content Settings Tab
- Main heading configuration
- Background image URL input (optional)
- Active/inactive toggle
- Real-time form validation

### Media Management Tab
- Drag-and-drop image upload
- Image gallery with selection
- Delete functionality with confirmation
- File size and type validation
- Automatic image optimization

### Preview Tab
- Real-time preview of changes
- Live website link for testing
- Responsive preview display

## 🔄 Dynamic Frontend Component

The `kiosk-main.tsx` component has been converted from static to dynamic:

### Features
- Fetches data from Supabase database
- Graceful error handling with fallbacks
- Loading states with spinner
- Respects active/inactive status
- Automatic image URL resolution

### Error Handling
- Database connection errors
- Missing data fallbacks
- Image loading failures
- User-friendly error messages

## 🛡️ Security & Permissions

### Row Level Security (RLS)
- Public read access for hero sections and images
- Authenticated write access for admin operations
- Automatic user tracking for uploads

### Storage Policies
- Public read access for image files
- Authenticated upload/update/delete permissions
- File type and size restrictions

## 🚀 Usage Guide

### For Administrators

1. **Access Admin Interface**
   - Navigate to `/admin/pages/kiosk/hero`
   - Login with admin credentials

2. **Update Content**
   - Use "Content Settings" tab to modify heading
   - Upload new images in "Media Management" tab
   - Preview changes in "Preview" tab
   - Save changes with the "Save Changes" button

3. **Manage Images**
   - Upload: Drag files or click to browse
   - Select: Click on any uploaded image to use as background
   - Delete: Hover over image and click delete button

### For Developers

1. **Database Queries**
   ```typescript
   // Get hero section data
   const { data } = await supabase.rpc('get_kiosk_hero_section_with_image');
   
   // Update hero section
   await supabase.from('kiosk_hero_sections').update(data).eq('id', id);
   ```

2. **Image Upload**
   ```typescript
   // Upload to storage
   await supabase.storage.from('kiosk-hero-images').upload(path, file);
   
   // Save metadata
   await supabase.from('kiosk_hero_images').insert(metadata);
   ```

## 🔍 Troubleshooting

### Common Issues

1. **Images not displaying**
   - Check storage bucket permissions
   - Verify image file paths in database
   - Ensure RLS policies are correctly configured

2. **Upload failures**
   - Check file size (max 50MB)
   - Verify file type (JPEG, PNG, WebP, GIF only)
   - Ensure user is authenticated

3. **Database connection errors**
   - Verify Supabase configuration
   - Check database function exists
   - Ensure tables are created properly

### Debug Steps

1. Check browser console for errors
2. Verify Supabase connection in Network tab
3. Test database functions in Supabase SQL Editor
4. Check storage bucket contents in Supabase dashboard

## 📋 Maintenance

### Regular Tasks
- Monitor storage usage
- Clean up unused images
- Review error logs
- Update image alt texts for accessibility

### Performance Optimization
- Implement image compression
- Add CDN for faster loading
- Monitor database query performance
- Consider image lazy loading

## 🔄 Future Enhancements

Potential improvements for the kiosk admin system:

1. **Bulk Operations**
   - Multiple image upload
   - Batch delete functionality
   - Image organization with folders

2. **Advanced Features**
   - Image cropping and editing
   - Multiple hero sections
   - Scheduled content publishing
   - Version history and rollback

3. **Analytics**
   - Usage tracking
   - Performance metrics
   - User interaction analytics

## 📞 Support

For technical support or questions about the kiosk admin system:

1. Check this documentation first
2. Review the conference admin system for similar patterns
3. Consult the main project documentation
4. Contact the development team

---

## 🆕 Kiosk Content Section Admin System

In addition to the hero section, a comprehensive admin management system has been implemented for the kiosk content section:

### **Content Section Features**

1. **Database Architecture**
   - `kiosk_content_images` table for content media management
   - `kiosk_content_sections` table for all text content
   - Complete SQL schema with RLS policies and storage bucket

2. **Admin Interface** (`/admin/pages/kiosk/content`)
   - **Content Settings Tab**: Manage all text content including:
     - First section heading and content
     - Highlight text for green styling
     - Second section heading and paragraphs
     - Image configuration and alt text
   - **Media Management Tab**: Upload and manage content images
   - **Preview Tab**: Real-time preview of content changes

3. **Dynamic Frontend Component**
   - Converted `kiosk-content.tsx` to fetch all content from database
   - Supports highlighted text rendering
   - Graceful error handling with fallbacks
   - Loading states and error recovery

4. **Content Structure Managed**
   - First Section: "CUSTOM KIOSK" (fully configurable)
   - Second Section: "WHAT ARE CUSTOM KIOSKS?" (fully configurable)
   - Main content image with alt text
   - Highlight text styling within content

### **Content Admin Navigation**
- Added "Content Section" sub-link under Kiosk admin section
- Follows same navigation patterns as hero section

### **Database Schema Files**
- `kiosk/sql/kiosk-content-schema.sql` - Complete content database setup
- Includes storage bucket `kiosk-content-images`
- Database function `get_kiosk_content_section_with_image()`

### **TypeScript Integration**
- Extended `src/types/kiosk.ts` with content-specific types
- `KioskContentSection`, `KioskContentImage` interfaces
- Complete type safety for content management

### **Usage Example**
```typescript
// Admin: Update content
await supabase.from('kiosk_content_sections').update({
  first_section_heading: 'NEW HEADING',
  first_section_content: 'Updated content...',
  first_section_highlight_text: 'highlighted phrase'
});

// Frontend: Fetch content
const { data } = await supabase.rpc('get_kiosk_content_section_with_image');
```

### **Production Ready**
- No debug console.log statements
- Comprehensive error handling
- User-friendly notifications
- Fallback content for reliability
- Proper image optimization and validation

---

## 🆕 Kiosk Benefits Section Admin System

In addition to the hero and content sections, a comprehensive admin management system has been implemented for the kiosk benefits section:

### **Benefits Section Features**

1. **Database Architecture**
   - `kiosk_benefits_sections` table for benefits content management
   - JSONB storage for flexible benefit items with titles, descriptions, and ordering
   - Complete SQL schema with RLS policies and database functions

2. **Admin Interface** (`/admin/pages/kiosk/benefits`)
   - **Content Settings Tab**: Manage all benefits content including:
     - Section heading and description
     - Dynamic benefit items with add/remove functionality
     - Benefit item titles and descriptions
     - Drag-and-drop reordering of benefit items
     - Active/inactive toggle
   - **Preview Tab**: Real-time preview of benefits changes

3. **Dynamic Frontend Component**
   - Converted `kiosk-benefits.tsx` to fetch all content from database
   - Supports dynamic number of benefit items
   - Graceful error handling with fallbacks
   - Loading states and error recovery

4. **Benefits Structure Managed**
   - Section heading and description (fully configurable)
   - Dynamic benefit items array with:
     - Individual titles and descriptions
     - Custom ordering system
     - Add/remove functionality
     - Reorder capabilities

### **Benefits Admin Navigation**
- Added "Benefits Section" sub-link under Kiosk admin section
- Follows same navigation patterns as hero and content sections

### **Database Schema Files**
- `kiosk/sql/kiosk-benefits-schema.sql` - Complete benefits database setup
- JSONB storage for flexible benefit items structure
- Database function `get_kiosk_benefits_section()`
- Validation functions for benefit item structure

### **TypeScript Integration**
- Extended `src/types/kiosk.ts` with benefits-specific types
- `KioskBenefitsSection`, `KioskBenefitItem` interfaces
- Complete type safety for benefits management

### **Usage Example**
```typescript
// Admin: Update benefits
await supabase.from('kiosk_benefits_sections').update({
  section_heading: 'NEW BENEFITS HEADING',
  section_description: 'Updated description...',
  benefit_items: JSON.stringify([
    {
      id: '1',
      title: 'Benefit Title',
      description: 'Benefit description...',
      order: 1
    }
  ])
});

// Frontend: Fetch benefits
const { data } = await supabase.rpc('get_kiosk_benefits_section');
```

### **Production Ready**
- No debug console.log statements
- Comprehensive error handling
- User-friendly notifications
- Fallback content for reliability
- Dynamic benefit items management

---

## 🆕 Kiosk Manufacturers Section Admin System

In addition to the hero, content, and benefits sections, a comprehensive admin management system has been implemented for the kiosk manufacturers section:

### **Manufacturers Section Features**

1. **Database Architecture**
   - `kiosk_manufacturers_images` table for image management with Supabase storage integration
   - `kiosk_manufacturers_sections` table for content management
   - Foreign key relationships between images and sections tables
   - Complete SQL schema with RLS policies and storage bucket configuration

2. **Admin Interface** (`/admin/pages/kiosk/manufacturers`)
   - **Content Settings Tab**: Manage all manufacturers content including:
     - Section heading configuration
     - Two content paragraphs with rich text editing
     - Embedded link configuration (text and URL)
     - Main image selection from uploaded images
     - Active/inactive toggle
   - **Media Management Tab**: Complete image management system with:
     - Drag-and-drop image upload functionality
     - Support for multiple image formats (JPG, PNG, WebP, GIF)
     - 50MB file size limit per image
     - Image preview and metadata display
     - Image deletion with storage cleanup
   - **Preview Tab**: Real-time preview of manufacturers changes

3. **Dynamic Frontend Component**
   - Converted `kiosk-manufacturers.tsx` to fetch all content and images from database
   - Dynamic image rendering with fallback handling
   - Smart link embedding within content paragraphs
   - Graceful error handling with fallbacks
   - Loading states and error recovery

4. **Manufacturers Structure Managed**
   - Section heading (fully configurable)
   - Two content paragraphs (independent editing)
   - Embedded link within content (configurable text and URL)
   - Main image with dynamic selection
   - Image storage and management

### **Manufacturers Admin Navigation**
- Added "Manufacturers Section" sub-link under Kiosk admin section
- Follows same navigation patterns as other kiosk sections

### **Database Schema Files**
- `kiosk/sql/kiosk-manufacturers-schema.sql` - Complete manufacturers database setup
- Supabase storage bucket `kiosk-manufacturers` with proper RLS policies
- Database functions `get_kiosk_manufacturers_section()` and `get_kiosk_manufacturers_images()`
- Helper functions for image management and cleanup

### **TypeScript Integration**
- Extended `src/types/kiosk.ts` with manufacturers-specific types
- `KioskManufacturersSection`, `KioskManufacturersImage` interfaces
- Complete type safety for manufacturers and image management

### **Storage Integration**
- Dedicated Supabase storage bucket for manufacturer images
- Proper RLS policies for public read/authenticated write access
- Automatic file validation and size limits
- Image optimization and preview functionality

### **Usage Example**
```typescript
// Admin: Update manufacturers section
await supabase.from('kiosk_manufacturers_sections').update({
  section_heading: 'NEW MANUFACTURERS HEADING',
  content_paragraph_1: 'Updated first paragraph...',
  content_paragraph_2: 'Updated second paragraph...',
  link_text: 'Custom Link Text',
  link_url: '/custom-url',
  main_image_id: 'image-uuid-here'
});

// Frontend: Fetch manufacturers data
const { data } = await supabase.rpc('get_kiosk_manufacturers_section');
```

### **Production Ready**
- No debug console.log statements
- Comprehensive error handling with user-friendly messages
- User-friendly notifications with popup system
- Fallback content for reliability
- Complete image management with storage integration

---

## 🆕 Kiosk Consultancy Section Admin System

A comprehensive admin management system has been implemented for the kiosk consultancy section, following the same established patterns as other kiosk sections:

### **Consultancy Section Features**

1. **Database Architecture**
   - `kiosk_consultancy_sections` table for complete content management
   - Support for section heading, phone configuration, and styling customization
   - Complete SQL schema with RLS policies and validation functions
   - Database function `get_kiosk_consultancy_section()` for efficient data retrieval

2. **Admin Interface** (`/admin/pages/kiosk/consultancy`)
   - **Content Settings Tab**: Manage all consultancy content including:
     - Section heading configuration
     - Phone number and display text management
     - Phone href (tel:) link configuration
     - Additional text customization
     - Complete styling control (section colors, button colors)
     - Active/inactive toggle
   - **Preview Tab**: Real-time preview of consultancy changes with:
     - Live styling preview with custom colors
     - Interactive phone button preview
     - Direct link to live kiosk page

3. **Dynamic Frontend Component**
   - Converted `kiosk-consultancy.tsx` to fetch all content from database
   - Dynamic styling with customizable colors
   - Smart loading states with skeleton animation
   - Graceful error handling with fallbacks
   - Conditional rendering based on active status

4. **Consultancy Structure Managed**
   - Section heading (fully configurable)
   - Phone number and display text (independent configuration)
   - Phone href link (tel: format validation)
   - Additional text content
   - Complete styling control (section background, text colors, button styling)

### **Consultancy Admin Navigation**
- Added "Consultancy Section" sub-link under Kiosk admin section
- Follows same navigation patterns as other kiosk sections

### **Database Schema Files**
- `kiosk/sql/kiosk-consultancy-schema.sql` - Complete consultancy database setup
- Validation functions for phone numbers, href links, and color formats
- Helper functions for data validation and formatting
- Initial data insertion based on current consultancy section

### **TypeScript Integration**
- Extended `src/types/kiosk.ts` with consultancy-specific types
- `KioskConsultancySection`, `KioskConsultancySectionData` interfaces
- Complete type safety for consultancy content and styling management
- Admin state management types and validation interfaces

### **Advanced Features**
- **Color Customization**: Full control over section and button colors
- **Phone Configuration**: Separate phone number, display text, and href management
- **Real-time Preview**: Live preview with actual styling and colors
- **Validation**: Phone number and color format validation
- **Responsive Design**: Mobile-optimized admin interface and preview

### **Usage Example**
```typescript
// Admin: Update consultancy section
await supabase.from('kiosk_consultancy_sections').update({
  section_heading: 'NEW CONSULTANCY HEADING',
  phone_number: '+971 (555) 123-4567',
  phone_display_text: 'Call +971 (555) 123-4567',
  phone_href: 'tel:+971555123456',
  additional_text: 'or contact us online',
  section_bg_color: '#a5cd39',
  button_bg_color: 'black'
});

// Frontend: Fetch consultancy data
const { data } = await supabase.rpc('get_kiosk_consultancy_section');
```

### **Production Ready**
- No debug console.log statements
- Comprehensive error handling with user-friendly messages
- User-friendly notifications with popup system
- Fallback content for reliability
- Complete styling and color management

---

**Note**: All kiosk admin systems (hero, content, benefits, manufacturers, and consultancy) follow the same patterns as the conference admin section for consistency and maintainability. All code is production-ready with proper error handling, validation, and security measures.

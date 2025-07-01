# Events Management System - Complete Setup Instructions

## 📋 Overview

This document provides complete setup instructions for the comprehensive Events Management System. The system transforms the static events page into a fully dynamic, admin-manageable platform with:

- **Complete Database Schema**: Events, categories, images, hero content, form submissions
- **Admin Interface**: Full CRUD operations with tabbed interfaces
- **Dynamic Frontend**: All components fetch from database
- **Image Management**: Supabase storage integration with proper policies
- **Form Handling**: Event inquiry form submissions with file attachments
- **SEO Optimization**: Meta tags, structured data, and search functionality

## 🗄️ Database Setup

### Step 1: Execute Main Schema

Run the main SQL schema file in your Supabase SQL Editor:

```bash
events/sql/events-schema.sql
```

This creates:
- ✅ All database tables with proper relationships
- ✅ Storage buckets for images and attachments
- ✅ Row Level Security (RLS) policies
- ✅ Database functions for complex queries
- ✅ Performance indexes
- ✅ Automatic timestamp triggers
- ✅ Default categories and hero content

### Step 2: Storage Setup (Optional)

If you need to set up storage separately, run:

```bash
events/sql/events-storage-setup.sql
```

### Step 3: Update Storage URL Function

In the storage setup file, update the `get_storage_url` function with your Supabase project ID:

```sql
-- Replace 'your-project-id' with your actual Supabase project ID
RETURN 'https://your-project-id.supabase.co/storage/v1/object/public/' || bucket_name || '/' || file_path;
```

## 🔧 Admin Interface Setup

### Admin Navigation

The admin sidebar has been updated with the Events section:

```
Events
├── All Events (Dashboard)
├── Create Event
├── Categories
├── Hero Section
└── Form Submissions
```

### Admin Pages Created

1. **Events Dashboard**: `/admin/pages/events/page.tsx`
   - Overview statistics
   - Recent events table
   - Quick action buttons
   - Search and filter functionality

2. **Create Event**: `/admin/pages/events/create/page.tsx`
   - Comprehensive form with 5 tabs:
     - Basic Info (title, description, category)
     - Event Details (dates, venue, organizer)
     - Images (featured, hero, logo images)
     - SEO (meta tags, keywords)
     - Settings (status, featured, display order)

3. **Event Categories**: `/admin/pages/events/categories/page.tsx` (TODO)
4. **Hero Section**: `/admin/pages/events/hero/page.tsx` (TODO)
5. **Form Submissions**: `/admin/pages/events/submissions/page.tsx` (TODO)

## 📁 File Structure

```
events/
├── sql/
│   ├── events-schema.sql              # Complete database schema
│   └── events-storage-setup.sql       # Storage buckets and policies
├── SETUP_INSTRUCTIONS.md              # This file
└── README.md                          # System overview

src/
├── types/
│   └── events.ts                      # TypeScript interfaces
├── app/
│   ├── admin/
│   │   ├── components/
│   │   │   └── admin-sidebar.tsx      # Updated with Events section
│   │   └── pages/
│   │       └── events/
│   │           ├── page.tsx           # Events dashboard
│   │           ├── create/
│   │           │   └── page.tsx       # Create event form
│   │           ├── edit/
│   │           │   └── [id]/
│   │           │       └── page.tsx   # Edit event form (TODO)
│   │           ├── categories/
│   │           │   └── page.tsx       # Categories management (TODO)
│   │           ├── hero/
│   │           │   └── page.tsx       # Hero section management (TODO)
│   │           └── submissions/
│   │               └── page.tsx       # Form submissions (TODO)
│   ├── whats-on/
│   │   ├── page.tsx                   # Events listing page (TODO: make dynamic)
│   │   ├── [id]/
│   │   │   └── page.tsx               # Event detail page (TODO: make dynamic)
│   │   └── components/
│   │       ├── events-hero.tsx        # Hero component (TODO: make dynamic)
│   │       ├── events-gallery.tsx     # Gallery component (TODO: make dynamic)
│   │       ├── events-form.tsx        # Form component (TODO: make dynamic)
│   │       └── event-gallery.tsx      # Individual event gallery (TODO: make dynamic)
│   └── api/
│       └── events/                    # API routes (TODO)
│           ├── route.ts               # Main events API
│           ├── categories/
│           │   └── route.ts           # Categories API
│           ├── hero/
│           │   └── route.ts           # Hero content API
│           ├── submissions/
│           │   └── route.ts           # Form submissions API
│           └── [id]/
│               └── route.ts           # Individual event API
└── components/
    └── events/                        # Event components (TODO: update for dynamic data)
        ├── event-card.tsx
        ├── event-carousel.tsx
        ├── event-filter.tsx
        └── index.ts
```

## 🚀 Quick Start

### 1. Database Setup
```sql
-- Run in Supabase SQL Editor
-- Copy and paste content from events/sql/events-schema.sql
```

### 2. Access Admin Interface
Navigate to: `/admin/pages/events`

### 3. Create Your First Event
1. Click "Create Event" button
2. Fill in the Basic Info tab
3. Add event details and images
4. Configure SEO settings
5. Set status and publish

## 📊 Database Schema Overview

### Core Tables

1. **event_categories**
   - Hierarchical event categorization
   - Color coding and display ordering
   - Active/inactive status

2. **events**
   - Complete event information
   - Multiple image types (featured, hero, logo)
   - SEO metadata
   - Publishing workflow

3. **event_images**
   - Additional event images
   - Gallery images with captions
   - Organized by type and display order

4. **events_hero**
   - Hero section content management
   - Background images and overlays
   - Typography and styling options

5. **event_form_submissions**
   - Contact form submissions
   - File attachment support
   - Status tracking and spam filtering

### Storage Buckets

1. **event-images**: Featured images, thumbnails, logos (50MB limit)
2. **event-hero-images**: Large background images (100MB limit)
3. **event-gallery-images**: Gallery images (50MB limit)
4. **event-form-attachments**: Form attachments (20MB limit, private)

### Database Functions

1. **get_events_with_categories()**: Fetch events with category info
2. **get_related_events()**: Find related events by category
3. **get_event_statistics()**: Dashboard statistics
4. **search_events()**: Full-text search with relevance scoring
5. **get_upcoming_events()**: Upcoming events for widgets
6. **cleanup_orphaned_event_images()**: Storage cleanup utility

## 🔐 Security Features

### Row Level Security (RLS)
- Public read access for active/published content
- Authenticated admin access for management
- Secure form submission handling

### Storage Policies
- Public read access for display images
- Authenticated upload/delete permissions
- Private access for form attachments
- File type and size restrictions

## 🎨 TypeScript Interfaces

Comprehensive type definitions in `src/types/events.ts`:

- **Core Types**: Event, EventCategory, EventImage, EventsHero
- **Input Types**: For forms and API requests
- **Response Types**: For API responses with pagination
- **Component Props**: For React component interfaces
- **Legacy Compatibility**: Conversion functions for existing components

## 📝 Next Steps

### Immediate Tasks (High Priority)

1. **Create API Routes** (`/api/events/*`)
   - CRUD operations for events
   - Categories management
   - Hero content management
   - Form submission handling
   - Image upload endpoints

2. **Complete Admin Pages**
   - Event edit page
   - Categories management
   - Hero section editor
   - Form submissions viewer

3. **Convert Frontend Components**
   - Make EventsHero dynamic
   - Update EventsGallery to fetch from database
   - Convert event detail pages
   - Update form submission handling

### Future Enhancements (Medium Priority)

1. **Advanced Features**
   - Event registration system
   - Calendar integration
   - Email notifications
   - Advanced search and filtering

2. **Performance Optimizations**
   - Image optimization and CDN
   - Caching strategies
   - Database query optimization

3. **Analytics and Reporting**
   - Event performance metrics
   - Submission analytics
   - Popular events tracking

## 🐛 Troubleshooting

### Common Issues

1. **Storage Bucket Errors**
   - Ensure buckets are created with correct names
   - Check RLS policies are properly set
   - Verify file type restrictions

2. **Database Connection Issues**
   - Confirm Supabase connection string
   - Check environment variables
   - Verify admin_users table exists

3. **Image Upload Problems**
   - Check file size limits
   - Verify MIME type restrictions
   - Ensure proper authentication

### Support

For issues or questions:
1. Check the database schema for proper table creation
2. Verify all storage policies are in place
3. Ensure TypeScript interfaces match database schema
4. Test API endpoints with proper authentication

## ✅ Completion Checklist

### Database Setup
- [ ] Run main schema file
- [ ] Verify all tables created
- [ ] Check storage buckets exist
- [ ] Test RLS policies
- [ ] Confirm database functions work

### Admin Interface
- [ ] Access events dashboard
- [ ] Test event creation form
- [ ] Verify image upload functionality
- [ ] Check form validation
- [ ] Test save/publish workflow

### Frontend Integration
- [ ] Update existing components
- [ ] Test dynamic data loading
- [ ] Verify image display
- [ ] Check form submissions
- [ ] Test search and filtering

### Production Readiness
- [ ] Update storage URL function
- [ ] Configure environment variables
- [ ] Test with real data
- [ ] Verify performance
- [ ] Check security settings

---

This comprehensive setup provides a complete events management system that transforms your static events page into a fully dynamic, admin-manageable platform. Follow the steps in order and refer to the troubleshooting section if you encounter any issues.

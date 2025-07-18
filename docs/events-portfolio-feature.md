# Events Portfolio Feature

## Overview

This feature provides a complete solution for managing and displaying events portfolio images in the "Check Out Our Latest Events Portfolio" section. It includes a comprehensive admin panel under the conference navigation and a dynamic frontend component.

## Features

### Admin Features
- **Image Upload**: Support for JPEG, PNG, WebP, and GIF up to 50MB
- **Rich Metadata**: Title, description, alt text, captions, event details
- **Event Information**: Event name, date, location, and type categorization
- **Display Management**: Active/inactive status, featured highlighting, display ordering
- **Tag System**: Flexible tagging for categorization and filtering
- **SEO Support**: Keywords and optimized alt text
- **Search & Filter**: Advanced filtering by status, event type, and text search
- **Statistics Dashboard**: Overview of total, active, and featured images
- **Bulk Operations**: Toggle featured status, reorder images
- **Real-time Updates**: Automatic page revalidation when changes are made

### Frontend Features
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Image Gallery**: Beautiful grid display with hover effects
- **Pagination**: Navigate through large collections
- **Modal View**: Detailed image view with full metadata
- **Featured Highlighting**: Special badges for featured images
- **Event Details**: Display event name, date, location, and type
- **Loading States**: Smooth loading and error handling
- **SEO Optimized**: Proper alt text and structured data

## Database Schema

### Table: `events_portfolio_images`

```sql
CREATE TABLE events_portfolio_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- File Information
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  
  -- Image Metadata
  title TEXT NOT NULL,
  description TEXT,
  alt_text TEXT NOT NULL,
  caption TEXT,
  
  -- Event Information
  event_name TEXT,
  event_date DATE,
  event_location TEXT,
  event_type TEXT, -- 'conference', 'exhibition', 'trade_show', 'corporate', 'other'
  
  -- Display Settings
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  
  -- SEO and Tags
  tags TEXT[], -- Array of tags for filtering
  seo_keywords TEXT,
  
  -- Admin Management
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket: `events-portfolio-images`

- **Public Access**: Yes (for frontend display)
- **File Size Limit**: 50MB
- **Allowed MIME Types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/gif`
- **Authentication Required**: For uploads/management

## API Endpoints

### GET `/api/events-portfolio`

Retrieve events portfolio images with filtering and pagination.

**Query Parameters:**
- `id={uuid}` - Get specific image by ID
- `active_only=true` - Get only active images
- `featured_only=true` - Get only featured images
- `event_type={type}` - Filter by event type
- `search={term}` - Text search across title, description, event name
- `limit={number}` - Limit number of results (default: 20)
- `offset={number}` - Pagination offset (default: 0)
- `sort_by={field}` - Sort field (default: display_order)
- `sort_order={asc|desc}` - Sort direction (default: asc)

**Response:**
```json
{
  "success": true,
  "data": {
    "images": [/* Array of EventsPortfolioImage */],
    "total": 25,
    "page": 1,
    "limit": 20,
    "hasMore": true
  }
}
```

### POST `/api/events-portfolio`

Upload a new events portfolio image.

**Body (FormData):**
- `file` - Image file (required)
- `title` - Image title (required)
- `description` - Image description
- `alt_text` - Alt text for accessibility
- `caption` - Image caption
- `event_name` - Event name
- `event_date` - Event date (YYYY-MM-DD)
- `event_location` - Event location
- `event_type` - Event type (conference, exhibition, etc.)
- `is_active` - Active status (boolean)
- `is_featured` - Featured status (boolean)
- `display_order` - Display order (integer)
- `tags` - JSON array of tags
- `seo_keywords` - SEO keywords

### PUT `/api/events-portfolio?id={uuid}`

Update image metadata or perform actions.

**Actions:**
- `action=toggle_featured` - Toggle featured status
- `action=reorder` - Reorder multiple images

**Regular Update Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "is_active": true,
  "is_featured": false,
  // ... other fields
}
```

### DELETE `/api/events-portfolio?id={uuid}`

Delete an image and its associated file.

## Admin Interface

### Location
`/admin/pages/conference/events-portfolio`

### Navigation
Located under Conference → Events Portfolio in the admin sidebar.

### Features

#### Dashboard Statistics
- Total images count
- Active images count
- Featured images count
- Total storage size

#### Advanced Filtering
- Text search across all fields
- Filter by active/inactive status
- Filter by featured/not featured
- Filter by event type
- Real-time filtering

#### Image Management
- Upload new images with rich metadata
- Edit existing image details
- Toggle featured status
- Delete images with confirmation
- Bulk operations support

#### Image Grid Display
- Responsive grid layout
- Image previews with metadata
- Status badges (Featured, Inactive)
- Quick action buttons
- Hover effects and transitions

## Frontend Component

### Location
`src/components/sections/events-portfolio.tsx`

### Usage

```tsx
import EventsPortfolio from '@/components/sections/events-portfolio';

// Basic usage
<EventsPortfolio />

// With custom props
<EventsPortfolio
  title="Our Amazing Events"
  subtitle="See what we've accomplished"
  showFeaturedOnly={true}
  limit={9}
  className="my-custom-class"
/>
```

### Props
- `title` - Section title (default: "Check Out Our Latest Events Portfolio")
- `subtitle` - Section subtitle
- `showFeaturedOnly` - Show only featured images (default: false)
- `limit` - Maximum number of images to load (default: 12)
- `className` - Additional CSS classes

### Features
- **Responsive Design**: Works on all screen sizes
- **Image Modal**: Click to view full details
- **Pagination**: Navigate through image collections
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful error display
- **SEO Optimized**: Proper alt text and metadata

## Event Types

The system supports the following event types:

- **Conference**: Professional conferences and seminars
- **Exhibition**: Trade shows and exhibitions
- **Trade Show**: Commercial trade shows
- **Corporate**: Corporate events and meetings
- **Other**: Miscellaneous event types

## File Management

### Upload Process
1. File validation (type, size, dimensions)
2. Generate unique filename with timestamp
3. Upload to Supabase storage
4. Extract image dimensions
5. Create database record with metadata
6. Auto-generate alt text if not provided
7. Set display order automatically

### Storage Organization
- Files stored in `portfolio/` subdirectory
- Unique filenames prevent conflicts
- Public access for frontend display
- Automatic cleanup on deletion

## Security Features

### Authentication
- Admin authentication required for all management operations
- Row Level Security (RLS) policies
- Service role for admin operations

### File Validation
- MIME type validation
- File size limits (50MB)
- Extension validation
- Malicious file detection

### Access Control
- Public read access for active images only
- Admin-only write access
- Secure file storage with proper permissions

## SEO and Performance

### SEO Features
- Optimized alt text for all images
- Structured metadata
- Keyword support
- Proper image sizing

### Performance
- Lazy loading support
- Optimized image delivery
- Efficient pagination
- Minimal API calls

## Setup Instructions

### 1. Database Setup
```bash
# Run the schema file
psql -f supabase/events-portfolio-schema.sql
```

### 2. Environment Variables
Ensure your `.env.local` includes:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Storage Configuration
The schema automatically creates the storage bucket with proper policies.

### 4. Admin Access
Ensure admin users have authentication to access the admin panel.

## Usage Examples

### Admin Workflow
1. Navigate to `/admin/pages/conference/events-portfolio`
2. Click "Add New Image" to upload
3. Fill in image details and metadata
4. Set as featured if desired
5. Save and verify in the grid
6. Use filters to manage large collections

### Frontend Integration
```tsx
// In your page component
import EventsPortfolio from '@/components/sections/events-portfolio';

export default function HomePage() {
  return (
    <div>
      {/* Other sections */}
      <EventsPortfolio 
        title="Our Latest Work"
        showFeaturedOnly={false}
        limit={12}
      />
      {/* Other sections */}
    </div>
  );
}
```

## Troubleshooting

### Common Issues
1. **Images not displaying**: Check storage bucket permissions
2. **Upload fails**: Verify file size and type
3. **Admin access denied**: Check authentication
4. **Slow loading**: Optimize image sizes

### Debug Steps
1. Check browser console for errors
2. Verify API responses in Network tab
3. Check Supabase storage permissions
4. Validate database records

## Future Enhancements

### Potential Features
- Image optimization and resizing
- Advanced search with filters
- Bulk upload functionality
- Image categorization system
- Analytics and view tracking
- Social media integration
- Export functionality
- Advanced SEO features

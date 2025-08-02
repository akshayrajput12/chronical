# Privacy Policy System

A complete privacy policy management system for Chronicle Exhibits LLC with admin functionality and dynamic content management.

## 🎯 Features

- **Dynamic Privacy Policy Page** at `/privacy-policy`
- **Admin Management Interface** with TiptapEditor (H1, H2, Bold, etc.)
- **Version Control** - Automatic versioning of privacy policy updates
- **SEO Optimization** - Meta tags, Open Graph, and structured data
- **Revalidation Support** - Immediate frontend updates when admin makes changes
- **Responsive Design** - Mobile-friendly privacy policy page

## 📁 File Structure

```
privacy-policy/
├── sql/
│   ├── privacy-policy-schema.sql      # Complete database schema
│   └── privacy-policy-data.sql        # Initial privacy policy content
├── README.md                          # This documentation
└── (Referenced files in src/)
    ├── src/types/privacy-policy.ts    # TypeScript interfaces
    ├── src/app/api/privacy-policy/    # API routes
    │   └── route.ts                   # GET/PUT/POST endpoints
    ├── src/services/                  # Service layer
    │   └── privacy-policy.service.ts  # Data access functions
    ├── src/app/privacy-policy/        # Public page
    │   ├── page.tsx                   # Main privacy policy page
    │   └── components/
    │       └── privacy-policy-content.tsx  # Content component
    └── src/app/admin/pages/privacy-policy/  # Admin interface
        └── page.tsx                   # Admin management page
```

## 🚀 Installation

### 1. Database Setup

Run the SQL schema in your Supabase SQL Editor:

```sql
-- Run this first
\i privacy-policy/sql/privacy-policy-schema.sql

-- Then run this for initial data
\i privacy-policy/sql/privacy-policy-data.sql
```

### 2. Verify Installation

1. **Check Database**: Verify the `privacy_policy` table exists in Supabase
2. **Check Public Page**: Visit `/privacy-policy` to see the public page
3. **Check Admin**: Visit `/admin/pages/privacy-policy` to manage content

## 📊 Database Schema

### privacy_policy Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |
| `title` | TEXT | Privacy policy title |
| `content` | TEXT | HTML content |
| `meta_title` | TEXT | SEO meta title |
| `meta_description` | TEXT | SEO meta description |
| `meta_keywords` | TEXT | SEO keywords |
| `og_title` | TEXT | Open Graph title |
| `og_description` | TEXT | Open Graph description |
| `og_image_url` | TEXT | Open Graph image |
| `is_active` | BOOLEAN | Whether this version is active |
| `contact_email` | TEXT | Contact email for inquiries |
| `version` | INTEGER | Version number |
| `last_updated_by` | UUID | User who made the update |

## 🔧 API Endpoints

### GET /api/privacy-policy
Fetch the active privacy policy.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Privacy Policy",
    "content": "<h1>Privacy Policy</h1>...",
    "meta_title": "Privacy Policy - Chronicle Exhibits LLC",
    // ... other fields
  }
}
```

### PUT /api/privacy-policy
Update the privacy policy (creates new version).

**Request:**
```json
{
  "title": "Privacy Policy",
  "content": "<h1>Updated Privacy Policy</h1>...",
  "meta_title": "Privacy Policy - Chronicle Exhibits LLC",
  "meta_description": "Updated description",
  "contact_email": "info@chroniclesexhibits.com"
}
```

## 🎨 Admin Interface

The admin interface provides:

- **Rich Text Editor** with TiptapEditor (same as blog editor)
- **SEO Management** - Meta tags and Open Graph settings
- **Contact Settings** - Privacy inquiry email configuration
- **Live Preview** - Preview changes before saving
- **Auto-Revalidation** - Frontend updates immediately after saving

### Editor Features

- **H1, H2, H3** headings
- **Bold, Italic, Underline** text formatting
- **Bullet and numbered lists**
- **Links and images**
- **Tables** for structured content
- **Visual and HTML** editing modes

## 🔄 Version Control

The system automatically creates new versions when updates are made:

1. Current active policy is deactivated (`is_active = false`)
2. New version is created with incremented version number
3. New version becomes active (`is_active = true`)
4. Frontend is automatically revalidated

## 🎯 SEO Features

- **Meta Tags** - Title, description, keywords
- **Open Graph** - Social media sharing optimization
- **Structured Data** - Search engine optimization
- **ISR (Incremental Static Regeneration)** - Fast loading with fresh content

## 🔒 Security

- **Row Level Security (RLS)** enabled
- **Public read access** for active privacy policy
- **Authenticated access** required for admin operations
- **Storage policies** for image uploads

## 🚀 Usage

### For Admins

1. Navigate to `/admin/pages/privacy-policy`
2. Edit content using the rich text editor
3. Update SEO settings in the SEO tab
4. Configure contact email in Settings tab
5. Click "Save Changes" to publish
6. Use "Preview" to see changes before saving

### For Developers

```typescript
import { getActivePrivacyPolicy } from '@/services/privacy-policy.service';

// Get active privacy policy
const privacyPolicy = await getActivePrivacyPolicy();

// Update privacy policy (admin only)
const response = await fetch('/api/privacy-policy', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updateData)
});
```

## 🎉 Result

✅ **Complete Privacy Policy System** with:
- Dynamic content management
- Admin interface with rich text editor
- SEO optimization
- Version control
- Automatic revalidation
- Mobile-responsive design

The privacy policy page matches the provided design requirements and includes all the content sections shown in the reference image.

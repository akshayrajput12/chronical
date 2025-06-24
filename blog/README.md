# Dynamic Blog System

A complete dynamic blog management system with admin interface and slug-based routing for the Chronicles Dubai website.

## 🚀 Features

### Frontend Features
- **Dynamic Blog Listing**: Fetches blog posts from Supabase database
- **Slug-based URLs**: SEO-friendly URLs using post slugs (e.g., `/blog/my-post-title`)
- **Responsive Design**: Mobile-first responsive blog cards and layouts
- **Category & Tag Support**: Visual category badges and tag displays
- **Image Support**: Featured images with fallback handling
- **Loading States**: Smooth loading animations and error handling
- **View Tracking**: Automatic view count increment for published posts

### Admin Features
- **Complete CRUD Operations**: Create, read, update, delete blog posts
- **Rich Content Editor**: Full content management with HTML/Markdown support
- **Media Management**: Image upload to Supabase storage buckets
- **Category Management**: Create and manage blog categories with colors
- **Tag Management**: Create and manage blog tags with colors
- **SEO Optimization**: Meta descriptions, keywords, and Open Graph settings
- **Publishing Workflow**: Draft, published, and archived status management
- **Bulk Operations**: Select and delete multiple posts
- **Slug Generation**: Automatic unique slug generation from titles

## 📁 File Structure

```
blog/
├── sql/
│   └── blog-schema.sql                    # Complete database schema
├── README.md                              # This documentation
└── (Referenced files in src/)
    ├── src/types/blog.ts                  # TypeScript interfaces
    ├── src/app/api/blog/                  # API routes
    │   ├── posts/route.ts                 # Blog posts API
    │   ├── posts/[slug]/route.ts          # Individual post API
    │   ├── categories/route.ts            # Categories API
    │   └── tags/route.ts                  # Tags API
    ├── src/app/admin/pages/blog/          # Admin interface
    │   ├── page.tsx                       # Blog posts management
    │   ├── new/page.tsx                   # Create new post
    │   ├── edit/[id]/page.tsx            # Edit existing post
    │   ├── categories/page.tsx            # Category management
    │   └── tags/page.tsx                  # Tag management
    ├── src/app/blog/                      # Frontend pages
    │   ├── page.tsx                       # Blog listing page
    │   └── [slug]/                        # Dynamic blog post pages
    │       ├── page.tsx                   # Blog post detail
    │       └── not-found.tsx              # 404 page
    └── src/components/blog/               # Blog components
        ├── blog-card.tsx                  # Blog post card
        ├── blog-carousel.tsx              # Blog carousel
        ├── blog-posts-section.tsx         # Posts grid section
        ├── blog-hero.tsx                  # Blog hero section
        ├── blog-subscription.tsx          # Newsletter subscription
        ├── blog-detail-hero.tsx           # Post detail hero
        └── blog-detail-content.tsx        # Post content display
```

## 🗄️ Database Schema

### Tables Created

1. **blog_categories**
   - Stores blog categories with colors and sorting
   - Includes metadata: name, slug, description, color, sort order
   - Supports active/inactive status

2. **blog_posts**
   - Main blog posts table with full content management
   - Includes SEO fields: meta description, keywords, Open Graph data
   - Supports multiple statuses: draft, published, archived
   - Features scheduling and view tracking

3. **blog_tags**
   - Stores blog tags with colors
   - Simple name, slug, color structure

4. **blog_post_tags**
   - Junction table for many-to-many post-tag relationships
   - Enables flexible tagging system

5. **blog_images**
   - Stores uploaded blog images with metadata
   - Tracks file information and relationships to posts

### Storage Buckets

1. **blog-images**: General blog content images
2. **blog-featured-images**: Featured/hero images for posts

### Functions

1. **generate_unique_blog_slug()**: Generates unique slugs from titles
2. **get_published_blog_posts()**: Fetches published posts with pagination
3. **get_blog_post_by_slug()**: Retrieves single post by slug
4. **increment_blog_post_views()**: Increments view count

## 🔧 Setup Instructions

### Step 1: Database Setup
Run the SQL schema in Supabase SQL Editor:
```sql
-- Copy and paste content from blog/sql/blog-schema.sql
```

### Step 2: Environment Variables
Ensure your `.env.local` contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 3: Access Admin Interface
Navigate to: `/admin/pages/blog`

### Step 4: Create Content
1. Create categories in `/admin/pages/blog/categories`
2. Create tags in `/admin/pages/blog/tags`
3. Create your first blog post in `/admin/pages/blog/new`

## 🎯 Usage Guide

### Creating a Blog Post

1. **Navigate to Admin**: Go to `/admin/pages/blog/new`
2. **Fill Required Fields**:
   - Title (required)
   - Content (required for publishing)
   - Slug (auto-generated from title)
3. **Add Media**: Upload featured image
4. **Set Category**: Choose from existing categories
5. **Add Tags**: Select relevant tags
6. **SEO Settings**: Add meta description and keywords
7. **Publish**: Choose "Save Draft" or "Publish"

### Managing Categories

1. **Navigate**: Go to `/admin/pages/blog/categories`
2. **Add Category**: Click "Add Category"
3. **Set Properties**:
   - Name and slug
   - Description
   - Color (for visual identification)
   - Sort order
4. **Save**: Category becomes available for posts

### Managing Tags

1. **Navigate**: Go to `/admin/pages/blog/tags`
2. **Add Tag**: Click "Add Tag"
3. **Set Properties**:
   - Name and slug
   - Color
4. **Save**: Tag becomes available for posts

## 🔗 API Endpoints

### Blog Posts
- `GET /api/blog/posts` - List posts with pagination and filtering
- `POST /api/blog/posts` - Create new post
- `GET /api/blog/posts/[slug]` - Get single post by slug
- `PUT /api/blog/posts/[slug]` - Update post
- `DELETE /api/blog/posts/[slug]` - Delete post

### Categories
- `GET /api/blog/categories` - List all categories
- `POST /api/blog/categories` - Create new category

### Tags
- `GET /api/blog/tags` - List all tags
- `POST /api/blog/tags` - Create new tag

## 🎨 Frontend Features

### Blog Listing Page (`/blog`)
- Displays all published blog posts
- Responsive grid layout
- Category badges and tags
- Loading states and error handling
- Automatic data fetching from API

### Blog Detail Page (`/blog/[slug]`)
- SEO-friendly slug-based URLs
- Full post content display
- Category and tag information
- Automatic view count tracking
- 404 handling for non-existent posts

### Blog Components
- **BlogCard**: Reusable post card with image, title, excerpt, and metadata
- **BlogCarousel**: Horizontal scrolling carousel for featured posts
- **BlogPostsSection**: Grid layout for post listings
- **BlogHero**: Hero section for blog pages
- **BlogSubscription**: Newsletter subscription component

## 🔒 Security Features

### Row Level Security (RLS)
- Public read access for published content
- Admin-only access for content management
- Secure image upload with proper policies

### Data Validation
- Required field validation
- Slug uniqueness checking
- Image type and size restrictions
- XSS protection through proper escaping

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablets
- **Desktop**: Full-featured desktop experience
- **Touch-friendly**: Large touch targets for mobile

## 🚀 Performance Features

- **Optimized Images**: Next.js Image component with proper sizing
- **Lazy Loading**: Images load as needed
- **Efficient Queries**: Optimized database queries with proper indexing
- **Caching**: Browser caching for static assets

## 🔍 SEO Features

- **Meta Tags**: Proper meta descriptions and keywords
- **Open Graph**: Social media sharing optimization
- **Structured URLs**: Clean, descriptive URLs
- **Sitemap Ready**: URLs ready for sitemap generation

## 🛠️ Development Notes

### TypeScript Support
- Full TypeScript interfaces for all data structures
- Type-safe API responses
- Proper component prop typing

### Error Handling
- Graceful error handling throughout the system
- User-friendly error messages
- Fallback content for failed requests

### Extensibility
- Modular component structure
- Easy to add new features
- Configurable settings

## 📊 Analytics Ready

- View count tracking built-in
- Ready for Google Analytics integration
- Performance monitoring capabilities

## 🔄 Future Enhancements

Potential future improvements:
- Rich text editor (WYSIWYG)
- Comment system
- Social sharing buttons
- Related posts suggestions
- Search functionality
- RSS feed generation
- Email notifications
- Multi-author support

## ✅ Testing Checklist

- [ ] Database schema execution
- [ ] Admin authentication
- [ ] Blog post creation
- [ ] Category management
- [ ] Tag management
- [ ] Image upload
- [ ] Frontend display
- [ ] Slug-based routing
- [ ] SEO meta tags
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] View count tracking

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection**: Ensure Supabase credentials are correct
2. **Image Upload**: Check storage bucket policies
3. **Slug Conflicts**: System automatically handles duplicates
4. **Missing Posts**: Check publication status and date
5. **Admin Access**: Verify authentication status

### Support

For issues or questions:
1. Check the console for error messages
2. Verify database schema is properly installed
3. Ensure all environment variables are set
4. Check Supabase dashboard for any issues

---

The dynamic blog system is now ready for production use with full admin capabilities and SEO-optimized frontend display!

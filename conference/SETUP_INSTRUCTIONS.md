# Conference Admin System - Setup Instructions

## 🚀 Quick Setup Guide

Follow these steps to activate the Conference Admin Management System:

### 1. Database Setup (Required)

**Execute the SQL Schema in Supabase:**

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `conference/sql/conference-hero-schema.sql`
4. Click "Run" to execute the schema
5. **If you have existing conference data**, also run `conference/sql/conference-hero-migration.sql` to migrate to the new simplified structure
6. Verify that the following are created:
   - Tables: `conference_hero_sections`, `conference_hero_images`
   - Storage bucket: `conference-hero-images`
   - Functions: `get_conference_hero_section_with_image()`, `activate_conference_hero_image()`
   - RLS policies for both tables and storage

### 2. Verify Environment Variables

Ensure your `.env.local` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Test the System

#### Admin Interface Testing:
1. Navigate to `/admin/pages/conference`
2. Click on "Hero Section"
3. Try editing content in the "Content Settings" tab
4. Upload an image in the "Background Images" tab
5. Preview changes in the "Preview" tab
6. Save changes and verify they persist

#### Frontend Testing:
1. Visit `/conference` page
2. Verify that the hero section displays dynamic content
3. Check that uploaded images appear as backgrounds
4. Test call-to-action buttons functionality

### 4. Initial Content Setup

The system requires you to add content through the admin panel:

1. **Access Admin Panel**: Go to `/admin/pages/conference/hero`
2. **Add Content**: Enter the main heading (required)
3. **Upload Images**: Add professional conference background images
4. **Save Changes**: Click "Save Changes" to publish
5. **Verify Frontend**: Visit `/conference` to see the hero section

**Note**: The hero section will not appear on the frontend until content is added through the admin panel.

### 5. Troubleshooting

#### Common Issues:

**"Multiple rows returned" Error:**
- This occurs when there are multiple active hero sections in the database
- Run `conference/sql/cleanup-duplicate-hero-sections.sql` to fix this
- The script will keep only the most recent hero section active

**Database Connection Errors:**
- Verify Supabase environment variables
- Check if SQL schema was executed successfully
- Ensure RLS policies are properly configured

**Image Upload Issues:**
- Confirm storage bucket exists and is public
- Check file size limits (10MB max)
- Verify supported formats (JPG, PNG, WebP)

**Admin Access Issues:**
- Ensure user is authenticated
- Check admin permissions in Supabase Auth

#### Debug Steps:

1. **Check Browser Console**: Look for JavaScript errors
2. **Verify Database**: Check Supabase logs for query errors
3. **Test Storage**: Ensure images can be uploaded to bucket
4. **Validate Permissions**: Confirm RLS policies allow operations

### 6. Production Checklist

Before going live:

- [ ] SQL schema executed successfully
- [ ] Storage bucket created with proper policies
- [ ] Environment variables configured
- [ ] Admin interface accessible and functional
- [ ] Frontend displays dynamic content correctly
- [ ] Image upload and management working
- [ ] Call-to-action buttons link to correct pages
- [ ] Error handling tested (database unavailable scenarios)
- [ ] Mobile responsiveness verified
- [ ] Performance tested with multiple images

### 7. Maintenance

#### Regular Tasks:
- **Monitor Storage Usage**: Keep track of uploaded images
- **Clean Unused Images**: Remove old/unused background images
- **Update Content**: Keep conference information current
- **Backup Data**: Regular database backups recommended

#### Performance Optimization:
- **Image Optimization**: Compress images before upload
- **CDN Usage**: Leverage Supabase CDN for fast delivery
- **Caching**: Browser caching for static assets

## 📞 Support

If you encounter any issues during setup:

1. Check the main `conference/README.md` for detailed documentation
2. Review Supabase logs for specific error messages
3. Verify all file paths and imports are correct
4. Ensure all dependencies are installed

## ✅ Success Indicators

You'll know the system is working correctly when:

- Conference admin section appears in sidebar navigation
- Hero section admin interface loads without errors
- Content can be edited and saved successfully
- Images can be uploaded and activated
- Frontend conference page displays dynamic content
- Changes made in admin reflect on the frontend immediately

---

**Next Steps**: Once setup is complete, you can extend the system to manage other conference page sections following the same patterns established for the hero section.

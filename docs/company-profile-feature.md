# Company Profile PDF Upload Feature

## Overview

This feature allows administrators to upload and manage company profile PDF documents through the admin panel. The uploaded PDF is dynamically displayed in the footer download section, enabling visitors to download the latest company profile.

## Features

- **Admin Upload Interface**: Easy-to-use admin panel for uploading PDF documents
- **File Validation**: Ensures only PDF files up to 100MB are accepted
- **Version Management**: Track different versions of company profiles
- **Current Document Selection**: Only one document can be "current" at a time
- **Dynamic Footer Integration**: Footer automatically displays the latest active document
- **Automatic Revalidation**: Pages update immediately when documents are changed
- **Secure Storage**: Files stored in Supabase storage with proper access controls

## Database Schema

### Table: `company_profile_documents`

```sql
CREATE TABLE company_profile_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  title TEXT NOT NULL DEFAULT 'Company Profile',
  description TEXT,
  version TEXT DEFAULT '1.0',
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_current BOOLEAN NOT NULL DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket: `company-profile-documents`

- **Public Access**: Yes (for downloads)
- **File Size Limit**: 100MB
- **Allowed MIME Types**: `application/pdf`
- **Authentication Required**: For uploads/management

## API Endpoints

### GET `/api/company-profile`

Retrieve company profile documents.

**Query Parameters:**
- `current=true` - Get the current active document
- `id={uuid}` - Get specific document by ID
- No parameters - Get all documents

**Response:**
```json
{
  "success": true,
  "data": {
    "document": { /* CompanyProfileDocument */ },
    "downloadUrl": "https://...",
    "documents": [ /* Array of documents */ ],
    "total": 5,
    "current": { /* Current document */ }
  }
}
```

### POST `/api/company-profile`

Upload a new company profile document.

**Body (FormData):**
- `file` - PDF file
- `title` - Document title
- `description` - Optional description
- `version` - Version identifier
- `is_active` - Boolean (default: true)
- `is_current` - Boolean (default: false)

### PUT `/api/company-profile?id={uuid}`

Update document metadata or set as current.

**Query Parameters:**
- `action=set_current` - Set document as current

### DELETE `/api/company-profile?id={uuid}`

Delete a document and its associated file.

## Admin Interface

### Location
`/admin/company-profile`

### Features
- **Upload Dialog**: Modal for uploading new documents
- **Document List**: View all uploaded documents with status badges
- **Current Document Display**: Highlighted section showing active document
- **Actions**: Preview, download, set current, delete
- **File Validation**: Real-time validation with error messages
- **Progress Indicators**: Loading states for all operations

### Form Fields
- **File Upload**: PDF file selector with drag-and-drop
- **Title**: Document title (required)
- **Description**: Optional description
- **Version**: Version identifier
- **Active**: Whether document is available
- **Set as Current**: Make this the active download

## Footer Integration

The footer component automatically:
- Fetches the current active document on page load
- Displays download button with proper states:
  - Loading state while fetching
  - Active state when document available
  - Disabled state when no document
- Handles download with proper filename
- Updates automatically when documents change (via revalidation)

## File Management

### Upload Process
1. File validation (type, size)
2. Generate unique filename with timestamp
3. Upload to Supabase storage
4. Create database record
5. Set as current if specified
6. Revalidate affected pages

### Security
- Authentication required for all admin operations
- Row Level Security (RLS) policies
- Public read access for active documents only
- Secure file storage with access controls

## Setup Instructions

### 1. Database Setup
Run the SQL schema file:
```bash
psql -f supabase/company-profile-schema.sql
```

### 2. Storage Bucket
The schema automatically creates the storage bucket with proper policies.

### 3. Environment Variables
Ensure Supabase configuration is properly set in your environment.

### 4. Admin Access
Ensure admin users have proper authentication to access `/admin/company-profile`.

## Usage Workflow

### For Administrators
1. Navigate to `/admin/company-profile`
2. Click "Upload New Document"
3. Select PDF file and fill in metadata
4. Choose whether to set as current document
5. Upload and verify in document list
6. Test download from footer

### For Visitors
1. Visit any page with the footer
2. See "Download Our Company Profile" section
3. Click "Download Now" button
4. PDF downloads with proper filename

## Error Handling

### File Validation Errors
- Invalid file type (not PDF)
- File too large (>100MB)
- Empty file
- Missing required fields

### Upload Errors
- Storage upload failures
- Database insertion errors
- Authentication issues
- Network connectivity problems

### Download Errors
- Document not found
- Storage access issues
- Network problems

## Monitoring

### Admin Dashboard
- View all uploaded documents
- See current active document
- Monitor file sizes and versions
- Track upload dates and users

### Logs
- Upload/download activities
- Error tracking
- Performance monitoring

## Best Practices

### File Management
- Use descriptive titles and versions
- Keep file sizes reasonable (<10MB recommended)
- Regular cleanup of old documents
- Backup important documents

### Content Updates
- Test downloads after uploads
- Verify document content before setting as current
- Coordinate updates with marketing team
- Maintain version history

## Troubleshooting

### Common Issues
1. **Upload fails**: Check file size and type
2. **Download not working**: Verify document is active and current
3. **Footer not updating**: Check revalidation is working
4. **Access denied**: Verify authentication and permissions

### Debug Steps
1. Check browser console for errors
2. Verify API responses in Network tab
3. Check Supabase storage permissions
4. Validate database records

## Future Enhancements

### Potential Features
- Multiple file format support
- Document preview in admin
- Approval workflow
- Download analytics
- Automated backups
- Document expiration dates
- Multi-language support

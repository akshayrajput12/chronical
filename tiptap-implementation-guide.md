# Tiptap Editor Implementation Guide for Blog Content

## Current Database Analysis

### Database Schema Compatibility ✅
Your current `blog_posts` table is **fully compatible** with Tiptap editor:

```sql
-- Current content field in blog_posts table
content TEXT,  -- This can store HTML/JSON from Tiptap
```

**Key Points:**
- The `content` field is TEXT type - perfect for storing HTML or JSON
- No database changes needed
- Current admin forms use simple textarea - needs upgrade to Tiptap

### Current Admin Implementation
- **Location**: `src/app/admin/pages/blog/new/page.tsx` & `src/app/admin/pages/blog/edit/[id]/page.tsx`
- **Current Editor**: Basic HTML textarea with rows={15}
- **Content Storage**: Plain text/HTML in `content` field
- **API**: Already handles content via `/api/blog/posts` routes

## Implementation Plan

### Phase 1: Install Tiptap Dependencies
```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
npm install @tiptap/extension-image @tiptap/extension-link
npm install @tiptap/extension-table @tiptap/extension-table-row
npm install @tiptap/extension-table-cell @tiptap/extension-table-header
```

### Phase 2: Create Tiptap Editor Component

**File**: `src/components/admin/TiptapEditor.tsx`

```tsx
'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  })

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
        >
          Italic
        </button>
        {/* Add more toolbar buttons */}
      </div>
      
      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
```

### Phase 3: Replace Textarea in Admin Forms

**In**: `src/app/admin/pages/blog/new/page.tsx` (line ~328-343)
**Replace**:
```tsx
<Textarea
  id="content"
  value={formData.content}
  onChange={e => setFormData(prev => ({...prev, content: e.target.value}))}
  placeholder="Write your post content here..."
  rows={15}
  className="font-mono"
/>
```

**With**:
```tsx
<TiptapEditor
  content={formData.content}
  onChange={(content) => setFormData(prev => ({...prev, content}))}
  placeholder="Write your post content here..."
/>
```

### Phase 4: Image Upload Integration

**Enhanced Editor with Image Upload**:
```tsx
const addImage = useCallback(() => {
  const url = window.prompt('Enter image URL:')
  if (url) {
    editor?.chain().focus().setImage({ src: url }).run()
  }
}, [editor])

// Or integrate with your existing image upload system
const handleImageUpload = async (file: File) => {
  // Use your existing handleImageUpload function
  const imageUrl = await uploadToSupabase(file)
  editor?.chain().focus().setImage({ src: imageUrl }).run()
}
```

## Database Considerations

### Content Storage Options

**Option 1: HTML Storage (Recommended)**
- Store Tiptap HTML output directly in `content` field
- Pros: Easy to render, SEO-friendly, works with existing setup
- Cons: Less structured than JSON

**Option 2: JSON Storage**
- Store Tiptap JSON in `content` field
- Pros: More structured, easier to manipulate programmatically
- Cons: Requires conversion for display

### Migration Strategy
1. **No database migration needed** - current TEXT field works
2. **Gradual rollout**: New posts use Tiptap, old posts remain as-is
3. **Content validation**: Add client-side validation for rich content

## Frontend Display

### Blog Post Display Component
**File**: `src/components/blog/BlogContent.tsx`

```tsx
interface BlogContentProps {
  content: string
}

export default function BlogContent({ content }: BlogContentProps) {
  return (
    <div 
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
```

## Advanced Features

### Custom Extensions
- **Mention system**: For tagging users/categories
- **Code blocks**: Syntax highlighting
- **Embeds**: YouTube, Twitter integration
- **Custom blocks**: Call-to-action boxes

### Image Management Integration
- Connect with existing `blog_images` table
- Drag & drop image upload
- Image gallery picker from uploaded images

## Testing Strategy

1. **Create test blog post** with rich content
2. **Verify HTML output** renders correctly
3. **Test image uploads** work with Tiptap
4. **Check mobile responsiveness** of editor
5. **Validate content persistence** across edit sessions

## Next Steps

1. Install Tiptap dependencies
2. Create TiptapEditor component
3. Replace textarea in admin forms
4. Test with sample content
5. Add advanced features as needed

## Benefits of This Approach

✅ **No database changes required**
✅ **Backward compatible** with existing content
✅ **Rich editing experience** for content creators
✅ **SEO-friendly HTML output**
✅ **Extensible** for future features
✅ **Integrates with existing image upload system**

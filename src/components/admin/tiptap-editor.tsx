'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import { useCallback, useState } from 'react'
import ImageUploadModal from './modals/image-upload-modal'
import LinkModal from './modals/link-modal'
import TableModal from './modals/table-modal'
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from 'lucide-react'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  blogPostId?: string
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = "Start writing your blog content...",
  className = "",
  blogPostId
}: TiptapEditorProps) {
  // Modal states
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [tableModalOpen, setTableModalOpen] = useState(false)
  const [linkData, setLinkData] = useState({ url: '', text: '', isEditing: false })
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the built-in list extensions to use our custom ones
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      // Explicitly add list extensions with proper configuration
      ListItem.configure({
        HTMLAttributes: {
          class: 'my-1',
        },
      }),
      BulletList.configure({
        keepMarks: true,
        keepAttributes: false,
        HTMLAttributes: {
          class: 'list-disc pl-6 space-y-1 my-4',
        },
      }),
      OrderedList.configure({
        keepMarks: true,
        keepAttributes: false,
        HTMLAttributes: {
          class: 'list-decimal pl-6 space-y-1 my-4',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-400 w-full my-4',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border border-gray-400',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-400 bg-gray-100 font-semibold px-3 py-2',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-400 px-3 py-2',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[400px] p-6 max-w-none prose-ul:list-disc prose-ol:list-decimal prose-li:my-1',
      },
    },
  })

  // Modal handlers
  const handleImageInsert = useCallback((imageUrl: string, altText: string) => {
    if (editor) {
      editor.chain().focus().setImage({
        src: imageUrl,
        alt: altText
      }).run()
    }
  }, [editor])

  const handleLinkInsert = useCallback((url: string, text?: string, target?: string) => {
    if (editor) {
      const linkAttributes: any = { href: url }
      if (target) {
        linkAttributes.target = target
        if (target === '_blank') {
          linkAttributes.rel = 'noopener noreferrer'
        }
      }

      if (text) {
        editor.chain().focus().insertContent(`<a href="${url}"${target ? ` target="${target}"` : ''}${target === '_blank' ? ' rel="noopener noreferrer"' : ''}>${text}</a>`).run()
      } else {
        editor.chain().focus().extendMarkRange('link').setLink(linkAttributes).run()
      }
    }
  }, [editor])

  const handleLinkRemove = useCallback(() => {
    if (editor) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    }
  }, [editor])

  const handleTableInsert = useCallback((rows: number, cols: number, withHeaderRow: boolean) => {
    if (editor) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run()
    }
  }, [editor])

  const openImageModal = useCallback(() => {
    setImageModalOpen(true)
  }, [])

  const openLinkModal = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href || ''
    const selectedText = editor?.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    ) || ''

    setLinkData({
      url: previousUrl,
      text: selectedText,
      isEditing: !!previousUrl
    })
    setLinkModalOpen(true)
  }, [editor])

  const openTableModal = useCallback(() => {
    setTableModalOpen(true)
  }, [])

  if (!editor) {
    return <div className="min-h-[400px] bg-gray-50 animate-pulse rounded-lg"></div>
  }

  return (
    <div className={`border rounded-lg bg-white ${className}`}>
      {/* Custom styles for lists */}
      <style jsx>{`
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .ProseMirror li {
          margin: 0.25rem 0;
          line-height: 1.6;
        }
        .ProseMirror li p {
          margin: 0;
        }
      `}</style>
      {/* Toolbar */}
      <div className="border-b p-3 flex flex-wrap gap-1 bg-gray-50">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('bold') ? 'bg-gray-300' : ''
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('italic') ? 'bg-gray-300' : ''
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('strike') ? 'bg-gray-300' : ''
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('code') ? 'bg-gray-300' : ''
            }`}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bulletList') ? 'bg-blue-200 text-blue-800' : ''
            }`}
            title="Bullet List (Ctrl+Shift+8)"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('orderedList') ? 'bg-blue-200 text-blue-800' : ''
            }`}
            title="Numbered List (Ctrl+Shift+7)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('blockquote') ? 'bg-gray-300' : ''
            }`}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Media & Links */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button
            onClick={openLinkModal}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('link') ? 'bg-gray-300' : ''
            }`}
            title="Add/Edit Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            onClick={openImageModal}
            className="p-2 rounded hover:bg-gray-200"
            title="Upload Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            onClick={openTableModal}
            className="p-2 rounded hover:bg-gray-200"
            title="Insert Table"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px]">
        <EditorContent editor={editor} />
      </div>

      {/* Modals */}
      <ImageUploadModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onImageInsert={handleImageInsert}
        blogPostId={blogPostId}
      />

      <LinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onLinkInsert={handleLinkInsert}
        onLinkRemove={linkData.isEditing ? handleLinkRemove : undefined}
        initialUrl={linkData.url}
        initialText={linkData.text}
        isEditing={linkData.isEditing}
      />

      <TableModal
        isOpen={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        onTableInsert={handleTableInsert}
      />
    </div>
  )
}

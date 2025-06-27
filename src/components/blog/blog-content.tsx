'use client'

import React from 'react'

interface BlogContentProps {
  content: string
  className?: string
}

export default function BlogContent({ content, className = "" }: BlogContentProps) {
  return (
    <div
      className={`
        prose prose-lg max-w-none
        prose-headings:text-gray-900 prose-headings:font-bold
        prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
        prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6
        prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800 hover:prose-a:underline
        prose-strong:text-gray-900 prose-strong:font-semibold
        prose-em:text-gray-700 prose-em:italic
        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
        prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ul:space-y-2
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-ol:space-y-2
        prose-li:mb-1 prose-li:text-gray-700 prose-li:leading-relaxed
        prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
        prose-table:border-collapse prose-table:border-2 prose-table:border-gray-400 prose-table:my-6 prose-table:w-full prose-table:bg-white prose-table:shadow-sm
        prose-th:border prose-th:border-gray-400 prose-th:bg-gray-100 prose-th:px-4 prose-th:py-3 prose-th:font-bold prose-th:text-left prose-th:text-gray-900
        prose-td:border prose-td:border-gray-400 prose-td:px-4 prose-td:py-3 prose-td:text-gray-700 prose-td:align-top
        ${className}
      `}
      style={{
        whiteSpace: 'pre-wrap', // Preserve whitespace and line breaks
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

// Alternative component for cases where you want to sanitize HTML
export function SafeBlogContent({ content, className = "" }: BlogContentProps) {
  // You can add DOMPurify here if needed for extra security
  // import DOMPurify from 'dompurify'
  // const sanitizedContent = DOMPurify.sanitize(content)

  return (
    <div
      className={`
        prose prose-lg max-w-none
        prose-headings:text-gray-900 prose-headings:font-bold
        prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
        prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6
        prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800 hover:prose-a:underline
        prose-strong:text-gray-900 prose-strong:font-semibold
        prose-em:text-gray-700 prose-em:italic
        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
        prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ul:space-y-2
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-ol:space-y-2
        prose-li:mb-1 prose-li:text-gray-700 prose-li:leading-relaxed
        prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
        prose-table:border-collapse prose-table:border-2 prose-table:border-gray-400 prose-table:my-6 prose-table:w-full prose-table:bg-white prose-table:shadow-sm
        prose-th:border prose-th:border-gray-400 prose-th:bg-gray-100 prose-th:px-4 prose-th:py-3 prose-th:font-bold prose-th:text-left prose-th:text-gray-900
        prose-td:border prose-td:border-gray-400 prose-td:px-4 prose-td:py-3 prose-td:text-gray-700 prose-td:align-top
        ${className}
      `}
      style={{
        whiteSpace: 'pre-wrap', // Preserve whitespace and line breaks
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

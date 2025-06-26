'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

export interface DeferredImageData {
  file: File | null
  previewUrl: string
  uploaded: boolean
  uploadedUrl?: string
}

interface DeferredImageUploadProps {
  label: string
  value: DeferredImageData
  onChange: (data: DeferredImageData) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
  placeholder?: string
}

export default function DeferredImageUpload({
  label,
  value,
  onChange,
  accept = "image/*",
  maxSize = 10,
  className = "",
  placeholder = "Click to upload or drag and drop"
}: DeferredImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    // Clean up previous preview URL
    if (value.previewUrl && !value.uploaded) {
      URL.revokeObjectURL(value.previewUrl)
    }

    // Create new preview URL
    const previewUrl = URL.createObjectURL(file)

    onChange({
      file,
      previewUrl,
      uploaded: false,
      uploadedUrl: undefined
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleRemove = () => {
    // Clean up preview URL
    if (value.previewUrl && !value.uploaded) {
      URL.revokeObjectURL(value.previewUrl)
    }

    onChange({
      file: null,
      previewUrl: '',
      uploaded: false,
      uploadedUrl: undefined
    })
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      
      {value.previewUrl ? (
        // Preview State
        <div className="relative">
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-start space-x-4">
              <img 
                src={value.previewUrl} 
                alt="Preview" 
                className="w-24 h-24 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {value.file?.name || 'Uploaded Image'}
                    </p>
                    {value.file && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(value.file.size)}
                      </p>
                    )}
                    <div className="flex items-center mt-1">
                      {value.uploaded ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Uploaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⏳ Will upload on publish
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemove}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Upload State
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gray-100 rounded-full">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {placeholder}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG, WebP up to {maxSize}MB
              </p>
            </div>
            <div className="flex justify-center">
              <Button variant="outline" size="sm" type="button">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
        }}
      />

      {!value.uploaded && value.file && (
        <p className="text-xs text-gray-500">
          💡 This image will be uploaded to Supabase when you publish the blog post
        </p>
      )}
    </div>
  )
}

// Helper function to create initial deferred image data
export function createEmptyDeferredImage(): DeferredImageData {
  return {
    file: null,
    previewUrl: '',
    uploaded: false,
    uploadedUrl: undefined
  }
}

// Helper function to create deferred image data from existing URL
export function createDeferredImageFromUrl(url: string): DeferredImageData {
  return {
    file: null,
    previewUrl: url,
    uploaded: true,
    uploadedUrl: url
  }
}

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export interface BlogImageCleanupResult {
  success: boolean
  deletedImages: number
  errors: string[]
}

/**
 * Delete all images associated with a blog post from both storage and database
 */
export async function deleteBlogPostImages(postId: string): Promise<BlogImageCleanupResult> {
  const result: BlogImageCleanupResult = {
    success: true,
    deletedImages: 0,
    errors: []
  }

  try {
    // First, get all images associated with this blog post
    const { data: blogImages, error: fetchError } = await supabase
      .from('blog_images')
      .select('id, file_path, filename')
      .eq('blog_post_id', postId)

    if (fetchError) {
      result.success = false
      result.errors.push(`Failed to fetch blog images: ${fetchError.message}`)
      return result
    }

    if (!blogImages || blogImages.length === 0) {
      return result // No images to delete
    }

    // Delete images from storage
    const filePaths = blogImages.map(img => img.file_path)
    
    if (filePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('blog-images')
        .remove(filePaths)

      if (storageError) {
        result.errors.push(`Failed to delete some images from storage: ${storageError.message}`)
      }
    }

    // Delete image records from database
    const { error: dbError } = await supabase
      .from('blog_images')
      .delete()
      .eq('blog_post_id', postId)

    if (dbError) {
      result.success = false
      result.errors.push(`Failed to delete image records: ${dbError.message}`)
    } else {
      result.deletedImages = blogImages.length
    }

    return result
  } catch (error) {
    result.success = false
    result.errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return result
  }
}

/**
 * Delete featured and hero images from storage based on URLs
 */
export async function deleteFeaturedAndHeroImages(
  featuredImageUrl?: string, 
  heroImageUrl?: string
): Promise<BlogImageCleanupResult> {
  const result: BlogImageCleanupResult = {
    success: true,
    deletedImages: 0,
    errors: []
  }

  const imagesToDelete: string[] = []

  try {
    // Extract file paths from URLs
    if (featuredImageUrl) {
      const featuredPath = extractFilePathFromUrl(featuredImageUrl, 'blog-featured-images')
      if (featuredPath) imagesToDelete.push(featuredPath)
    }

    if (heroImageUrl) {
      const heroPath = extractFilePathFromUrl(heroImageUrl, 'blog-images')
      if (heroPath) imagesToDelete.push(heroPath)
    }

    if (imagesToDelete.length === 0) {
      return result // No images to delete
    }

    // Delete featured image from blog-featured-images bucket
    if (featuredImageUrl) {
      const featuredPath = extractFilePathFromUrl(featuredImageUrl, 'blog-featured-images')
      if (featuredPath) {
        const { error } = await supabase.storage
          .from('blog-featured-images')
          .remove([featuredPath])

        if (error) {
          result.errors.push(`Failed to delete featured image: ${error.message}`)
        } else {
          result.deletedImages++
        }
      }
    }

    // Delete hero image from blog-images bucket
    if (heroImageUrl) {
      const heroPath = extractFilePathFromUrl(heroImageUrl, 'blog-images')
      if (heroPath) {
        const { error } = await supabase.storage
          .from('blog-images')
          .remove([heroPath])

        if (error) {
          result.errors.push(`Failed to delete hero image: ${error.message}`)
        } else {
          result.deletedImages++
        }
      }
    }

    if (result.errors.length > 0) {
      result.success = false
    }

    return result
  } catch (error) {
    result.success = false
    result.errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return result
  }
}

/**
 * Extract file path from Supabase storage URL
 */
function extractFilePathFromUrl(url: string, bucketName: string): string | null {
  try {
    // Supabase storage URLs typically follow this pattern:
    // https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlParts = url.split(`/storage/v1/object/public/${bucketName}/`)
    if (urlParts.length === 2) {
      return urlParts[1]
    }
    return null
  } catch {
    return null
  }
}

/**
 * Upload image to Supabase storage
 */
export async function uploadImageToStorage(
  file: File, 
  bucket: string, 
  path?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return { success: true, url: publicUrl }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

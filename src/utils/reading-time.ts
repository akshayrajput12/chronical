/**
 * Utility functions for calculating reading time from blog content
 */

/**
 * Calculate reading time based on content
 * @param content - HTML or plain text content
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  if (!content) return 0;
  
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '');
  
  // Count words (split by whitespace and filter out empty strings)
  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Calculate reading time in minutes
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  // Minimum 1 minute reading time
  return Math.max(1, readingTime);
}

/**
 * Format reading time for display
 * @param minutes - Reading time in minutes
 * @returns Formatted string like "5 min read"
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return "1 min read";
  }
  return `${minutes} min read`;
}

/**
 * Calculate and format reading time in one function
 * @param content - HTML or plain text content
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Formatted reading time string
 */
export function getReadingTime(content: string, wordsPerMinute: number = 200): string {
  const minutes = calculateReadingTime(content, wordsPerMinute);
  return formatReadingTime(minutes);
}

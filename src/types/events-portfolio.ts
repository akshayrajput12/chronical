// ============================================================================
// EVENTS PORTFOLIO TYPES
// ============================================================================
// TypeScript types for events portfolio image management
// Created: 2025-07-18

// ============================================================================
// CORE IMAGE TYPES
// ============================================================================

export interface EventsPortfolioImage {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  title: string;
  description?: string;
  alt_text: string;
  caption?: string;
  event_name?: string;
  event_date?: string;
  event_location?: string;
  event_type?: EventType;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  tags?: string[];
  seo_keywords?: string;
  uploaded_by?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

// Input type for creating/updating events portfolio images
export interface EventsPortfolioImageInput {
  title: string;
  description?: string;
  alt_text?: string;
  caption?: string;
  event_name?: string;
  event_date?: string;
  event_location?: string;
  event_type?: EventType;
  is_active?: boolean;
  is_featured?: boolean;
  display_order?: number;
  tags?: string[];
  seo_keywords?: string;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export type EventType = 'conference' | 'exhibition' | 'trade_show' | 'corporate' | 'other';

export const EVENT_TYPES: Record<EventType, string> = {
  conference: 'Conference',
  exhibition: 'Exhibition',
  trade_show: 'Trade Show',
  corporate: 'Corporate Event',
  other: 'Other'
};

// ============================================================================
// UPLOAD TYPES
// ============================================================================

export interface EventsPortfolioUploadData {
  file: File;
  title: string;
  description?: string;
  alt_text?: string;
  caption?: string;
  event_name?: string;
  event_date?: string;
  event_location?: string;
  event_type?: EventType;
  is_active?: boolean;
  is_featured?: boolean;
  display_order?: number;
  tags?: string[];
  seo_keywords?: string;
}

export interface EventsPortfolioUploadResponse {
  success: boolean;
  data?: {
    image: EventsPortfolioImage;
    url: string;
    path: string;
  };
  error?: string;
}

export interface EventsPortfolioDeleteResponse {
  success: boolean;
  error?: string;
}

// ============================================================================
// ADMIN FORM TYPES
// ============================================================================

export interface EventsPortfolioFormData {
  title: string;
  description: string;
  alt_text: string;
  caption: string;
  event_name: string;
  event_date: string;
  event_location: string;
  event_type: EventType | '';
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  tags: string[];
  seo_keywords: string;
}

export interface EventsPortfolioFormState {
  isLoading: boolean;
  isSaving: boolean;
  isUploading: boolean;
  isDeleting: boolean;
  isReordering: boolean;
  hasChanges: boolean;
  errors: Record<string, string>;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface EventsPortfolioApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EventsPortfolioListResponse {
  success: boolean;
  data?: {
    images: EventsPortfolioImage[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  error?: string;
}

export interface EventsPortfolioStatsResponse {
  success: boolean;
  data?: {
    total_images: number;
    active_images: number;
    featured_images: number;
    total_size_bytes: number;
    event_types_count: Record<string, number>;
  };
  error?: string;
}

// ============================================================================
// STORAGE TYPES
// ============================================================================

export type EventsPortfolioStorageBucket = 'events-portfolio-images';

export interface EventsPortfolioStorageConfig {
  bucket: EventsPortfolioStorageBucket;
  maxFileSize: number; // in bytes
  allowedTypes: string[];
  isPublic: boolean;
}

export const EVENTS_PORTFOLIO_STORAGE_CONFIG: Record<EventsPortfolioStorageBucket, EventsPortfolioStorageConfig> = {
  'events-portfolio-images': {
    bucket: 'events-portfolio-images',
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    isPublic: true
  }
};

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface EventsPortfolioValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface EventsPortfolioFileValidation {
  isValid: boolean;
  error?: string;
  size?: number;
  type?: string;
  dimensions?: { width: number; height: number };
}

// ============================================================================
// FILTER AND SEARCH TYPES
// ============================================================================

export interface EventsPortfolioFilter {
  event_type?: EventType;
  is_featured?: boolean;
  is_active?: boolean;
  search?: string;
  tags?: string[];
  sortBy?: 'display_order' | 'created_at' | 'updated_at' | 'title' | 'event_date';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface EventsPortfolioSearchResult {
  id: string;
  title: string;
  description?: string;
  event_name?: string;
  event_location?: string;
  file_path: string;
  alt_text: string;
  is_featured: boolean;
  display_order: number;
  rank: number;
}

// ============================================================================
// REORDER TYPES
// ============================================================================

export interface EventsPortfolioReorderItem {
  id: string;
  display_order: number;
}

export interface EventsPortfolioReorderRequest {
  items: EventsPortfolioReorderItem[];
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface EventsPortfolioNotification {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// ============================================================================
// ADMIN MANAGEMENT TYPES
// ============================================================================

export interface EventsPortfolioAdminStats {
  totalImages: number;
  activeImages: number;
  featuredImages: number;
  totalSize: number; // in bytes
  eventTypesBreakdown: Record<string, number>;
  lastUpload?: string;
}

export interface EventsPortfolioAdminAction {
  type: 'upload' | 'update' | 'delete' | 'reorder' | 'toggle_featured' | 'toggle_active';
  imageId?: string;
  data?: any;
}

// ============================================================================
// SERVICE TYPES
// ============================================================================

export interface EventsPortfolioServiceMethods {
  getImages(filter?: EventsPortfolioFilter): Promise<EventsPortfolioImage[]>;
  getImageById(id: string): Promise<EventsPortfolioImage | null>;
  uploadImage(data: EventsPortfolioUploadData): Promise<EventsPortfolioUploadResponse>;
  updateImage(id: string, data: EventsPortfolioImageInput): Promise<EventsPortfolioApiResponse<EventsPortfolioImage>>;
  deleteImage(id: string): Promise<EventsPortfolioDeleteResponse>;
  reorderImages(items: EventsPortfolioReorderItem[]): Promise<EventsPortfolioApiResponse<boolean>>;
  toggleFeatured(id: string): Promise<EventsPortfolioApiResponse<boolean>>;
  searchImages(term: string, limit?: number): Promise<EventsPortfolioSearchResult[]>;
  getStats(): Promise<EventsPortfolioAdminStats>;
  getDownloadUrl(image: EventsPortfolioImage): string;
  validateFile(file: File): EventsPortfolioFileValidation;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class EventsPortfolioError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'EventsPortfolioError';
  }
}

export interface EventsPortfolioErrorDetails {
  field?: string;
  code: string;
  message: string;
  details?: any;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const EVENTS_PORTFOLIO_CONSTANTS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  DEFAULT_TITLE: 'Events Portfolio Image',
  DEFAULT_ALT_TEXT: 'Events portfolio image',
  STORAGE_BUCKET: 'events-portfolio-images' as EventsPortfolioStorageBucket,
  MAX_TAGS: 10,
  MIN_DISPLAY_ORDER: 0,
  MAX_DISPLAY_ORDER: 9999,
} as const;

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isEventsPortfolioImage(obj: any): obj is EventsPortfolioImage {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.filename === 'string' &&
    typeof obj.file_path === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.alt_text === 'string' &&
    typeof obj.is_active === 'boolean' &&
    typeof obj.is_featured === 'boolean' &&
    typeof obj.display_order === 'number'
  );
}

export function isValidEventType(type: string): type is EventType {
  return ['conference', 'exhibition', 'trade_show', 'corporate', 'other'].includes(type);
}

export function isValidImageFile(file: File): boolean {
  return (
    EVENTS_PORTFOLIO_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.type as any) &&
    file.size > 0 &&
    file.size <= EVENTS_PORTFOLIO_CONSTANTS.MAX_FILE_SIZE
  );
}

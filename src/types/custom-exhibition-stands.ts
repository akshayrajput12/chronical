// Types for custom exhibition stands data structures

export interface CustomExhibitionHero {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  subtitle: string;
  background_image_id?: string;
  background_image_url?: string;
  background_image_alt?: string;
  is_active: boolean;
}

export interface CustomExhibitionLeadingContractor {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  paragraph_1: string;
  paragraph_2: string;
  is_active: boolean;
}

export interface CustomExhibitionPromoteBrand {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  paragraph_1: string;
  paragraph_2: string;
  paragraph_3: string;
  cta_text: string;
  cta_url: string;
  image_id?: string;
  image_url?: string;
  image_alt?: string;
  is_active: boolean;
}

export interface CustomExhibitionStrikingCustomized {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  paragraph_1: string;
  paragraph_2: string;
  image_id?: string;
  image_url?: string;
  image_alt?: string;
  is_active: boolean;
}

export interface CustomExhibitionReasonsToChoose {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  paragraph_1: string;
  paragraph_2: string;
  is_active: boolean;
}

export interface CustomExhibitionFAQSection {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  is_active: boolean;
}

export interface CustomExhibitionFAQItem {
  id?: string;
  created_at?: string;
  updated_at?: string;
  question: string;
  answer: string;
  list_items?: string[];
  display_order: number;
  is_active: boolean;
}

export interface CustomExhibitionLookingForStands {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  phone_number: string;
  phone_display: string;
  cta_text: string;
  background_color: string;
  is_active: boolean;
}

export interface CustomExhibitionImage {
  id?: string;
  created_at?: string;
  updated_at?: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  alt_text: string;
  caption?: string;
  section_type?: 'hero' | 'promote_brand' | 'striking_customized';
  is_active: boolean;
  uploaded_by?: string;
}

// Combined page data interface
export interface CustomExhibitionPageData {
  hero: CustomExhibitionHero | null;
  leading_contractor: CustomExhibitionLeadingContractor | null;
  promote_brand: CustomExhibitionPromoteBrand | null;
  striking_customized: CustomExhibitionStrikingCustomized | null;
  reasons_to_choose: CustomExhibitionReasonsToChoose | null;
  faq_section: CustomExhibitionFAQSection | null;
  faq_items: CustomExhibitionFAQItem[];
  looking_for_stands: CustomExhibitionLookingForStands | null;
}

// API response types
export interface CustomExhibitionApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Form state types for admin components
export interface CustomExhibitionFormState {
  isLoading: boolean;
  isSaving: boolean;
  isUploading?: boolean;
  hasChanges: boolean;
  errors: Record<string, string>;
}

// Image upload types
export interface ImageUploadOptions {
  sectionType: 'hero' | 'promote_brand' | 'striking_customized';
  altText?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

export interface ImageUploadResult {
  success: boolean;
  image?: CustomExhibitionImage;
  error?: string;
  publicUrl?: string;
}

// FAQ item form types
export interface FAQItemFormData {
  question: string;
  answer: string;
  list_items: string[];
  display_order: number;
}

// Validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

// Admin component props types
export interface AdminSectionProps {
  onSave?: () => void;
  onCancel?: () => void;
  isReadOnly?: boolean;
  showPreview?: boolean;
}

// Database function return types (matching SQL functions)
export interface CustomExhibitionPageDataFromDB {
  hero: any;
  leading_contractor: any;
  promote_brand: any;
  striking_customized: any;
  reasons_to_choose: any;
  faq_section: any;
  faq_items: any[];
  looking_for_stands: any;
}

// Supabase storage types
export interface StorageBucketConfig {
  id: string;
  name: string;
  public: boolean;
  file_size_limit: number;
  allowed_mime_types: string[];
}

// Admin navigation types
export interface AdminNavSection {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  isActive?: boolean;
}

// Export all types for easier imports
export type {
  CustomExhibitionHero as Hero,
  CustomExhibitionLeadingContractor as LeadingContractor,
  CustomExhibitionPromoteBrand as PromoteBrand,
  CustomExhibitionStrikingCustomized as StrikingCustomized,
  CustomExhibitionReasonsToChoose as ReasonsToChoose,
  CustomExhibitionFAQSection as FAQSection,
  CustomExhibitionFAQItem as FAQItem,
  CustomExhibitionLookingForStands as LookingForStands,
  CustomExhibitionImage as Image,
  CustomExhibitionPageData as PageData,
  CustomExhibitionFormState as FormState,
  ImageUploadOptions as ImageUpload,
  ImageUploadResult as ImageResult,
};

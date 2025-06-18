// Types for the setup process section

export interface SetupProcessStep {
  id: string;
  created_at: string;
  updated_at: string;
  section_id: string;
  title: string;
  description: string | null;
  step_number: number;
  step_type: 'diamond' | 'circle';
  category: 'how_to_apply' | 'getting_started';
  display_order: number;
  is_active: boolean;
}

export interface SetupProcessSection {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  subtitle: string;
  background_image_url: string | null;
  background_image_id: string | null;
  is_active: boolean;
  steps?: SetupProcessStep[];
}

export interface SetupProcessStepInput {
  title: string;
  description: string | null;
  step_number: number;
  step_type: 'diamond' | 'circle';
  category: 'how_to_apply' | 'getting_started';
  display_order: number;
  is_active: boolean;
}

export interface SetupProcessSectionInput {
  title: string;
  subtitle: string;
  background_image_url: string | null;
  background_image_id: string | null;
  is_active: boolean;
}

export interface SetupProcessSectionWithDetails extends SetupProcessSectionInput {
  steps: SetupProcessStepInput[];
}

// For the frontend component display
export interface SetupProcessDisplayData {
  id: string;
  title: string;
  subtitle: string;
  background_image_url: string | null;
  background_image_id: string | null;
  how_to_apply_steps: SetupProcessStep[];
  getting_started_steps: SetupProcessStep[];
}

// New types for image management
export interface SetupProcessImage {
  id: string;
  created_at: string;
  updated_at: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text: string;
  is_active: boolean;
  uploaded_by: string | null;
}

export interface SetupProcessImageInput {
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text: string;
  is_active: boolean;
}

// Image upload constraints
export const SETUP_PROCESS_IMAGE_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  STATIC_WIDTH: 1920,
  STATIC_HEIGHT: 1080,
  SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const,
} as const;

export type SupportedImageFormat = typeof SETUP_PROCESS_IMAGE_CONSTRAINTS.SUPPORTED_FORMATS[number];

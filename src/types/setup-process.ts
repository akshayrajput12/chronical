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
  how_to_apply_steps: SetupProcessStep[];
  getting_started_steps: SetupProcessStep[];
}

// Types for the new company section

export interface NewCompanyImage {
  id: string;
  created_at: string;
  updated_at: string;
  section_id: string;
  image_url: string;
  image_alt: string;
  column_number: number;
  display_order: number;
  is_active: boolean;
}

export interface NewCompanySection {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  subtitle: string;
  description_1: string;
  description_2: string;
  button_text: string;
  button_url: string;
  is_active: boolean;
}

export interface NewCompanySectionInput {
  title: string;
  subtitle: string;
  description_1: string;
  description_2: string;
  button_text: string;
  button_url: string;
  is_active: boolean;
}

export interface NewCompanyImageInput {
  section_id: string;
  image_url: string;
  image_alt: string;
  column_number: number;
  display_order: number;
  is_active: boolean;
}

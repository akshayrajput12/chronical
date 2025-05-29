
// Types for the essential support section (single table approach)

export interface EssentialSupportService {
  service_text: string;
  display_order: number;
  is_active: boolean;
}

export interface EssentialSupportCategory {
  title: string;
  icon_svg: string;
  display_order: number;
  is_active: boolean;
  services: EssentialSupportService[];
}

export interface EssentialSupportSection {
  id: string;
  heading: string;
  heading_span: string;
  description: string;
  cta_text: string;
  cta_url: string;
  categories: EssentialSupportCategory[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EssentialSupportSectionInput {
  heading: string;
  heading_span: string;
  description: string;
  cta_text: string;
  cta_url: string;
  categories: EssentialSupportCategory[];
  is_active?: boolean;
}

// Types for the hero section

export interface HeroTypingText {
  id: string;
  text: string;
  display_order: number;
}

export interface HeroSection {
  id: string;
  heading: string;
  subheading: string;
  description: string;
  cta_primary_text: string;
  cta_primary_url: string;
  cta_secondary_text: string;
  cta_secondary_url: string;
  typing_texts: HeroTypingText[];
}

export interface HeroSectionInput {
  heading: string;
  subheading: string;
  description: string;
  cta_primary_text: string;
  cta_primary_url: string;
  cta_secondary_text: string;
  cta_secondary_url: string;
}

export interface HeroTypingTextInput {
  text: string;
  display_order: number;
}

export interface HeroSectionWithTypingTexts extends HeroSectionInput {
  typing_texts: HeroTypingTextInput[];
}

// Types for the business section

export interface BusinessParagraph {
    id: string;
    content: string;
    display_order: number;
}

export interface BusinessStat {
    id: string;
    value: number;
    label: string;
    sublabel: string;
    display_order: number;
}

export interface BusinessSection {
    id: string;
    heading: string;
    subheading: string;
    paragraphs: BusinessParagraph[];
    stats: BusinessStat[];
}

export interface BusinessParagraphInput {
    content: string;
    display_order: number;
}

export interface BusinessStatInput {
    value: number;
    label: string;
    sublabel: string;
    display_order: number;
}

export interface BusinessSectionInput {
    heading: string;
    subheading: string;
}

export interface BusinessSectionWithDetails extends BusinessSectionInput {
    paragraphs: BusinessParagraphInput[];
}

// ============================================================================
// EVENTS MANAGEMENT SYSTEM - TYPESCRIPT INTERFACES
// ============================================================================
// Comprehensive TypeScript interfaces for the events management system
// ============================================================================

// ============================================================================
// CORE EVENT INTERFACES
// ============================================================================

export interface EventCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color: string;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
    created_by?: string;
    updated_by?: string;
}

export interface Event {
    id: string;
    title: string;
    slug: string;
    description?: string;
    detailed_description?: string;
    short_description?: string;
    
    // Event Details
    category_id?: string;
    organizer?: string;
    organized_by?: string;
    venue?: string;
    event_type?: string;
    industry?: string;
    audience?: string;
    
    // Date and Time
    start_date?: string;
    end_date?: string;
    date_range?: string;
    
    // Images
    featured_image_url?: string;
    hero_image_url?: string;
    hero_image_credit?: string;
    logo_image_url?: string;
    logo_text?: string;
    logo_subtext?: string;
    
    // SEO
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    
    // Status and Organization
    is_active: boolean;
    is_featured: boolean;
    display_order: number;
    
    // Timestamps
    created_at: string;
    updated_at: string;
    published_at?: string;
    
    // Metadata
    created_by?: string;
    updated_by?: string;
    
    // Related Data (populated by joins)
    category?: EventCategory;
    category_name?: string;
    category_slug?: string;
    category_color?: string;
    images?: EventImage[];
    gallery_images?: EventImage[];
}

export interface EventImage {
    id: string;
    event_id: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    alt_text: string;
    caption?: string;
    width?: number;
    height?: number;
    is_active: boolean;
    display_order: number;
    image_type: 'gallery' | 'featured' | 'hero' | 'logo';
    created_at: string;
    updated_at: string;
    uploaded_by?: string;
}

export interface EventsHero {
    id: string;
    main_heading: string;
    sub_heading?: string;
    background_image_url?: string;
    background_overlay_opacity: number;
    background_overlay_color: string;
    text_color: string;
    heading_font_size: 'small' | 'medium' | 'large' | 'xlarge' | 'responsive';
    subheading_font_size?: 'small' | 'medium' | 'large' | 'xlarge';
    text_alignment?: 'left' | 'center' | 'right';
    button_text?: string;
    button_url?: string;
    button_style?: 'primary' | 'secondary' | 'outline';
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by?: string;
    updated_by?: string;
}

export interface EventFormSubmission {
    id: string;
    event_id?: string;
    name: string;
    email: string;
    phone?: string;
    company_name?: string; // Form field
    exhibition_name?: string; // Form field
    budget?: string; // Form field
    message?: string;
    attachment_url?: string;
    attachment_filename?: string; // File attachment info
    attachment_size?: number; // File attachment info
    status: 'new' | 'read' | 'replied' | 'archived';
    is_spam: boolean;
    spam_score?: number;
    admin_notes?: string;
    handled_by?: string;
    created_at: string;
    updated_at: string;
    ip_address?: string;
    user_agent?: string;
    referrer?: string;

    // Related Data
    event?: Event;
}

// ============================================================================
// INPUT/FORM INTERFACES
// ============================================================================

export interface EventCategoryInput {
    name: string;
    slug: string;
    description?: string;
    color: string;
    is_active: boolean;
    display_order: number;
}

export interface EventInput {
    title: string;
    slug: string;
    description?: string;
    detailed_description?: string;
    short_description?: string;
    category_id?: string;
    organizer?: string;
    organized_by?: string;
    venue?: string;
    event_type?: string;
    industry?: string;
    audience?: string;
    start_date?: string;
    end_date?: string;
    date_range?: string;
    featured_image_url?: string;
    hero_image_url?: string;
    hero_image_credit?: string;
    logo_image_url?: string;
    logo_text?: string;
    logo_subtext?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    is_active: boolean;
    is_featured: boolean;
    display_order: number;
    published_at?: string;
}

export interface EventImageInput {
    event_id: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    alt_text: string;
    caption?: string;
    width?: number;
    height?: number;
    is_active: boolean;
    display_order: number;
    image_type: 'gallery' | 'featured' | 'hero' | 'logo';
}

export interface EventsHeroInput {
    main_heading: string;
    sub_heading?: string;
    background_image_url?: string;
    background_overlay_opacity: number;
    background_overlay_color: string;
    text_color: string;
    heading_font_size: 'small' | 'medium' | 'large' | 'xlarge' | 'responsive';
    subheading_font_size?: 'small' | 'medium' | 'large' | 'xlarge';
    text_alignment?: 'left' | 'center' | 'right';
    button_text?: string;
    button_url?: string;
    button_style?: 'primary' | 'secondary' | 'outline';
    is_active: boolean;
}

export interface EventFormSubmissionInput {
    event_id?: string;
    name: string;
    exhibition_name?: string; // Keep for form compatibility
    company_name?: string; // Keep for form compatibility
    email: string;
    phone?: string;
    budget?: string; // Keep for form compatibility
    message?: string;
    attachment_url?: string;
    attachment_filename?: string; // Keep for form compatibility
    attachment_size?: number; // Keep for form compatibility
    ip_address?: string;
    user_agent?: string;
    referrer?: string;
}

// ============================================================================
// API RESPONSE INTERFACES
// ============================================================================

export interface EventsResponse {
    events: Event[];
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
}

export interface EventCategoriesResponse {
    categories: EventCategory[];
    total: number;
}

export interface EventStatistics {
    total_events: number;
    active_events: number;
    featured_events: number;
    total_categories: number;
    active_categories: number;
    total_submissions: number;
    new_submissions: number;
}

export interface EventSearchResult extends Event {
    relevance_score: number;
}

export interface EventSearchResponse {
    results: EventSearchResult[];
    total: number;
    query: string;
    page: number;
    limit: number;
    has_more: boolean;
    filters?: EventFilters;
    sort_by?: string;
    sort_order?: string;
}

// ============================================================================
// FILTER AND QUERY INTERFACES
// ============================================================================

export interface EventFilters {
    category_slug?: string;
    is_featured?: boolean;
    is_active?: boolean;
    search?: string;
    start_date?: string;
    end_date?: string;
    organizer?: string;
    venue?: string;
    event_type?: string;
    industry?: string;
    audience?: string;
}

export interface EventQueryParams {
    page?: number;
    limit?: number;
    sort_by?: 'created_at' | 'updated_at' | 'start_date' | 'title' | 'display_order';
    sort_order?: 'asc' | 'desc';
    filters?: EventFilters;
}

// ============================================================================
// ADMIN INTERFACE TYPES
// ============================================================================

export interface EventAdminStats {
    total_events: number;
    active_events: number;
    draft_events: number;
    featured_events: number;
    upcoming_events: number;
    past_events: number;
    total_categories: number;
    total_submissions: number;
    new_submissions: number;
}

export interface EventBulkAction {
    action: 'activate' | 'deactivate' | 'delete' | 'feature' | 'unfeature' | 'publish' | 'unpublish';
    event_ids: string[];
}

export interface EventImageUploadResult {
    success: boolean;
    image?: EventImage;
    error?: string;
    file_path?: string;
    public_url?: string;
}

// ============================================================================
// COMPONENT PROP INTERFACES
// ============================================================================

export interface EventCardProps {
    event: Event;
    index?: number;
    onClick?: (eventId: string) => void;
    className?: string;
    style?: React.CSSProperties;
    showCategory?: boolean;
    showDate?: boolean;
    showDescription?: boolean;
}

export interface EventCarouselProps {
    events: Event[];
    onEventClick?: (eventId: string) => void;
    autoPlay?: boolean;
    showNavigation?: boolean;
    cardsToShow?: number;
    className?: string;
}

export interface EventFilterProps {
    categories: EventCategory[];
    selectedCategory?: string;
    onCategoryChange: (categorySlug: string | null) => void;
    showAllOption?: boolean;
    className?: string;
}

export interface EventGalleryProps {
    eventId?: string;
    images?: EventImage[];
    columns?: number;
    showCaptions?: boolean;
    className?: string;
}

export interface EventFormProps {
    eventId?: string;
    onSubmit?: (data: EventFormSubmissionInput) => void;
    className?: string;
    showEventSelection?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type EventStatus = 'draft' | 'published';
export type EventImageType = 'gallery' | 'featured' | 'hero' | 'logo';
export type FormSubmissionStatus = 'new' | 'read' | 'replied' | 'archived';
export type SortOrder = 'asc' | 'desc';
export type EventSortField = 'created_at' | 'updated_at' | 'start_date' | 'title' | 'display_order';

// ============================================================================
// LEGACY COMPATIBILITY (for existing components)
// ============================================================================

// Keep the old Event interface for backward compatibility
export interface LegacyEvent {
    id: string;
    title: string;
    category: string;
    dateRange: string;
    image: string;
    heroImage: string;
    description: string;
    organizer: string;
    organizedBy: string;
    venue: string;
    eventType: string;
    industry: string;
    audience: string;
    logoImage: string;
    logoText?: string;
    logoSubtext?: string;
}

// Function to convert new Event to legacy format
export const convertToLegacyEvent = (event: Event): LegacyEvent => ({
    id: event.id,
    title: event.title,
    category: event.category_name || event.category?.name || '',
    dateRange: event.date_range || '',
    image: event.featured_image_url || '',
    heroImage: event.hero_image_url || '',
    description: event.description || '',
    organizer: event.organizer || '',
    organizedBy: event.organized_by || '',
    venue: event.venue || '',
    eventType: event.event_type || '',
    industry: event.industry || '',
    audience: event.audience || '',
    logoImage: event.logo_image_url || '',
    logoText: event.logo_text,
    logoSubtext: event.logo_subtext,
});

// Function to convert legacy Event to new format
export const convertFromLegacyEvent = (legacyEvent: LegacyEvent): Partial<EventInput> => ({
    title: legacyEvent.title,
    slug: legacyEvent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: legacyEvent.description,
    organizer: legacyEvent.organizer,
    organized_by: legacyEvent.organizedBy,
    venue: legacyEvent.venue,
    event_type: legacyEvent.eventType,
    industry: legacyEvent.industry,
    audience: legacyEvent.audience,
    date_range: legacyEvent.dateRange,
    featured_image_url: legacyEvent.image,
    hero_image_url: legacyEvent.heroImage,
    logo_image_url: legacyEvent.logoImage,
    logo_text: legacyEvent.logoText,
    logo_subtext: legacyEvent.logoSubtext,
    is_active: true,
    is_featured: false,
    display_order: 0,
});

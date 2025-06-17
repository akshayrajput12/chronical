# Home Page Typography Documentation

## Overview
This document provides a comprehensive analysis of typography usage across all sections of the home page. The home page has custom typography implementations that differ from the global website typography hierarchy.

## Font Configuration

### Available Fonts
- **Rubik**: Primary heading font (variable: `--font-rubik`)
- **Markazi Text**: Decorative/accent font (variable: `--font-markazi-text`) 
- **Noto Kufi Arabic**: Body text font (variable: `--font-noto-kufi-arabic`)
- **Nunito**: Alternative body font (variable: `--font-nunito`)

### Font Classes in Tailwind
- `font-rubik` → Rubik font family
- `font-markazi` → Markazi Text font family  
- `font-noto-kufi-arabic` → Noto Kufi Arabic font family
- `font-nunito` → Nunito font family

## Section-by-Section Typography Analysis

### 1. Hero Section (`hero.tsx`)

**Location**: Top of home page with video background

#### Typography Elements:

**Main Heading (H1)**
- **Content**: Dynamic from database (default: "Turn Heads at Your Next Exhibition with Stands")
- **Font**: Rubik (`font-rubik`)
- **Weight**: Bold (`font-bold`)
- **Size**: Responsive - `text-3xl sm:text-4xl md:text-5xl`
- **Color**: White (`text-white`)
- **Additional**: `leading-tight tracking-tight whitespace-normal`
- **CSS Classes**: `font-rubik font-bold`

**Subheading (H2)**
- **Content**: Dynamic from database (default: "Elegant . Functional . Memorable")
- **Font**: Rubik (`font-rubik!`)
- **Weight**: Normal (`font-normal`)
- **Size**: Responsive - `text-2xl sm:text-3xl md:text-4xl`
- **Color**: White (`text-white`)

**Description (P)**
- **Content**: Dynamic from database (long description text)
- **Font**: Markazi Text (`font-markazi-text`)
- **Weight**: Medium (`font-medium`)
- **Size**: Responsive - `text-lg sm:text-2xl`
- **Color**: White (`text-white`)
- **Additional**: `pt-2`

### 2. Essential Support Section (`essential-support.tsx`)

**Location**: Second section after hero

#### Typography Elements:

**Main Heading (H2)**
- **Content**: Dynamic from database + span
- **Font**: Rubik (`font-rubik`)
- **Weight**: Bold (`font-bold`)
- **Size**: Responsive - `text-3xl md:text-4xl`
- **Color**: Default text color

**Heading Span**
- **Font**: Markazi (`font-markazi`)
- **Weight**: Normal (`font-normal`)

**Description (P)**
- **Font**: Markazi Text (`font-markazi-text!`)
- **Size**: `text-2xl`
- **Color**: Gray (`text-gray-600`)

**Category Titles (H4)**
- **Font**: Markazi Text (`font-markazi-text`)
- **Size**: `text-2xl`
- **Weight**: Semibold (`font-semibold`) with `font-light`
- **Additional**: Hover effects with transitions

**Service List Items**
- **Font**: Noto Kufi Arabic (`font-noto-kufi-arabic`)
- **Size**: `text-[14px] md:text-[14px] lg:text-[14px]`
- **Color**: Gray (`text-gray-700`)

**CTA Button**
- **Font**: Noto Kufi Arabic (`font-noto-kufi-arabic`)
- **Size**: `text-sm`
- **Style**: Uppercase
- **Color**: White on green background

### 3. Business Hub Section (`buisness.tsx`)

**Location**: Third section

#### Typography Elements:

**Main Heading (H2)**
- **Content**: Dynamic from database
- **Font**: Rubik (`font-rubik`)
- **Weight**: Bold (`font-bold`)
- **Size**: Responsive - `text-2xl sm:text-3xl md:text-4xl`
- **Color**: Dark (`text-[#222]`)
- **Additional**: `leading-tight`

**Heading Span**
- **Font**: Rubik (`font-rubik!`)
- **Additional**: Hover transform effect

**Subheading (P)**
- **Content**: Dynamic from database
- **Font**: Rubik (`font-rubik!`)
- **Weight**: Normal (`font-normal`)
- **Size**: Responsive - `text-xl sm:text-2xl md:text-4xl`
- **Color**: Dark (`text-[#222]`)

**Paragraph Content**
- **First Paragraph**:
  - **Font**: Markazi Text (`font-markazi-text!`)
  - **Size**: Responsive - `text-lg sm:text-xl md:text-[22px]`
  - **Line Height**: `leading-[28px]`
  - **Weight**: Custom `fontWeight: "0"`

- **Subsequent Paragraphs**:
  - **Font**: Noto Kufi Arabic (`font-noto-kufi-arabic`)
  - **Size**: Responsive - `text-xs sm:text-sm md:text-[13px] lg:text-[14px]`
  - **Line Height**: `leading-[24px]`

**Color Scheme**: Dark gray (`text-[#444]`) with hover effects to darker (`text-[#222]`)

### 4. Dynamic Cell Section (`dynamiccell.tsx`)

**Location**: Fourth section with background image and statistics

#### Typography Elements:

**Statistics Numbers**
- **Font**: Rubik (`font-rubik!`)
- **Size**: Responsive - `text-xl md:text-2xl lg:text-3xl xl:text-4xl`
- **Color**: Green (`text-[#a5cd39]`)
- **Weight**: Medium (`font-medium`)
- **Additional**: Animated counter effect

**Statistics Labels**
- **Font**: Markazi Text (`font-markazi-text`)
- **Size**: Responsive - `text-base sm:text-lg md:text-xl lg:text-2xl`
- **Color**: Dark (`text-[#333]`)
- **Weight**: Medium (`font-medium`)

### 5. Why Section (`why-section.tsx`)

**Location**: Fifth section with white background

#### Typography Elements:

**Main Heading (H2)**
- **Content**: Dynamic from database (default: "Why DWTC Free Zone")
- **Font**: Rubik (`font-rubik`)
- **Weight**: Bold (`font-bold`)
- **Size**: Responsive - `text-2xl md:text-3xl lg:text-4xl`
- **Color**: Dark (`text-[#222]`)

**Subtitle (P)**
- **Content**: Dynamic from database
- **Font**: Markazi Text (`font-markazi-text`)
- **Size**: Responsive - `text-lg md:text-xl lg:text-2xl`
- **Color**: Gray (`text-[#444]`)
- **Weight**: Custom `fontWeight: "0"`
- **Additional**: Hover effects and transitions

**Body Text (P)**
- **Font**: Noto Kufi Arabic (`font-noto-kufi-arabic`)
- **Size**: `text-sm`
- **Color**: Gray (`text-[#444]`)
- **Line Height**: `leading-relaxed`

**Image Overlay Heading (H3)**
- **Font**: Rubik (`font-rubik`)
- **Weight**: Bold (`font-bold`)
- **Size**: `text-3xl` (desktop), `text-xl md:text-2xl` (mobile)
- **Color**: White (`text-white`)

**Image Overlay Subheading (P)**
- **Font**: Markazi Text (`font-markazi-text`)
- **Weight**: Bold (`font-bold`)
- **Size**: `text-2xl` (desktop), `text-lg md:text-xl` (mobile)
- **Color**: White (`text-white`)

### 6. Setup Process Section (`setup-process.tsx`)

**Location**: Sixth section with dark background

#### Typography Elements:

**Main Title (H2)**
- **Content**: Dynamic from database (default: "Setting Up Your Business")
- **Font**: Rubik (`font-rubik`)
- **Weight**: Bold (`font-bold`)
- **Size**: Responsive - `text-3xl md:text-4xl`
- **Color**: White (`text-white`)

**Subtitle (P)**
- **Content**: Dynamic from database
- **Font**: Markazi Text (`font-markazi-text`)
- **Size**: `text-2xl`
- **Color**: Light gray (`text-gray-300`)

**Section Labels (P)**
- **Content**: "How To Apply", "Getting Started"
- **Font**: Markazi Text (`font-markazi-text`)
- **Weight**: Medium (`font-medium`)
- **Size**: `text-xl`
- **Color**: White (inherited)

**Step Titles (P)**
- **Font**: Noto Kufi Arabic (`font-noto-kufi-arabic`)
- **Size**: Responsive - `text-xs md:text-sm`
- **Color**: White (inherited)

### 7. New Company Section (`new-company.tsx`)

**Location**: Seventh section

#### Typography Elements:

**Main Heading (H2)**
- **Content**: Dynamic from database
- **Font**: Rubik (`font-rubik`)
- **Weight**: Bold (`font-bold`)
- **Size**: Responsive - `text-3xl md:text-4xl`

**Heading Span**
- **Font**: Markazi (`font-markazi`)
- **Weight**: Normal (`font-normal`)
- **Color**: Gray (`text-gray-700`)

**Description Paragraphs (P)**
- **Font**: Noto Kufi Arabic (`font-noto-kufi-arabic`)
- **Size**: `text-sm`
- **Color**: Gray (`text-gray-700`)
- **Line Height**: `leading-[24px]`

**Button Text**
- **Font**: Noto Kufi Arabic (`font-noto-kufi-arabic`)
- **Size**: `text-sm`
- **Line Height**: `leading-[24px]`
- **Weight**: Medium (`font-medium`)
- **Color**: White on green background

### 8. Booth Requirements Form (`booth-requirements-form.tsx`)

**Location**: Final section with dark background

#### Typography Elements:

**Main Heading (H2)**
- **Content**: "DESCRIBE YOUR TRADE SHOW BOOTH REQUIREMENTS"
- **Font**: Rubik (`font-rubik`)
- **Weight**: Bold (`font-bold`)
- **Size**: Responsive - `text-xl leading-[44px] md:text-3xl lg:text-4xl`
- **Color**: White (`text-white`)
- **Style**: Uppercase, tracking-wide, centered

**Form Placeholders**
- **Font**: Inherited (likely default)
- **Color**: Gray (`placeholder:text-gray-500`)

**File Upload Text**
- **Font**: Noto Kufi Arabic (`font-noto-kufi-arabic`)
- **Color**: Gray variants

**Button Text**
- **Font**: Noto Kufi Arabic (`font-noto-kufi-arabic`)
- **Style**: Uppercase, tracking-wider
- **Weight**: Semibold (`font-semibold`)

**Description Text (P)**
- **Font**: Markazi Text (`font-markazi-text`)
- **Size**: `text-2xl`
- **Color**: White with opacity (`text-white/90`)
- **Line Height**: `leading-relaxed`

**Map Section Heading (H3)**
- **Font**: Rubik (`font-rubik`)
- **Weight**: Bold (`font-bold`)
- **Size**: `text-xl`
- **Color**: White (`text-white`)

## Typography Patterns & Consistency

### Font Usage Patterns

1. **Rubik Font**:
   - Primary use: Main headings (H1, H2)
   - Weight: Mostly bold, some normal
   - Used for: Hero heading, section titles, statistics numbers

2. **Markazi Text Font**:
   - Primary use: Decorative text, subtitles, descriptions
   - Weight: Varies (medium, bold, custom "0")
   - Used for: Hero description, section subtitles, overlay text

3. **Noto Kufi Arabic Font**:
   - Primary use: Body text, form elements, buttons
   - Weight: Mostly normal (400)
   - Used for: Paragraphs, lists, form text, button text

### Responsive Typography

Most text elements use responsive sizing:
- **Small screens**: `text-sm`, `text-base`, `text-lg`
- **Medium screens**: `text-xl`, `text-2xl`, `text-3xl`
- **Large screens**: `text-4xl`, `text-5xl`

### Color Schemes

1. **Dark sections**: White text (`text-white`)
2. **Light sections**: Dark gray text (`text-[#222]`, `text-[#444]`)
3. **Accent color**: Green (`text-[#a5cd39]`) for highlights
4. **Gray variations**: Multiple gray shades for hierarchy

### Alignment with Global Guidelines

**UPDATED**: The global typography hierarchy now matches the home page styling:
- **Global Rule**: H1/H2 use Rubik 36px with bold weight (700) ✅
- **Home Page**: Uses Rubik bold weight for headings ✅
- **Global Rule**: H3-H6 use Markazi Text with text-2xl size ✅
- **Home Page**: Uses Markazi Text for subheadings ✅
- **Global Rule**: Body text uses Noto Kufi Arabic text-sm with leading-[24px] ✅
- **Home Page**: Uses Noto Kufi Arabic for body text ✅

**Typography Consistency Achieved**: All pages now follow the same font styling patterns as the home page.

## Recommendations

1. **Consistency**: ✅ **COMPLETED** - Global typography now matches home page styling
2. **Font Loading**: Ensure all custom fonts load properly
3. **Accessibility**: Verify contrast ratios for all text/background combinations
4. **Performance**: Optimize font loading for better page speed
5. **Responsive**: Test typography scaling across all device sizes
6. **Testing**: Verify the new global typography works correctly across all pages

## Technical Implementation

### CSS Classes Used
- Font families: `font-rubik`, `font-markazi-text`, `font-noto-kufi-arabic`
- Font weights: `font-bold`, `font-medium`, `font-normal`, `font-light`
- Responsive sizes: `text-xs` through `text-5xl` with breakpoint prefixes
- Custom styling: Inline styles for special cases (e.g., `fontWeight: "0"`)

### Special Implementations
- Custom font weight "0" for ultra-light appearance
- Hover effects with transitions on many text elements
- Animated typography in hero section
- Dynamic content loading from database
- Responsive typography with Tailwind breakpoints

### Font Loading Configuration

**Layout.tsx Font Setup:**
```typescript
const rubik = Rubik({
    variable: "--font-rubik",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

const markaziText = Markazi_Text({
    variable: "--font-markazi-text",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const notoKufiArabic = Noto_Kufi_Arabic({
    variable: "--font-noto-kufi-arabic",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
```

### Global Typography Rules (Excluded from Home Page) - UPDATED

The `typography.css` file contains global rules that apply to all pages EXCEPT the home page, now matching home page styling:

```css
/* Main Headlines - H1, H2 use Rubik with 36px size and bold weight (700) */
body:not(.home-page) h1,
body:not(.home-page) h2 {
    font-family: var(--font-rubik), "Rubik", sans-serif !important;
    font-size: 36px !important; /* Fixed 36px size as specified */
    font-weight: 700 !important; /* Bold weight as specified */
    line-height: 1.2 !important; /* Good line height for large headings */
}

/* Subheadings - H3, H4, H5, H6 use Markazi Text with text-2xl size */
body:not(.home-page) h3,
body:not(.home-page) h4,
body:not(.home-page) h5,
body:not(.home-page) h6 {
    font-family: var(--font-markazi-text), "Markazi Text", serif !important;
    font-size: 1.5rem !important; /* text-2xl equivalent (24px) */
    font-weight: 600 !important; /* Default weight, can be overridden */
    line-height: 1.3 !important; /* Good line height for subheadings */
}

/* Body Text - Paragraphs, spans, and general text use Noto Kufi Arabic */
/* text-sm size with leading-[24px] for multiple lines */
body:not(.home-page) p,
body:not(.home-page) span,
body:not(.home-page) div,
body:not(.home-page) a,
body:not(.home-page) li,
body:not(.home-page) td,
body:not(.home-page) th,
body:not(.home-page) label {
    font-family: var(--font-noto-kufi-arabic), "Noto Kufi Arabic", sans-serif !important;
    font-size: 0.875rem !important; /* text-sm equivalent (14px) */
    font-weight: 400 !important; /* Normal weight for body text */
    line-height: 24px !important; /* leading-[24px] as specified */
}

/* Form Elements - Input, textarea, button use Noto Kufi Arabic */
body:not(.home-page) input,
body:not(.home-page) textarea,
body:not(.home-page) button {
    font-family: var(--font-noto-kufi-arabic), "Noto Kufi Arabic", sans-serif !important;
    font-size: 0.875rem !important; /* text-sm equivalent (14px) */
    font-weight: 400 !important; /* Normal weight for form elements */
}
```

## Summary

**UPDATED**: The typography system is now unified across the entire website. The home page's custom typography system has been adopted as the global standard, ensuring consistency while maintaining visual impact and brand identity.

**Global Typography Standards (Applied to All Pages Except Home):**
1. **Headings**: Rubik font, 36px size, 700 weight (bold)
2. **Subheadings**: Markazi Text font, text-2xl size (24px), weight depends on context
3. **Body Text**: Noto Kufi Arabic font, text-sm size (14px), leading-[24px] for multiple lines

**Key Characteristics:**
- ✅ **Unified**: All pages now use the same typography patterns as the home page
- ✅ **Consistent**: Rubik for headings (bold weight) across all pages
- ✅ **Structured**: Markazi Text for decorative and subtitle elements
- ✅ **Readable**: Noto Kufi Arabic for body text and UI elements with proper line height
- ✅ **Responsive**: Maintains responsive sizing across all breakpoints
- ✅ **Branded**: Consistent visual identity throughout the website

**Implementation Status:**
- Home page: Retains custom styling (unchanged)
- All other pages: Now follow home page typography patterns
- Global CSS: Updated to match home page specifications
- Documentation: Updated to reflect new unified system

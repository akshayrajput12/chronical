# Font Hierarchy Implementation - All Pages Except Home

## Overview
This document outlines the implementation of consistent font styling across all website pages **EXCEPT the home page**. The home page retains its current custom font styling while all other pages follow a unified typography hierarchy.

## Font Hierarchy Applied (Non-Home Pages Only)

### Heading Fonts
- **H1 and H2 elements**: Rubik font with light weight (font-weight: 300)
- **H3, H4, H5, and H6 elements**: Markiza Text font with medium bold weight (font-weight: 600)

### Body Text Fonts
- **All body text, span elements, and paragraph (p) tags**: Noto Kufi Arabic font with normal weight (font-weight: 400)

## Implementation Details

### 1. Typography CSS Updates (`src/app/typography.css`)

The global typography file has been updated to:
- Target all pages EXCEPT the home page using CSS selectors
- Apply specific font weights as requested
- Use `!important` declarations to override component-level font classes
- Exclude home page routes (`/` and `/home`) from the global typography rules

**Key CSS Selectors:**
```css
/* Exclude home page from typography rules */
body:not(.home-page) h1,
body:not(.home-page) h2 {
    font-family: var(--font-rubik), "Rubik", sans-serif !important;
    font-weight: 300 !important; /* Light weight */
}

body:not(.home-page) h3,
body:not(.home-page) h4,
body:not(.home-page) h5,
body:not(.home-page) h6 {
    font-family: var(--font-markazi-text), "Markazi Text", serif !important;
    font-weight: 600 !important; /* Medium bold weight */
}

body:not(.home-page) p,
body:not(.home-page) span,
/* ... other body text elements ... */ {
    font-family: var(--font-noto-kufi-arabic), "Noto Kufi Arabic", sans-serif !important;
    font-weight: 400 !important; /* Normal weight */
}
```

### 2. Layout Client Updates (`src/app/layout.client.tsx`)

Added dynamic body class management to identify home page:
- Detects when user is on home page (`/` or `/home`)
- Adds `home-page` class to body element for home page
- Removes `home-page` class for all other pages
- Uses React useEffect for proper cleanup

**Key Implementation:**
```typescript
// Check if the current path is the home page
const isHomePage = pathname === '/' || pathname === '/home';

// Add/remove home-page class to body for typography targeting
useEffect(() => {
    const body = document.body;
    
    if (isHomePage) {
        body.classList.add('home-page');
    } else {
        body.classList.remove('home-page');
    }

    return () => {
        body.classList.remove('home-page');
    };
}, [isHomePage]);
```

## Font Configuration Verification

All required fonts are properly configured in `src/app/layout.tsx`:

### Rubik Font
- **Weights Available**: 300, 400, 500, 600, 700, 800, 900
- **Used For**: H1, H2 elements (weight: 300 - light)

### Markazi Text Font  
- **Weights Available**: 400, 500, 600, 700
- **Used For**: H3, H4, H5, H6 elements (weight: 600 - medium bold)

### Noto Kufi Arabic Font
- **Weights Available**: 100, 200, 300, 400, 500, 600, 700, 800, 900
- **Used For**: Body text, paragraphs, spans (weight: 400 - normal)

## Pages Affected

### Home Page (EXCLUDED)
- **Routes**: `/`, `/home`
- **Status**: Retains current custom font styling
- **Components**: All home page components keep their existing font classes

### All Other Pages (INCLUDED)
- About Us (`/about`)
- Contact Us (`/contact-us`)
- Blog (`/blog`)
- Portfolio (`/portfolio`)
- Conference (`/conference`)
- Custom Exhibition Stands (`/customexhibitionstands`)
- Double Decker Exhibition Stands (`/doubledeckerexhibitionstands`)
- Country Pavilion Solutions (`/countrypavilionexpoboothsolutions`)
- Cities (`/cities`)
- Kiosk (`/kiosk`)
- What's On (`/whats-on`)
- Admin pages (`/admin/*`)
- Auth pages (`/login`, `/signup`, etc.)

## Testing Recommendations

1. **Visual Testing**: Navigate to different pages and verify font hierarchy
2. **Home Page Verification**: Ensure home page styling remains unchanged
3. **Weight Testing**: Check that H1/H2 use light weight, H3-H6 use medium bold
4. **Responsive Testing**: Verify fonts work correctly across different screen sizes
5. **Browser Testing**: Test across different browsers for consistency

## Technical Notes

- Uses CSS specificity with `!important` to override component-level font classes
- Maintains responsive behavior and accessibility standards
- No impact on existing component functionality
- Fonts are loaded via Next.js font optimization for better performance
- Body class management ensures proper targeting without affecting other functionality

## Maintenance

- Font weights can be adjusted by modifying the CSS in `typography.css`
- Additional pages can be excluded by updating the body class logic in `layout.client.tsx`
- Font families remain configurable through the existing Next.js font configuration

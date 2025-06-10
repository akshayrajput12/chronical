# Animated Logo Loader Implementation Guide

## Overview

This implementation provides a comprehensive animated logo loader system for the Chronicle Exhibits website. The loader appears immediately when the website starts loading and provides smooth transitions throughout the user experience.

## Features

### 🎨 Visual Features
- **Animated Logo**: Uses the website's logo with multiple animation effects
- **Spinning Rings**: Multiple spinning rings around the logo (different speeds and directions)
- **Pulsing Effects**: Animated pulsing rings with varying opacity
- **Glow Effects**: Dynamic glow animation around the logo
- **Progress Bar**: Enhanced progress bar with shimmer effects
- **Floating Particles**: Subtle particle animations (in enhanced version)
- **Responsive Design**: Works perfectly on all screen sizes

### ⚡ Technical Features
- **Immediate Loading**: Shows from the very start of website loading
- **Dual-Layer System**: HTML loader + React loader for seamless experience
- **Global State Management**: Can be controlled from any component
- **Route Change Handling**: Automatically shows during navigation
- **Custom Messages**: Support for custom loading messages
- **Smooth Transitions**: Fade in/out effects with framer-motion

## File Structure

```
src/
├── components/
│   ├── ui/
│   │   └── logo-loader.tsx          # Main animated loader component
│   └── providers/
│       └── loading-provider.tsx     # Global loading state provider
├── hooks/
│   └── use-page-loading.ts          # Hooks for easy loader control
├── app/
│   ├── layout.tsx                   # Root layout with initial HTML loader
│   ├── globals.css                  # CSS animations and styles
│   └── loader-demo/
│       └── page.tsx                 # Demo page to test the loader
```

## Usage Examples

### 1. Automatic Loading State Management

```tsx
import { usePageLoading } from "@/hooks/use-page-loading";

const MyComponent = () => {
  const [loading, setLoading] = useState(true);
  
  // Automatically shows/hides loader based on loading state
  usePageLoading(loading, "Loading data...");

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, []);

  return <div>My Component Content</div>;
};
```

### 2. Manual Loader Control

```tsx
import { useGlobalLoader } from "@/hooks/use-page-loading";

const MyComponent = () => {
  const { showLoader, hideLoader, isLoading } = useGlobalLoader();

  const handleAction = async () => {
    showLoader("Processing...");
    try {
      await performAction();
    } finally {
      hideLoader();
    }
  };

  return (
    <button onClick={handleAction} disabled={isLoading}>
      Perform Action
    </button>
  );
};
```

### 3. Component-Level Loading

```tsx
// In any component that needs loading state
import { usePageLoading } from "@/hooks/use-page-loading";

const DataComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // This will show the global loader while this component loads
  usePageLoading(loading, "Fetching exhibition data...");

  useEffect(() => {
    fetchExhibitionData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null; // Global loader handles the display

  return <div>{/* Render data */}</div>;
};
```

## Customization

### Changing Animation Duration

Edit `src/components/ui/logo-loader.tsx`:

```tsx
// Modify transition durations
transition={{
  duration: 2, // Change this value
  repeat: Infinity,
  ease: "easeInOut"
}}
```

### Custom Loading Messages

```tsx
// Different messages for different contexts
usePageLoading(loading, "Loading exhibition stands...");
usePageLoading(loading, "Preparing your portfolio...");
usePageLoading(loading, "Fetching conference data...");
```

### Styling Customization

Edit `src/app/globals.css` to modify animations:

```css
/* Customize logo animations */
.logo-pulse {
  animation: logoPulse 3s ease-in-out infinite; /* Change duration */
}

/* Customize colors */
.spinner-ring {
  border-color: #your-color; /* Change spinner color */
}
```

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- Uses CSS animations for optimal performance
- Framer Motion provides hardware acceleration
- Images are optimized with Next.js Image component
- Minimal JavaScript execution during loading

## Testing

Visit `/loader-demo` to test different loader configurations:

- Default loader
- Custom messages
- Different durations
- Manual control

## Troubleshooting

### Loader Not Showing
1. Check if `LoadingProvider` is wrapped around your app
2. Verify the logo image path (`/logo.png`) exists
3. Check browser console for errors

### Loader Not Hiding
1. Ensure `hideLoader()` is called
2. Check if `setLoading(false)` is executed
3. Verify no JavaScript errors are preventing execution

### Performance Issues
1. Reduce animation duration
2. Disable particle effects if needed
3. Use `will-change: transform` CSS property for better performance

## Future Enhancements

- [ ] Progress percentage display
- [ ] Multiple logo variants
- [ ] Sound effects (optional)
- [ ] Preloader for critical resources
- [ ] A/B testing for different animations
- [ ] Analytics integration for loading times

## Support

For issues or questions about the loader implementation, check:
1. Browser developer console for errors
2. Network tab for failed resource loads
3. React DevTools for component state issues

# Minimal Loader Implementation Guide

## 🎯 Problem Solved

This minimal loader implementation solves the key issues you mentioned:

1. **No more blank screens** during data loading from database
2. **Small, non-intrusive loader** that doesn't block the entire website
3. **Minimalistic design** that appears in corners or inline
4. **Content remains visible** while data loads in background

## ✨ Key Features

### 🎨 Visual Design
- **Tiny, small, medium sizes** - choose what fits your needs
- **Corner positioning** - top-right, bottom-right, or center when needed
- **Inline loading** - for specific components
- **Logo-based** - uses your Chronicle Exhibits logo
- **Subtle animations** - simple spinning ring, no flashy effects

### 🚀 Technical Benefits
- **Non-blocking** - website content stays visible
- **Component-level** - each component can have its own loading state
- **Automatic management** - just pass loading state, it handles the rest
- **No blank screens** - content shows immediately, loader appears in corner
- **Fast transitions** - 300ms duration for quick feedback

## 📁 File Structure

```
src/
├── components/
│   ├── ui/
│   │   └── minimal-loader.tsx        # Small, corner loader component
│   └── providers/
│       └── minimal-loading-provider.tsx  # Global state management
├── hooks/
│   └── use-minimal-loading.ts        # Easy-to-use hooks
└── app/
    └── minimal-loader-demo/
        └── page.tsx                  # Demo page
```

## 🔧 Usage Examples

### 1. Component Loading (Recommended)

```tsx
import { useComponentLoading } from "@/hooks/use-minimal-loading";

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Shows tiny loader in top-right corner while loading
  useComponentLoading(loading, "Loading data...", {
    size: "tiny",
    position: "top-right",
    showMessage: false
  });

  useEffect(() => {
    fetchData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  // Content shows immediately - no blank screen!
  return (
    <div>
      <h1>My Component</h1>
      {data ? (
        <div>{/* Show data */}</div>
      ) : (
        <div>Loading content will appear here...</div>
      )}
    </div>
  );
};
```

### 2. Data Fetching with Auto-Loading

```tsx
import { useDataLoading } from "@/hooks/use-minimal-loading";

const DataComponent = () => {
  const { fetchWithLoading } = useDataLoading();
  const [data, setData] = useState(null);

  const loadData = async () => {
    const result = await fetchWithLoading(
      () => fetch('/api/data').then(res => res.json()),
      "Fetching data...",
      { size: "small", position: "top-right" }
    );
    setData(result);
  };

  return (
    <div>
      <button onClick={loadData}>Load Data</button>
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
};
```

### 3. Manual Control

```tsx
import { useMinimalLoader } from "@/hooks/use-minimal-loading";

const ActionComponent = () => {
  const { showLoader, hideLoader } = useMinimalLoader();

  const handleAction = async () => {
    showLoader("Processing...", { 
      size: "small", 
      position: "bottom-right",
      showMessage: true 
    });
    
    try {
      await performAction();
    } finally {
      hideLoader();
    }
  };

  return <button onClick={handleAction}>Perform Action</button>;
};
```

## 🎛️ Configuration Options

### Size Options
- `tiny` - 32x12px logo, 12x12px container
- `small` - 48x18px logo, 16x16px container  
- `medium` - 64x24px logo, 20x20px container

### Position Options
- `top-right` - Fixed position in top-right corner
- `bottom-right` - Fixed position in bottom-right corner
- `center` - Fixed position in center (for important loading)
- `inline` - Inline with content flow

### Message Options
- `showMessage: false` - Only show logo and spinner (default)
- `showMessage: true` - Show loading message below logo

## 🔄 Migration from Full-Screen Loader

### Before (Full-screen blocking):
```tsx
// Old way - blocks entire screen
if (loading) {
  return <div>Loading...</div>; // Blank screen!
}
return <div>Content</div>;
```

### After (Minimal, non-blocking):
```tsx
// New way - content visible, loader in corner
useComponentLoading(loading, "Loading...");

// Content always visible
return (
  <div>
    <h1>Content Title</h1>
    {data ? (
      <div>Loaded content</div>
    ) : (
      <div>Default content while loading</div>
    )}
  </div>
);
```

## 🎨 Customization

### Change Default Position
```tsx
// In your component
useComponentLoading(loading, "Loading...", {
  position: "bottom-right", // Change default position
  size: "tiny"              // Change default size
});
```

### Custom Styling
Edit `src/components/ui/minimal-loader.tsx`:
```tsx
// Change colors
border-t-[#your-color]

// Change background
bg-white/95 // Change opacity or color

// Change shadow
shadow-lg // Modify shadow
```

## 🧪 Testing

Visit `/minimal-loader-demo` to test:
- Different sizes and positions
- Data loading scenarios
- Manual control examples
- Performance comparison

## ✅ Best Practices

1. **Use `tiny` size** for background data loading
2. **Use `small` size** for user-initiated actions
3. **Use `medium` size** for important operations
4. **Position in corners** to avoid blocking content
5. **Don't show messages** for quick operations
6. **Always show default content** instead of blank screens

## 🚀 Performance Benefits

- **No layout shifts** - loader doesn't affect page layout
- **Faster perceived loading** - content visible immediately
- **Better UX** - users can still see and interact with page
- **Reduced bounce rate** - no blank screens to scare users away

## 🔧 Troubleshooting

### Loader not showing
- Check if `MinimalLoadingProvider` is in layout
- Verify loading state is `true`
- Check console for errors

### Loader not hiding
- Ensure `setLoading(false)` is called
- Check if `hideLoader()` is executed
- Verify no JavaScript errors

### Content still blank
- Make sure you're not returning `null` when loading
- Show default/skeleton content instead
- Use the minimal loader for loading indication

## 📊 Comparison

| Feature | Full-Screen Loader | Minimal Loader |
|---------|-------------------|----------------|
| Screen blocking | ❌ Yes | ✅ No |
| Content visibility | ❌ Hidden | ✅ Visible |
| User interaction | ❌ Blocked | ✅ Available |
| Blank screens | ❌ Yes | ✅ No |
| Performance | ❌ Slower perceived | ✅ Faster perceived |
| UX | ❌ Frustrating | ✅ Smooth |

The minimal loader provides a much better user experience by keeping your website content visible while showing subtle loading indicators in corners!

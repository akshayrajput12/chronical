# Migration Examples: From Full-Screen to Minimal Loading

## 🔄 How to Update Your Existing Components

Here are practical examples of how to migrate your existing components from full-screen blocking loaders to minimal, non-intrusive loaders.

## Example 1: Hero Section (Already Updated)

### ❌ Before (Blocking):
```tsx
const HeroSection = () => {
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState(defaultData);

  // This blocked the entire screen
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return <section>{/* Hero content */}</section>;
};
```

### ✅ After (Non-blocking):
```tsx
import { useComponentLoading } from "@/hooks/use-minimal-loading";

const HeroSection = () => {
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState(defaultData);

  // Shows tiny loader in corner, doesn't block screen
  useComponentLoading(loading, "Loading hero section...", {
    size: "tiny",
    position: "top-right",
    showMessage: false
  });

  // Content always visible - no blank screen!
  return (
    <section>
      {/* Hero content with default data */}
      <h1>{heroData.heading}</h1>
      <p>{heroData.description}</p>
    </section>
  );
};
```

## Example 2: Instagram Feed Component

### ❌ Before (Blocking):
```tsx
const InstagramFeed = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="animate-pulse">
          {/* Skeleton loading */}
        </div>
      </section>
    );
  }

  return (
    <section>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </section>
  );
};
```

### ✅ After (Non-blocking):
```tsx
import { useComponentLoading } from "@/hooks/use-minimal-loading";

const InstagramFeed = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  // Minimal loader in corner
  useComponentLoading(loading, "Loading Instagram feed...", {
    size: "small",
    position: "top-right"
  });

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2>Instagram Feed</h2>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {/* Show placeholder cards while loading */}
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-gray-200 aspect-square rounded">
                <div className="p-4 text-center text-gray-500">
                  {loading ? "Loading..." : "No posts yet"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
```

## Example 3: Portfolio Component

### ❌ Before (Blocking):
```tsx
const Portfolio = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  if (loading) {
    return <div>Loading portfolio...</div>; // Blank screen!
  }

  return (
    <div>
      {projects.map(project => <ProjectCard key={project.id} project={project} />)}
    </div>
  );
};
```

### ✅ After (Non-blocking):
```tsx
import { useDataLoading } from "@/hooks/use-minimal-loading";

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const { fetchWithLoading } = useDataLoading();

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchWithLoading(
        () => fetch('/api/portfolio').then(res => res.json()),
        "Loading portfolio...",
        { size: "small", position: "top-right" }
      );
      setProjects(data);
    };
    
    loadProjects();
  }, []);

  return (
    <div>
      <h1>Our Portfolio</h1>
      
      {projects.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* Show skeleton cards */}
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-gray-100 rounded-lg p-6">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Example 4: Form Submission

### ❌ Before (Blocking):
```tsx
const ContactForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    // Form becomes unusable during submission
    await submitForm(data);
    setSubmitting(false);
  };

  if (submitting) {
    return <div>Submitting...</div>; // Form disappears!
  }

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
};
```

### ✅ After (Non-blocking):
```tsx
import { useMinimalLoader } from "@/hooks/use-minimal-loading";

const ContactForm = () => {
  const { showLoader, hideLoader, isLoading } = useMinimalLoader();

  const handleSubmit = async (data) => {
    showLoader("Submitting form...", {
      size: "small",
      position: "bottom-right",
      showMessage: true
    });
    
    try {
      await submitForm(data);
      // Show success message
    } finally {
      hideLoader();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form always visible */}
      <input type="text" placeholder="Name" disabled={isLoading} />
      <input type="email" placeholder="Email" disabled={isLoading} />
      <textarea placeholder="Message" disabled={isLoading}></textarea>
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Send Message"}
      </button>
    </form>
  );
};
```

## 🔧 Quick Migration Checklist

For each component with loading states:

1. **Remove blocking returns**:
   ```tsx
   // Remove this:
   if (loading) return <div>Loading...</div>;
   ```

2. **Add minimal loading hook**:
   ```tsx
   // Add this:
   import { useComponentLoading } from "@/hooks/use-minimal-loading";
   useComponentLoading(loading, "Loading...", { size: "tiny" });
   ```

3. **Show default content**:
   ```tsx
   // Always return content:
   return (
     <div>
       {data ? <RealContent /> : <PlaceholderContent />}
     </div>
   );
   ```

4. **Test the result**:
   - No blank screens ✅
   - Content visible immediately ✅
   - Loader appears in corner ✅
   - Smooth user experience ✅

## 🎯 Key Benefits After Migration

- **No more blank screens** during data loading
- **Better user experience** - content always visible
- **Faster perceived performance** - immediate visual feedback
- **Professional appearance** - subtle, non-intrusive loading
- **Consistent branding** - uses your logo in loader

Your users will notice the difference immediately - no more frustrating blank screens while waiting for data to load!

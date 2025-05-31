# Event Components - Responsive Design

This directory contains fully responsive event components that follow the project's design patterns and user preferences.

## Components

### EventCard
A responsive event card component with hover effects and green accent styling.

**Features:**
- Responsive typography (text-base → text-lg → text-xl)
- Responsive spacing and padding
- Green accent bar that expands on hover
- Responsive image heights (h-40 → h-48 → h-56 → h-64)
- Hover animations and color transitions

### EventCarousel
A responsive carousel component that adapts to different screen sizes.

**Features:**
- Mobile: 1 card visible
- Tablet: 2 cards visible  
- Desktop: 3 cards visible
- Responsive navigation buttons
- Smooth sliding animations
- Infinite scroll behavior

### EventFilter
A responsive filter component for event categories.

**Features:**
- Responsive button sizing
- Flexible wrap layout
- Hover animations
- Active state styling

## Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: > 1024px (lg, xl)

## Usage

```tsx
import { EventCard, EventCarousel, EventFilter } from '@/components/events';

// Individual card
<EventCard 
  event={event} 
  index={0} 
  onClick={handleClick} 
/>

// Full carousel
<EventCarousel 
  events={events} 
  onEventClick={handleEventClick} 
/>

// Filter component
<EventFilter 
  filterOptions={filters}
  selectedFilter={selected}
  onFilterChange={setSelected}
/>
```

## Design Patterns

All components follow the project's established patterns:
- Consistent spacing using responsive classes
- Green accent color (#22c55e) for highlights
- Smooth transitions and hover effects
- Proper image optimization with Next.js Image
- Motion animations using Framer Motion

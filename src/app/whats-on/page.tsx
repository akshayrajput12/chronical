import React from 'react'
import { Metadata } from 'next'
import EventsHero from './components/events-hero'
import EventsGallery from './components/events-gallery'

export const metadata: Metadata = {
  title: "What's On | Chronicle Exhibits - Upcoming Exhibitions & Events",
  description: 'Discover upcoming exhibitions and events at Chronicle Exhibits. Stay updated with the latest trade shows, conferences, and industry events in Dubai.',
  keywords: 'upcoming events, exhibitions dubai, trade shows, conferences, chronicle exhibits events, dubai events',
  openGraph: {
    title: "What's On | Chronicle Exhibits",
    description: 'Discover upcoming exhibitions and events at Chronicle Exhibits. Stay updated with the latest trade shows and industry events.',
    type: 'website',
  },
}

function WhatsOnPage() {
  return (
    <div className="flex flex-col relative">
      <EventsHero />
      <EventsGallery />
    </div>
  )
}

export default WhatsOnPage

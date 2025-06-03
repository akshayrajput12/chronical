import React from 'react'
import { Metadata } from 'next'
import CountryPavilionHero from './components/country-pavilion-hero'
import CountryPavilionIntroSection from './components/country-pavilion-intro-section'
import ExceptionalDesignSection from './components/exceptional-design-section'
import ReasonsToSelectSection from './components/reasons-to-select-section'
import LookingForPavilionSection from './components/looking-for-pavilion-section'

export const metadata: Metadata = {
  title: "Country Pavilion Expo Booth Design UAE | Chronicle Exhibits",
  description: 'Chronicle Exhibition Organizing LLC masters the art of designing for country pavilion expo booth. Let your brand shine at international events by using our unique country pavilion exhibition stands.',
  openGraph: {
    title: "Country Pavilion Expo Booth Design UAE | Chronicle Exhibits",
    description: 'Chronicle Exhibition Organizing LLC masters the art of designing for country pavilion expo booth. Let your brand shine at international events by using our unique country pavilion exhibition stands.',
    type: 'website',
  },
}

function CountryPavilionExpoBoothSolutionsPage() {
  return (
    <div className="flex flex-col relative">
      <CountryPavilionHero />
      <CountryPavilionIntroSection />
      <ExceptionalDesignSection />
      <ReasonsToSelectSection />
      <LookingForPavilionSection />
    </div>
  )
}

export default CountryPavilionExpoBoothSolutionsPage

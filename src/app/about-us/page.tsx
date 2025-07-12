import React from 'react'
import { getAboutPageData } from '@/services/about-page.service'
import AboutHero from './components/about-hero'
import AboutUsMainServer from './components/about-us-main-server'
import AboutUsDescriptionServer from './components/about-us-description-server'
import DedicationSectionServer from './components/dedication-section-server'

// Enable ISR - revalidate every 2 hours (7200 seconds)
export const revalidate = 7200;

// Server component that fetches data at build/request time for better SEO
async function AboutPage() {
  // Fetch all about page data server-side for SEO optimization
  const aboutPageData = await getAboutPageData()

  return (
    <div className="flex flex-col relative">
      <AboutHero />
      <AboutUsMainServer mainSectionData={aboutPageData.mainSection} />
      <AboutUsDescriptionServer descriptionSectionData={aboutPageData.descriptionSection} />
      <DedicationSectionServer dedicationSectionData={aboutPageData.dedicationSection} />
    </div>
  )
}

export default AboutPage

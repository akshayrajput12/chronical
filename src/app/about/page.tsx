import React from 'react'
import AboutUsMain from './components/about-us-main'
import AboutUsDescription from './components/about-us-description'
import DedicationSection from './components/dedication-section'
import FontShowcase from './components/font-showcase'

function AboutPage() {
  return (
    <div className="flex flex-col relative">
      <AboutUsMain />
      <AboutUsDescription />
      <DedicationSection />
      <FontShowcase />
    </div>
  )
}

export default AboutPage

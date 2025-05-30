import React from 'react'
import AboutUsMain from './components/about-us-main'
import AboutUsDescription from './components/about-us-description'
import DedicationSection from './components/dedication-section'

function AboutPage() {
  return (
    <div className="flex flex-col relative">
      <AboutUsMain />
      <AboutUsDescription />
      <DedicationSection />
    </div>
  )
}

export default AboutPage

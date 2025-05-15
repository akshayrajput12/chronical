import React from 'react'
import HeroSection from './components/hero'
import BusinessHubSection from './components/Buisness'
import DynamicCell from './components/Dynamiccell'
import WhySection from './components/WhySection'
import KeyBenefits from './components/KeyBenefits'
import SetupProcess from './components/SetupProcess'
import NewCompany from './components/NewCompany'

function page() {
  return (
    <div className="flex flex-col relative">
      <HeroSection />
      <BusinessHubSection />
      <DynamicCell />
      <WhySection />
      <KeyBenefits />
      <SetupProcess />
      <NewCompany />
    </div>
  )
}

export default page
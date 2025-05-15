import React from 'react'
import HeroSection from './components/hero'
import BusinessHubSection from './components/buisness'
import DynamicCell from './components/dynamiccell'
import WhySection from './components/why-section'
import KeyBenefits from './components/key-benefits'
import SetupProcess from './components/setup-process'
import NewCompany from './components/new-company'
import EssentialSupport from './components/essential-support'

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
      <EssentialSupport />
    </div>
  )
}

export default page
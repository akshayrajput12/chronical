import React from 'react'
import HeroSection from './components/hero'
import BusinessHubSection from './components/buisness'
import DynamicCell from './components/dynamiccell'
import WhySection from './components/why-section'
import KeyBenefits from './components/key-benefits'
import SetupProcess from './components/setup-process'
import NewCompany from './components/new-company'
import InstagramFeed from './components/instagram-feed'
import ApplicationCta from './components/application-cta'
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
      <InstagramFeed />
      <ApplicationCta />
      
    </div>
  )
}

export default page
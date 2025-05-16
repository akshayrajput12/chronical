import React from 'react'
import AboutUsMain from './components/about-us-main'
import AboutUsDescription from './components/about-us-description'

function AboutPage() {
  return (
    <div className="flex flex-col relative">
      <AboutUsMain />
      <AboutUsDescription />
    </div>
  )
}

export default AboutPage

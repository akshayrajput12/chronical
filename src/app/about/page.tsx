import React from 'react'
import AboutUsMain from './components/AboutUsMain'
import AboutUsDescription from './components/AboutUsDescription'

function AboutPage() {
  return (
    <div className="flex flex-col relative">
      <AboutUsMain />
      <AboutUsDescription />
    </div>
  )
}

export default AboutPage

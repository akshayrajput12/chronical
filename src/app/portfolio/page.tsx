import React from 'react'
import { Metadata } from 'next'
import PortfolioGallery from './components/portfolio-gallery'
import BoothRequirements from './components/booth-requirements'

export const metadata: Metadata = {
  title: 'Portfolio | Chronicle Exhibits - Exhibition Stand Design Gallery',
  description: 'Explore our portfolio of stunning exhibition stands and trade show designs. See our latest projects and creative solutions for exhibitions in Dubai and worldwide.',
  keywords: 'exhibition stand portfolio, trade show designs, exhibition gallery, chronicle exhibits projects, dubai exhibition stands',
  openGraph: {
    title: 'Portfolio | Chronicle Exhibits',
    description: 'Explore our portfolio of stunning exhibition stands and trade show designs.',
    type: 'website',
  },
}

function PortfolioPage() {
  return (
    <div className="flex flex-col relative">
      <PortfolioGallery />
      <BoothRequirements />
    </div>
  )
}

export default PortfolioPage

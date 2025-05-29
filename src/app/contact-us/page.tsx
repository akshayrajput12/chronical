import React from 'react'
import { Metadata } from 'next'
import ContactHero from './components/contact-hero'
import ContactInfo from './components/contact-info'
import ContactForm from './components/contact-form'
import ContactMap from './components/contact-map'
import ContactParking from './components/contact-parking'

export const metadata: Metadata = {
  title: 'Contact Us | Chronicle Exhibits - Exhibition Stand Design Dubai',
  description: 'Get in touch with Chronicle Exhibits for expert exhibition stand design and construction services in Dubai. Contact our team for consultations and project discussions.',
  keywords: 'contact chronicle exhibits, exhibition stand design dubai, trade show services contact, exhibition company dubai contact',
  openGraph: {
    title: 'Contact Us | Chronicle Exhibits',
    description: 'Get in touch with Chronicle Exhibits for expert exhibition stand design and construction services in Dubai.',
    type: 'website',
  },
}

function ContactUsPage() {
  return (
    <div className="flex flex-col relative">
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactMap />
      <ContactParking />
    </div>
  )
}

export default ContactUsPage

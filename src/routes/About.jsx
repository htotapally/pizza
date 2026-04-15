import React from 'react'
import AboutUsLayout from '../components/about/AboutUsLayout.jsx'
import ContactPhotoStrip from '../components/contact/ContactPhotoStrip.jsx'

export default function About() {
  return (
    <div className="text-gray-800">
      <AboutUsLayout />
      <ContactPhotoStrip />
    </div>
  )
}

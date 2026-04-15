import React from 'react'
import ContactUsLayout from '../components/contact/ContactUsLayout.jsx'
import ContactPhotoStrip from '../components/contact/ContactPhotoStrip.jsx'

export default function Contact() {
  return (
    <div className="text-gray-800">
      <ContactUsLayout />
      <ContactPhotoStrip />
    </div>
  )
}

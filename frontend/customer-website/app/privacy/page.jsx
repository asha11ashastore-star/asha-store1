'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-beige-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-beige-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Information We Collect</h2>
            <p className="text-beige-700 leading-relaxed">
              We collect information you provide directly to us when you create an account, 
              place an order, or contact us for support. This includes your name, email address, 
              phone number, shipping address, and payment information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">How We Use Your Information</h2>
            <p className="text-beige-700 leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-beige-700 space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Send you order confirmations and shipping updates</li>
              <li>Respond to your customer service requests</li>
              <li>Improve our products and services</li>
              <li>Send you promotional communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Data Security</h2>
            <p className="text-beige-700 leading-relaxed">
              We implement appropriate security measures to protect your personal information 
              from unauthorized access, alteration, disclosure, or destruction. All payment 
              information is processed securely through Razorpay.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Cookies</h2>
            <p className="text-beige-700 leading-relaxed">
              We use cookies to enhance your browsing experience, remember your preferences, 
              and analyze site traffic. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Third-Party Services</h2>
            <p className="text-beige-700 leading-relaxed">
              We use third-party services like Razorpay for payment processing and Cloudinary 
              for image hosting. These services have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Your Rights</h2>
            <p className="text-beige-700 leading-relaxed">
              You have the right to access, update, or delete your personal information. 
              Contact us at orders@ashastore.com to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Contact Us</h2>
            <p className="text-beige-700 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-3 text-beige-700">
              <p>Email: orders@ashastore.com</p>
              <p>Phone: +91-9876543210</p>
            </div>
          </section>

          <section className="pt-6 border-t border-beige-200">
            <p className="text-sm text-beige-600">
              Last updated: November 25, 2025
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

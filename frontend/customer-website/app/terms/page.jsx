'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-beige-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-beige-900 mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Acceptance of Terms</h2>
            <p className="text-beige-700 leading-relaxed">
              By accessing and using Asha Store, you accept and agree to be bound by these Terms 
              of Service. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Products and Pricing</h2>
            <p className="text-beige-700 leading-relaxed mb-3">
              We strive to provide accurate product descriptions and pricing. However:
            </p>
            <ul className="list-disc list-inside text-beige-700 space-y-2 ml-4">
              <li>Product colors may vary slightly due to screen settings</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to limit quantities</li>
              <li>All prices are in Indian Rupees (₹)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Orders and Payment</h2>
            <p className="text-beige-700 leading-relaxed">
              Orders are subject to acceptance and availability. We accept payments through 
              Razorpay. Payment must be completed before order processing begins. Once an 
              order is placed and payment is confirmed, it cannot be cancelled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Shipping and Delivery</h2>
            <p className="text-beige-700 leading-relaxed">
              We ship across India. Delivery times may vary based on location. We are not 
              responsible for delays caused by courier services or unforeseen circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Returns and Refunds</h2>
            <p className="text-beige-700 leading-relaxed">
              Due to the handcrafted nature of our products, we have a limited return policy. 
              Please inspect your order upon receipt. Contact us within 48 hours if there are 
              any issues with your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Intellectual Property</h2>
            <p className="text-beige-700 leading-relaxed">
              All content on this website, including images, text, and designs, is the property 
              of Asha Store and is protected by copyright laws. Unauthorized use is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">User Conduct</h2>
            <p className="text-beige-700 leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-beige-700 space-y-2 ml-4">
              <li>Use the website for any illegal purpose</li>
              <li>Attempt to interfere with the website's functionality</li>
              <li>Impersonate others or provide false information</li>
              <li>Collect user data without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Limitation of Liability</h2>
            <p className="text-beige-700 leading-relaxed">
              Asha Store shall not be liable for any indirect, incidental, or consequential 
              damages arising from the use of our website or products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Changes to Terms</h2>
            <p className="text-beige-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the 
              website after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-beige-800 mb-4">Contact Information</h2>
            <p className="text-beige-700 leading-relaxed">
              For questions about these Terms of Service, contact us at:
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

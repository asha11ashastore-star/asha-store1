import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-beige-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif text-center mb-8" style={{ color: '#B83C3A' }}>Return & Exchange Policy</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Return Policy</h2>
            <div className="space-y-2 text-gray-700">
              <p>We want you to love your purchase! If you're not completely satisfied, we accept returns within 7 days of delivery.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Items must be unused, unworn, and in original condition</li>
                <li>All tags and packaging must be intact</li>
                <li>Original invoice must be included</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Exchange Policy</h2>
            <div className="space-y-2 text-gray-700">
              <p>Exchanges are available for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Size issues - one-time exchange for different size</li>
                <li>Defective or damaged products</li>
                <li>Wrong item delivered</li>
              </ul>
              <p className="mt-2">Exchange requests must be raised within 7 days of delivery.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Items Not Eligible for Return/Exchange</h2>
            <div className="space-y-2 text-gray-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Customized or made-to-order products</li>
                <li>Altered or tailored items</li>
                <li>Items purchased during sale (unless defective)</li>
                <li>Intimate wear and accessories</li>
                <li>Items without original tags and packaging</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">How to Return/Exchange</h2>
            <div className="space-y-2 text-gray-700">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Email us at asha11ashastore@gmail.com with your order number</li>
                <li>Our team will verify your request within 24 hours</li>
                <li>Once approved, we'll arrange a pickup from your address</li>
                <li>Quality check will be done upon receipt of the product</li>
                <li>Refund/Exchange will be processed within 7-10 business days</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Refund Process</h2>
            <div className="space-y-2 text-gray-700">
              <p>Refunds will be processed through the original payment method:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Credit/Debit Card: 7-10 business days</li>
                <li>Net Banking: 5-7 business days</li>
                <li>UPI: 2-3 business days</li>
                <li>Cash on Delivery: Bank transfer within 7-10 days</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Cancellation Policy</h2>
            <div className="space-y-2 text-gray-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Orders can be cancelled within 24 hours of placement</li>
                <li>Once shipped, cancellation is not possible</li>
                <li>For custom orders, cancellation is not allowed after production begins</li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Contact Us</h3>
            <p className="text-sm text-gray-600">
              For any queries regarding returns or exchanges:<br />
              Email: asha11ashastore@gmail.com<br />
              Phone: +91 98181 74388 (Mon-Sat, 10 AM - 6 PM)
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

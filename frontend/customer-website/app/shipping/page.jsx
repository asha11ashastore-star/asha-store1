import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-beige-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif text-center mb-8" style={{ color: '#B83C3A' }}>Shipping Policy</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Domestic Shipping</h2>
            <div className="space-y-2 text-gray-700">
              <p>We offer shipping across India through our trusted courier partners.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Standard Delivery: 5-7 business days</li>
                <li>Express Delivery: 2-3 business days</li>
                <li>Metro Cities: 1-2 business days for express shipping</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Shipping Charges</h2>
            <div className="space-y-2 text-gray-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Free shipping on orders above ₹2,999</li>
                <li>Standard shipping: ₹99 for orders below ₹2,999</li>
                <li>Express shipping: ₹199 (additional charges apply)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">International Shipping</h2>
            <div className="space-y-2 text-gray-700">
              <p>We currently ship to select international destinations:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>USA, UK, Canada, Australia: 7-10 business days</li>
                <li>UAE, Singapore: 5-7 business days</li>
                <li>Other countries: 10-15 business days</li>
              </ul>
              <p className="mt-2">International shipping charges are calculated at checkout based on destination and weight.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Order Processing</h2>
            <div className="space-y-2 text-gray-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Orders placed before 2 PM IST are processed the same day</li>
                <li>Orders placed after 2 PM IST are processed the next business day</li>
                <li>Custom and made-to-order items may take 7-10 additional days</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Tracking Your Order</h2>
            <div className="space-y-2 text-gray-700">
              <p>Once your order is shipped, you will receive:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Email confirmation with tracking number</li>
                <li>SMS updates on order status</li>
                <li>Real-time tracking link</li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Important Notes</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Delivery times may vary during festive seasons</li>
              <li>• Remote locations may require additional 2-3 days</li>
              <li>• Customs duties for international orders are borne by the customer</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

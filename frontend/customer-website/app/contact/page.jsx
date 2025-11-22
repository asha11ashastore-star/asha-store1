import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-beige-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif text-center mb-8" style={{ color: '#B83C3A' }}>Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Email</h3>
                <p className="text-gray-600">asha11ashastore@gmail.com</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Phone</h3>
                <p className="text-gray-600">+91 98181 74388</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Address</h3>
                <p className="text-gray-600">
                  1, Near Railway Fatak, Miyanwala<br />
                  Gulaighati Road, Dehradun<br />
                  Uttarakhand - 248005
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Business Hours</h3>
                <p className="text-gray-600">
                  Monday - Saturday: 10:00 AM - 8:00 PM<br />
                  Sunday: 11:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea rows="4" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-400"></textarea>
              </div>
              <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

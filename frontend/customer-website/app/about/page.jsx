'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import apiService from '../../services/api'

export default function About() {
  const [companyInfo, setCompanyInfo] = useState({
    artisans_supported: '500+',
    villages_reached: '50+', 
    happy_customers: '10,000+',
    years_of_excellence: '5+',
    features: [
      { title: '100% Handwoven', description: 'Every product is authentically handcrafted by skilled artisans' },
      { title: 'Premium Quality', description: 'Carefully curated collection with the finest materials' },
      { title: 'Ethical Sourcing', description: 'Direct partnerships ensuring fair wages for artisans' },
      { title: 'Cultural Heritage', description: 'Preserving traditional techniques and designs' }
    ]
  })

  useEffect(() => {
    fetchCompanyInfo()
  }, [])

  const fetchCompanyInfo = async () => {
    try {
      const data = await apiService.request('/api/v1/company/info')
      setCompanyInfo(data)
    } catch (error) {
      console.error('Error fetching company info:', error)
      // Keep default values if API fails
    }
  }
  return (
    <div className="min-h-screen bg-warm-white">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brown-800 to-brown-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-elegant mb-6 tracking-wide text-white">
              About Aशा
            </h1>
            <p className="text-xl md:text-2xl text-cream max-w-3xl mx-auto leading-relaxed">
              Grace Woven by Asha Dhaundiyal
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-elegant text-primary-900 mb-6 tracking-wide">Our Story</h2>
            <div className="space-y-6 text-primary-700 leading-relaxed">
              <p className="text-lg">
                <strong>Aशा</strong> was born from a deep passion for preserving India's rich textile heritage 
                and celebrating the artistry of handloom weaving. Founded by Asha Dhaundiyal, our journey 
                began with a simple belief: that every thread tells a story, and every weave carries the 
                soul of its creator.
              </p>
              <p>
                What started as a personal love for traditional Indian textiles has evolved into a platform 
                that bridges the gap between timeless craftsmanship and contemporary fashion. We work directly 
                with skilled artisans across India, ensuring that their ancient techniques are preserved and 
                their livelihoods are sustained.
              </p>
              <p>
                At Aशा, we don't just sell clothing – we curate experiences that connect you with the 
                cultural richness and artistic excellence of Indian handloom traditions.
              </p>
            </div>
          </div>
          <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
            <img
              src="/images/about-story.jpg?v=1"
              alt="Traditional Indian textiles and craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-cream p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-primary-900 mb-4">Our Mission</h3>
            <p className="text-primary-700 leading-relaxed">
              To preserve and promote India's handloom heritage by creating a sustainable ecosystem 
              that supports artisans, celebrates traditional craftsmanship, and brings authentic 
              handwoven textiles to fashion-conscious consumers worldwide.
            </p>
          </div>
          <div className="bg-cream p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-primary-900 mb-4">Our Vision</h3>
            <p className="text-primary-700 leading-relaxed">
              To be the leading platform for authentic Indian handloom products, where every purchase 
              contributes to preserving cultural heritage, empowering artisan communities, and 
              promoting sustainable fashion practices.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-elegant text-primary-900 mb-12 text-center tracking-wide">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-primary-900 mb-3">Authenticity</h4>
              <p className="text-primary-600">
                Every piece in our collection is genuinely handwoven by skilled artisans using 
                traditional techniques passed down through generations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-primary-900 mb-3">Community</h4>
              <p className="text-primary-600">
                We believe in empowering artisan communities by providing them with fair wages, 
                recognition, and a global platform to showcase their craft.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-primary-900 mb-3">Sustainability</h4>
              <p className="text-primary-600">
                Our commitment to eco-friendly practices includes using natural fibers, organic dyes, 
                and supporting sustainable production methods.
              </p>
            </div>
          </div>
        </div>

        {/* Meet the Founder */}
        <div className="bg-gradient-to-r from-cream to-beige-100 rounded-lg p-12 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-elegant text-primary-900 mb-6 tracking-wide">Meet Our Founder</h2>
              <h3 className="text-2xl font-semibold text-maroon mb-4">Asha Dhaundiyal</h3>
              <div className="space-y-4 text-primary-700 leading-relaxed">
                <p>
                  Asha Dhaundiyal's journey with handloom textiles began in her childhood, surrounded by 
                  the rich weaving traditions of her family. With a background in textile design and 
                  a passion for cultural preservation, she founded Aशा to create a bridge between 
                  traditional artisans and modern fashion enthusiasts.
                </p>
                <p>
                  "Every saree, every kurti, every stole in our collection carries the essence of 
                  our cultural heritage. When you wear Aशा, you're not just wearing clothing – 
                  you're wearing stories, traditions, and the dreams of our skilled artisans."
                </p>
              </div>
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
              <img
                src="/images/founder.jpg?v=1"
                alt="Asha Dhaundiyal - Founder of Aशा"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Our Impact */}
        <div className="mb-20">
          <h2 className="text-3xl font-elegant text-primary-900 mb-12 text-center tracking-wide">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-maroon mb-2">{companyInfo.artisans_supported}</div>
              <div className="text-primary-700 font-medium">Artisans Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-maroon mb-2">{companyInfo.villages_reached}</div>
              <div className="text-primary-700 font-medium">Villages Reached</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-maroon mb-2">{companyInfo.happy_customers}</div>
              <div className="text-primary-700 font-medium">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-maroon mb-2">{companyInfo.years_of_excellence}</div>
              <div className="text-primary-700 font-medium">Years of Excellence</div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-primary-900 text-white rounded-lg p-12 mb-20">
          <h2 className="text-3xl font-elegant mb-8 text-center tracking-wide">Why Choose Aशा?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyInfo.features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">✓</span>
                </div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-beige-200 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-elegant text-primary-900 mb-6 tracking-wide">
            Experience the Beauty of Handwoven Excellence
          </h2>
          <p className="text-xl text-primary-600 mb-8 max-w-3xl mx-auto">
            Discover our curated collection of authentic handloom sarees, kurtis, and traditional wear. 
            Each piece tells a story of heritage, craftsmanship, and timeless elegance.
          </p>
          <div className="space-x-4">
            <Link 
              href="/collections" 
              className="inline-block bg-maroon text-white px-8 py-3 rounded-lg font-medium hover:bg-dark-maroon transition-colors"
            >
              Shop Our Collection
            </Link>
            <Link 
              href="/contact" 
              className="inline-block bg-transparent border-2 border-maroon text-maroon px-8 py-3 rounded-lg font-medium hover:bg-maroon hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

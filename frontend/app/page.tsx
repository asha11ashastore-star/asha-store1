import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero-section'
import { FeaturedCategories } from '@/components/sections/featured-categories'
import { FeaturedProducts } from '@/components/sections/featured-products'
import { TrustedSellers } from '@/components/sections/trusted-sellers'
import { Testimonials } from '@/components/sections/testimonials'
import { Newsletter } from '@/components/sections/newsletter'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'ShopAll - Your One-Stop Multi-Vendor Marketplace',
  description: 'Discover amazing products from trusted sellers. Shop clothing, food, and department store items with secure payments and fast delivery.',
  keywords: ['ecommerce', 'marketplace', 'online shopping', 'multi-vendor', 'clothing', 'food', 'department store'],
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        <FeaturedCategories />
        <FeaturedProducts />
        <TrustedSellers />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}

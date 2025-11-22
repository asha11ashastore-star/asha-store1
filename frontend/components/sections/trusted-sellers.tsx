import Link from 'next/link'
import { Star, Users, ShieldCheck, Award } from 'lucide-react'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'

interface TrustedSeller {
  id: number
  name: string
  logo: string
  rating: number
  totalProducts: number
  totalSales: string
  verificationLevel: 'gold' | 'silver' | 'bronze'
  specialties: string[]
}

export function TrustedSellers() {
  const trustedSellers: TrustedSeller[] = [
    {
      id: 1,
      name: 'Royal Fashion House',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3RvcmUlMjBsb2dvfGVufDF8fHx8MTc2Mjc1OTI2NXww&ixlib=rb-4.1.0&q=80&w=200',
      rating: 4.9,
      totalProducts: 1250,
      totalSales: '50K+',
      verificationLevel: 'gold',
      specialties: ['Ethnic Wear', 'Wedding Collection', 'Designer Outfits']
    },
    {
      id: 2,
      name: 'Spice Garden Restaurant',
      logo: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwbG9nb3xlbnwxfHx8fDE3NjI3NTkyNjV8MA&ixlib=rb-4.1.0&q=80&w=200',
      rating: 4.8,
      totalProducts: 85,
      totalSales: '25K+',
      verificationLevel: 'gold',
      specialties: ['North Indian', 'South Indian', 'Chinese']
    },
    {
      id: 3,
      name: 'Golden Arts Jewelry',
      logo: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwc3RvcmUlMjBsb2dvfGVufDF8fHx8MTc2Mjc1OTI2NXww&ixlib=rb-4.1.0&q=80&w=200',
      rating: 4.7,
      totalProducts: 520,
      totalSales: '30K+',
      verificationLevel: 'silver',
      specialties: ['Gold Jewelry', 'Diamond Sets', 'Traditional Designs']
    },
    {
      id: 4,
      name: 'Fresh Mart Groceries',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBsb2dvfGVufDF8fHx8MTc2Mjc1OTI2NXww&ixlib=rb-4.1.0&q=80&w=200',
      rating: 4.6,
      totalProducts: 2100,
      totalSales: '100K+',
      verificationLevel: 'gold',
      specialties: ['Fresh Produce', 'Organic Items', 'Daily Essentials']
    },
    {
      id: 5,
      name: 'Tech Accessories Hub',
      logo: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc3RvcmUlMjBsb2dvfGVufDF8fHx8MTc2Mjc1OTI2NXww&ixlib=rb-4.1.0&q=80&w=200',
      rating: 4.5,
      totalProducts: 350,
      totalSales: '15K+',
      verificationLevel: 'silver',
      specialties: ['Phone Accessories', 'Gadgets', 'Electronics']
    },
    {
      id: 6,
      name: 'Natural Beauty Co.',
      logo: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzdG9yZSUyMGxvZ298ZW58MXx8fHwxNzYyNzU5MjY1fDA&ixlib=rb-4.1.0&q=80&w=200',
      rating: 4.8,
      totalProducts: 180,
      totalSales: '8K+',
      verificationLevel: 'silver',
      specialties: ['Organic Skincare', 'Natural Products', 'Beauty Essentials']
    }
  ]

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case 'gold':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Award, label: 'Gold Verified' }
      case 'silver':
        return { color: 'bg-gray-100 text-gray-800', icon: ShieldCheck, label: 'Silver Verified' }
      default:
        return { color: 'bg-bronze-100 text-bronze-800', icon: ShieldCheck, label: 'Bronze Verified' }
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Trusted Sellers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Shop with confidence from our verified sellers who maintain the highest standards of quality and service.
          </p>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {trustedSellers.map((seller) => {
            const badge = getVerificationBadge(seller.verificationLevel)
            const BadgeIcon = badge.icon
            
            return (
              <div
                key={seller.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 group"
              >
                {/* Seller Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <ImageWithFallback
                      src={seller.logo}
                      alt={seller.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {seller.name}
                      </h3>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">{seller.rating}</span>
                        <span className="text-sm text-gray-500">rating</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full flex items-center space-x-1 ${badge.color}`}>
                    <BadgeIcon className="w-3 h-3" />
                    <span className="text-xs font-medium">{badge.label}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">{seller.totalSales}</span>
                    </div>
                    <p className="text-xs text-gray-500">Sales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{seller.totalProducts}</p>
                    <p className="text-xs text-gray-500">Products</p>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Specializes in:</p>
                  <div className="flex flex-wrap gap-1">
                    {seller.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Store Button */}
                <Link href={`/seller/${seller.id}`}>
                  <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    View Store
                  </button>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Sellers</h3>
              <p className="text-sm text-gray-600">
                All sellers undergo strict verification process to ensure quality and authenticity.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
              <p className="text-sm text-gray-600">
                Our trusted sellers maintain high quality standards and excellent customer ratings.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Satisfaction</h3>
              <p className="text-sm text-gray-600">
                Millions of satisfied customers trust our verified sellers for their purchases.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/sellers">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              View All Sellers
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

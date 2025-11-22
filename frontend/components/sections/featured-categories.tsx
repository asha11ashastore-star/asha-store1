'use client'

import Link from 'next/link'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { Button } from '@/components/ui/button'
import { 
  Shirt, 
  UtensilsCrossed, 
  ShoppingCart, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react'

export function FeaturedCategories() {
  const categories = [
    {
      id: 'clothing',
      name: 'Fashion & Clothing',
      description: 'Handloom, stitched, unstitched, wedding wear & lehengas',
      image: 'https://images.unsplash.com/photo-1756483510809-122c56fbb035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhJTIwY2hvbGklMjBkZXNpZ25lcnxlbnwxfHx8fDE3NjI3NTkyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: Shirt,
      color: 'from-pink-500 to-purple-600',
      products: '25,000+',
      href: '/marketplace?category=clothing'
    },
    {
      id: 'food',
      name: 'Food & Dining',
      description: 'North Indian, South Indian, Chinese, Continental & more',
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjByZXN0YXVyYW50fGVufDF8fHx8MTc2Mjc1ODY4OHww&ixlib=rb-4.1.0&q=80&w=1080',
      icon: UtensilsCrossed,
      color: 'from-orange-500 to-red-600',
      products: '15,000+',
      href: '/marketplace?category=food'
    },
    {
      id: 'grocery',
      name: 'Grocery & Essentials',
      description: 'Fresh groceries, home care, personal care & kitchen items',
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjI3NTg2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: ShoppingCart,
      color: 'from-green-500 to-blue-600',
      products: '10,000+',
      href: '/marketplace?category=grocery'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing products across our carefully curated categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Link key={category.id} href={category.href}>
                <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Image Background */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60`}></div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <Icon className="h-8 w-8 mr-3" />
                        <span className="text-sm font-medium opacity-90">{category.products} Products</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm opacity-90 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    
                    <Button variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300">
                      Explore Now
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-gray-900">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    Popular
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Browse All Categories Button */}
        <div className="text-center mt-12">
          <Link href="/marketplace">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl">
              <TrendingUp className="h-5 w-5 mr-2" />
              Browse All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

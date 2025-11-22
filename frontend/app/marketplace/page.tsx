'use client'

import { useState } from 'react'
import { Shirt, UtensilsCrossed, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClothingSection } from '@/components/marketplace/ClothingSection'
import { EatOutSection } from '@/components/marketplace/EatOutSection'
import { DepartmentalStoreSection } from '@/components/marketplace/DepartmentalStoreSection'

type Category = 'clothing' | 'eatout' | 'departmental'

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('clothing')

  const categories = [
    { id: 'clothing' as Category, label: 'Clothing', icon: Shirt },
    { id: 'eatout' as Category, label: 'Eat Out', icon: UtensilsCrossed },
    { id: 'departmental' as Category, label: 'Departmental Store', icon: ShoppingCart },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">ShopAll</h1>
              <p className="text-slate-600 mt-2">Your Complete Shopping Destination</p>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-2 sm:gap-4 py-4">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = activeCategory === category.id
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    relative flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-2xl
                    transition-all duration-300 min-w-[140px]
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }
                  `}
                >
                  <Icon className="w-8 h-8" strokeWidth={2} />
                  <span className="text-sm whitespace-nowrap">{category.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-600 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeCategory === 'clothing' && <ClothingSection />}
        {activeCategory === 'eatout' && <EatOutSection />}
        {activeCategory === 'departmental' && <DepartmentalStoreSection />}
      </main>
    </div>
  )
}

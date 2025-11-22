import { useState } from 'react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Heart, ShoppingBag, Star, Sparkles, Scissors, Package, Gem, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ClothingSection() {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const categories = [
    { id: 'handloom', label: 'Handloom', icon: Waves },
    { id: 'stitched', label: 'Stitched', icon: Scissors },
    { id: 'unstitched', label: 'Unstitched', icon: Package },
    { id: 'wedding', label: 'Wedding', icon: Gem },
    { id: 'lehenga', label: 'Lehenga', icon: Sparkles },
  ];

  const products = [
    {
      id: 1,
      name: 'Bridal Lehenga Collection',
      price: 45999,
      originalPrice: 59999,
      image: 'https://images.unsplash.com/photo-1756483510809-122c56fbb035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhJTIwY2hvbGklMjBkZXNpZ25lcnxlbnwxfHx8fDE3NjI3NTkyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Lehenga',
      rating: 4.9,
      reviews: 127
    },
    {
      id: 2,
      name: 'Designer Wedding Saree',
      price: 35999,
      originalPrice: 45999,
      image: 'https://images.unsplash.com/photo-1750164874154-1bfa2d31af39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwYnJpZGFsJTIwb3V0Zml0fGVufDF8fHx8MTc2Mjc1OTI2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Wedding',
      rating: 4.8,
      reviews: 156
    },
    {
      id: 3,
      name: 'Handloom Silk Saree',
      price: 8999,
      originalPrice: 11999,
      image: 'https://images.unsplash.com/photo-1715881634011-2c3e0dea96c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbG9vbSUyMHNhcmVlJTIwZmFicmljfGVufDF8fHx8MTc2Mjc1OTI2NXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Handloom',
      rating: 4.7,
      reviews: 89
    },
    {
      id: 4,
      name: 'Stitched Salwar Suit',
      price: 3999,
      originalPrice: 5999,
      image: 'https://images.unsplash.com/photo-1715881634011-2c3e0dea96c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGl0Y2hlZCUyMHNhbHdhciUyMHN1aXR8ZW58MXx8fHwxNzYyNzU5MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Stitched',
      rating: 4.6,
      reviews: 94
    },
    {
      id: 5,
      name: 'Unstitched Dress Material',
      price: 2499,
      originalPrice: 3499,
      image: 'https://images.unsplash.com/photo-1587003113537-05c3a2924030?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bnN0aXRjaGVkJTIwZmFicmljJTIwZHJlc3MlMjBtYXRlcmlhbHxlbnwxfHx8fDE3NjI3NTkyNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Unstitched',
      rating: 4.5,
      reviews: 203
    },
    {
      id: 6,
      name: 'Premium Lehenga Choli',
      price: 28999,
      originalPrice: 35999,
      image: 'https://images.unsplash.com/photo-1756483510809-122c56fbb035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhJTIwY2hvbGklMjBkZXNpZ25lcnxlbnwxfHx8fDE3NjI3NTkyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Lehenga',
      rating: 4.9,
      reviews: 78
    },
    {
      id: 7,
      name: 'Banarasi Handloom Saree',
      price: 12999,
      originalPrice: 16999,
      image: 'https://images.unsplash.com/photo-1742287721821-ddf522b3f37b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2FyZWUlMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjI3NTkyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Handloom',
      rating: 4.7,
      reviews: 112
    },
    {
      id: 8,
      name: 'Wedding Lehenga Set',
      price: 52999,
      originalPrice: 65999,
      image: 'https://images.unsplash.com/photo-1750164874154-1bfa2d31af39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwYnJpZGFsJTIwb3V0Zml0fGVufDF8fHx8MTc2Mjc1OTI2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Wedding',
      rating: 4.9,
      reviews: 145
    },
    {
      id: 9,
      name: 'Stitched Anarkali Suit',
      price: 4999,
      originalPrice: 6999,
      image: 'https://images.unsplash.com/photo-1715881634011-2c3e0dea96c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGl0Y2hlZCUyMHNhbHdhciUyMHN1aXR8ZW58MXx8fHwxNzYyNzU5MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Stitched',
      rating: 4.6,
      reviews: 167
    },
    {
      id: 10,
      name: 'Unstitched Suit Material',
      price: 1999,
      originalPrice: 2999,
      image: 'https://images.unsplash.com/photo-1587003113537-05c3a2924030?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bnN0aXRjaGVkJTIwZmFicmljJTIwZHJlc3MlMjBtYXRlcmlhbHxlbnwxfHx8fDE3NjI3NTkyNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Unstitched',
      rating: 4.4,
      reviews: 198
    },
  ];

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="absolute inset-0 grid grid-cols-2">
          <div className="flex flex-col justify-center px-12 space-y-4">
            <Badge className="bg-blue-600 w-fit">New Collection 2025</Badge>
            <h2 className="text-slate-900">Women's Fashion</h2>
            <p className="text-slate-600">Discover our exquisite collection of handloom, stitched, unstitched, wedding wear and lehengas</p>
            <Button className="bg-blue-600 hover:bg-blue-700 w-fit mt-4">
              Explore Collection
            </Button>
          </div>
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1740664651822-3a02ec12c121?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwYmFubmVyfGVufDF8fHx8MTc2Mjc0NDY0NXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Fashion Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-5 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-white border-2 border-slate-200 hover:border-blue-600 hover:shadow-md transition-all"
            >
              <Icon className="w-12 h-12 mb-3 text-blue-600" strokeWidth={1.5} />
              <span className="text-slate-900">{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900">Featured Products</h3>
          <p className="text-slate-600">{products.length} items</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-rose-50 transition-colors z-10"
                >
                  <Heart 
                    className={`w-5 h-5 transition-colors ${
                      wishlist.includes(product.id) 
                        ? 'fill-rose-500 text-rose-500' 
                        : 'text-slate-600'
                    }`}
                  />
                </button>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-600">{product.category}</Badge>
                </div>

                {/* Quick Add Button - Shows on Hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button className="w-full bg-white text-slate-900 hover:bg-slate-100">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-slate-900 line-clamp-2">{product.name}</h4>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-slate-700">{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-900">₹{product.price.toLocaleString()}</span>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center pt-4">
        <Button variant="outline" size="lg" className="min-w-[200px]">
          View More Products
        </Button>
      </div>
    </div>
  );
}

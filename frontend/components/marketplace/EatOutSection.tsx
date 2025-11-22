import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Clock, Star, ShoppingCart, Leaf, Drumstick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function EatOutSection() {
  const menuItems = [
    {
      id: 1,
      name: 'Butter Chicken Combo',
      price: 299,
      rating: 4.7,
      prepTime: '25-30 min',
      image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBsYXR0ZXJ8ZW58MXx8fHwxNzYyNjc5OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'North Indian',
      isVeg: false
    },
    {
      id: 2,
      name: 'Paneer Tikka Masala',
      price: 249,
      rating: 4.5,
      prepTime: '20-25 min',
      image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBsYXR0ZXJ8ZW58MXx8fHwxNzYyNjc5OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'North Indian',
      isVeg: true
    },
    {
      id: 3,
      name: 'Biryani Special',
      price: 349,
      rating: 4.8,
      prepTime: '30-35 min',
      image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBsYXR0ZXJ8ZW58MXx8fHwxNzYyNjc5OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Biryani',
      isVeg: false
    },
    {
      id: 4,
      name: 'Veg Thali',
      price: 199,
      rating: 4.6,
      prepTime: '15-20 min',
      image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBsYXR0ZXJ8ZW58MXx8fHwxNzYyNjc5OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Thali',
      isVeg: true
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-slate-900 mb-2">Cloud Kitchen</h2>
        <p className="text-slate-600">Delicious meals delivered fresh to your doorstep</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative aspect-square overflow-hidden bg-slate-200">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant={item.isVeg ? 'default' : 'destructive'} className={item.isVeg ? 'bg-green-600' : ''}>
                    {item.isVeg ? (
                      <>
                        <Leaf className="w-3 h-3 mr-1" />
                        Veg
                      </>
                    ) : (
                      <>
                        <Drumstick className="w-3 h-3 mr-1" />
                        Non-Veg
                      </>
                    )}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs text-slate-700">
                  {item.category}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-slate-900 mb-2">{item.name}</CardTitle>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-slate-600">{item.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">{item.prepTime}</span>
                </div>
              </div>
              <p className="text-slate-900">₹{item.price}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Order Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

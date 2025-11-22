import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function DepartmentalStoreSection() {
  const products = [
    {
      id: 1,
      name: 'Fresh Vegetables Pack',
      price: 149,
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjI3NTg2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Groceries',
      inStock: true
    },
    {
      id: 2,
      name: 'Home Care Essentials',
      price: 399,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjI3NTg2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Home Care',
      inStock: true
    },
    {
      id: 3,
      name: 'Personal Care Kit',
      price: 599,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjI3NTg2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Personal Care',
      inStock: true
    },
    {
      id: 4,
      name: 'Snacks Combo Pack',
      price: 249,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjI3NTg2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Snacks',
      inStock: true
    },
    {
      id: 5,
      name: 'Dairy Products Bundle',
      price: 299,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjI3NTg2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Dairy',
      inStock: true
    },
    {
      id: 6,
      name: 'Kitchen Essentials',
      price: 449,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjI3NTg2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Kitchen',
      inStock: true
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-slate-900 mb-2">Departmental Store</h2>
        <p className="text-slate-600">Everything you need for your home and daily essentials</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative aspect-video overflow-hidden bg-slate-200">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs text-slate-700">
                  {product.category}
                </div>
                {product.inStock && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-green-600">In Stock</Badge>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-slate-900 mb-2">{product.name}</CardTitle>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-slate-600">{product.rating}</span>
              </div>
              <p className="text-slate-900">₹{product.price}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

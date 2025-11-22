// @ts-nocheck
import { Star, Quote } from 'lucide-react'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Fashion Enthusiast',
      company: 'Mumbai',
      content: 'ShopAll has completely transformed my shopping experience! The variety of products and quality of service is exceptional. I found my dream wedding lehenga here at an amazing price.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b86c7d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2Mjc1OTI2NXww&ixlib=rb-4.1.0&q=80&w=200'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      role: 'Small Business Owner',
      company: 'Delhi',
      content: 'As a seller on ShopAll, I\'ve been able to reach customers across India. The platform is user-friendly and their support team is always helpful. My sales have increased by 300%!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI3NTkyNjV8MA&ixlib=rb-4.1.0&q=80&w=200'
    },
    {
      id: 3,
      name: 'Anita Patel',
      role: 'Home Chef',
      company: 'Bangalore',
      content: 'The food delivery section on ShopAll is fantastic! Fresh ingredients, quick delivery, and great prices. It has made cooking so much easier for my family.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwaW5kaWFufGVufDF8fHx8MTc2Mjc1OTI2NXww&ixlib=rb-4.1.0&q=80&w=200'
    },
    {
      id: 4,
      name: 'Vikram Singh',
      role: 'Tech Professional',
      company: 'Pune',
      content: 'ShopAll\'s electronics section has everything I need. From the latest gadgets to accessories, all at competitive prices. The customer service is top-notch!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMGluZGlhbnxlbnwxfHx8fDE3NjI3NTkyNjV8MA&ixlib=rb-4.1.0&q=80&w=200'
    },
    {
      id: 5,
      name: 'Meera Joshi',
      role: 'Working Mother',
      company: 'Chennai',
      content: 'ShopAll has been a lifesaver for a busy mom like me. From groceries to kids\' clothes, everything is available with quick delivery. Highly recommended!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwaW5kaWFufGVufDF8fHx8MTc2Mjc1OTI2NXww&ixlib=rb-4.1.0&q=80&w=200'
    },
    {
      id: 6,
      name: 'Amit Gupta',
      role: 'Student',
      company: 'Kolkata',
      content: 'Being a student, budget is always a concern. ShopAll\'s deals and discounts have helped me save so much money while getting quality products. Love this platform!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMHlvdW5nfGVufDF8fHx8MTc2Mjc1OTI2NXww&ixlib=rb-4.1.0&q=80&w=200'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join millions of satisfied customers who trust ShopAll for their shopping needs
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-4">
                <Quote className="h-8 w-8 text-blue-600 opacity-70" />
                <div className="flex space-x-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              {/* Testimonial Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center">
                <ImageWithFallback
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">10M+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">50K+</h3>
              <p className="text-gray-600">Trusted Sellers</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">1M+</h3>
              <p className="text-gray-600">Products</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-orange-600 mb-2">4.8★</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Join Our Happy Customers?
          </h3>
          <p className="text-gray-600 mb-6">
            Start your shopping journey with ShopAll today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Start Shopping
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors">
              Become a Seller
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

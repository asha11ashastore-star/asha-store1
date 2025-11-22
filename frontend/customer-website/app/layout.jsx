import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '../components/CartProvider'
import { AuthProvider } from '../contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Aशा - Grace Woven by Asha Dhaundiyal',
  description: 'Discover timeless beauty with our curated collection of handwoven sarees and traditional Indian wear.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

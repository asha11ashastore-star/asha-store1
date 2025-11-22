import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@/components/analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ShopAll - Multi-Vendor eCommerce Platform',
    template: '%s | ShopAll'
  },
  description: 'Discover amazing products from trusted sellers. Shop clothing, food, and department store items all in one place.',
  keywords: ['ecommerce', 'shopping', 'marketplace', 'online store', 'multi-vendor'],
  authors: [{ name: 'ShopAll Team' }],
  creator: 'ShopAll',
  publisher: 'ShopAll',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'ShopAll',
    title: 'ShopAll - Multi-Vendor eCommerce Platform',
    description: 'Discover amazing products from trusted sellers. Shop clothing, food, and department store items all in one place.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShopAll - Multi-Vendor eCommerce Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopAll - Multi-Vendor eCommerce Platform',
    description: 'Discover amazing products from trusted sellers. Shop clothing, food, and department store items all in one place.',
    images: ['/og-image.png'],
    creator: '@shopall',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

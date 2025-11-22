'use client'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useState } from 'react'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section with Full Background Image */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url('/images/hero-saree.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Rich overlay to make text readable */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 tracking-wider leading-tight">
              <span className="text-white">Timeless </span>
              <span className="text-beige-200">Handloom</span>
              <span className="text-white"> Heritage</span>
            </h1>
            <p className="text-lg md:text-xl mb-12 font-light text-beige-100">
              Exquisite collection of handwoven sarees and traditional Indian wear
            </p>
            <Link 
              href="/collections"
              className="inline-block text-white px-8 py-3 text-base font-medium uppercase tracking-widest bg-beige-700 hover:bg-beige-800 transition-colors"
            >
              Shop Collection
            </Link>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16 bg-beige-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-elegant text-center text-beige-800 mb-12">
              Featured Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Traditional Sarees */}
              <Link href="/collections?category=saree" className="group cursor-pointer block">
                <div className="bg-gradient-to-br from-beige-100 to-beige-200 h-64 rounded-lg mb-4 flex items-center justify-center group-hover:shadow-xl transition-shadow">
                  <div className="text-center">
                    <h3 className="text-2xl font-elegant text-beige-800 mb-2">Traditional Sarees</h3>
                    <p className="text-beige-700">Handwoven Heritage</p>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-beige-800 mb-2">TRADITIONAL SAREES</h4>
                  <p className="text-beige-600">SHOP NOW</p>
                </div>
              </Link>

              {/* Designer Lehengas */}
              <Link href="/collections?category=lehenga" className="group cursor-pointer block">
                <div className="bg-gradient-to-br from-beige-200 to-beige-300 h-64 rounded-lg mb-4 flex items-center justify-center group-hover:shadow-xl transition-shadow">
                  <div className="text-center">
                    <h3 className="text-2xl font-elegant text-beige-800 mb-2">Designer Lehengas</h3>
                    <p className="text-beige-700">Elegant Occasions</p>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-beige-800 mb-2">DESIGNER LEHENGAS</h4>
                  <p className="text-beige-600">SHOP NOW</p>
                </div>
              </Link>

              {/* Elegant Kurtis */}
              <Link href="/collections?category=kurti" className="group cursor-pointer block">
                <div className="bg-gradient-to-br from-beige-300 to-beige-400 h-64 rounded-lg mb-4 flex items-center justify-center group-hover:shadow-xl transition-shadow">
                  <div className="text-center">
                    <h3 className="text-2xl font-elegant text-beige-900 mb-2">Elegant Kurtis</h3>
                    <p className="text-beige-800">Everyday Elegance</p>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-beige-800 mb-2">ELEGANT KURTIS</h4>
                  <p className="text-beige-600">SHOP NOW</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-beige-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-elegant text-beige-900 mb-6">
                  Grace Woven with Heritage
                </h2>
                <p className="text-lg text-beige-800 mb-6 leading-relaxed">
                  At Aशा, every thread tells a story. Founded by Asha Dhaundiyal, our brand 
                  celebrates the rich heritage of Indian textiles while embracing contemporary elegance.
                </p>
                <p className="text-beige-700 mb-8 leading-relaxed">
                  Each piece in our collection is carefully curated to bring you the finest 
                  handwoven sarees, elegant lehengas, and beautiful kurtis that reflect 
                  timeless Indian craftsmanship.
                </p>
                <Link href="/about">
                  <button className="border-2 border-beige-700 text-beige-700 px-6 py-2 rounded-lg font-medium hover:bg-beige-700 hover:text-white transition-colors">
                    Learn More
                  </button>
                </Link>
              </div>
              <div className="bg-gradient-to-br from-beige-200 to-beige-300 h-96 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-3xl font-elegant text-beige-900 mb-2">Asha Dhaundiyal</h3>
                  <p className="text-beige-800">Founder & Designer</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

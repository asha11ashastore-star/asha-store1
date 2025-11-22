'use client'

import { useState } from 'react'
import { cn } from '@/utils/cn'

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  fallback?: string
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className, 
  fallback = '/placeholder-image.jpg' 
}: ImageWithFallbackProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImageSrc(fallback)
    }
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn(className)}
      onError={handleError}
      loading="lazy"
    />
  )
}

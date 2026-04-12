'use client'

/**
 * Optimized Image Component
 * Client-side wrapper for Next.js Image with error handling
 */

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { DEFAULT_FALLBACK_IMAGE } from '@/lib/constants/images'

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string
}

export function OptimizedImage({ 
  src, 
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  ...props 
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      {...props}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
}

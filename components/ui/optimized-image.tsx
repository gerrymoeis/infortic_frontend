'use client'

/**
 * Optimized Image Component
 * Client-side wrapper with conditional Next.js Image optimization
 * 
 * IMPORTANT: R2 URLs bypass Next.js Image optimization due to Cloudflare Workers limitation
 * Next.js Image optimization in Cloudflare Workers cannot fetch from external domains
 */

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { DEFAULT_FALLBACK_IMAGE } from '@/lib/constants/images'

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string
}

/**
 * Check if URL is from R2 CDN
 * R2 images are already optimized (WebP Q70) and should bypass Next.js optimization
 */
function isR2Url(url: string | undefined): boolean {
  if (!url || typeof url !== 'string') return false
  return url.includes('infortic-images.gerrymoeis.workers.dev')
}

export function OptimizedImage({ 
  src, 
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  fill,
  className,
  alt,
  ...props 
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  // Use native img tag for R2 URLs to bypass Next.js optimization
  if (isR2Url(imgSrc as string)) {
    return (
      <img
        src={hasError ? fallbackSrc : (imgSrc as string)}
        alt={alt}
        className={className}
        style={fill ? { 
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0
        } : undefined}
        onError={() => {
          setHasError(true)
          setImgSrc(fallbackSrc)
        }}
      />
    )
  }

  // Use Next.js Image for Instagram URLs (legacy)
  return (
    <Image
      {...props}
      src={imgSrc}
      fill={fill}
      className={className}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
}

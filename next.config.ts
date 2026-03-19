import type { NextConfig } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseRemotePattern = supabaseUrl
  ? (() => {
      const { hostname, port, protocol } = new URL(supabaseUrl)

      return {
        protocol: protocol.replace(':', '') as 'https' | 'http',
        hostname,
        port,
        pathname: '/storage/v1/object/public/**',
      }
    })()
  : null

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseRemotePattern ? [supabaseRemotePattern] : [],
  },
}

export default nextConfig

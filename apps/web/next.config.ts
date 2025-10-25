import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // Evita que el bundler intente empaquetar pdfkit/fontkit
    serverComponentsExternalPackages: ['pdfkit', 'fontkit'],
  },
}

export default nextConfig

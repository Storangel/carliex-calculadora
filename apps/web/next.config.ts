import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Evita que Next intente empaquetar estos CJS (pdfkit/fontkit)
  serverExternalPackages: ['pdfkit', 'fontkit'],
}

export default nextConfig

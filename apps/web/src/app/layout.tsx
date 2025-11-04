import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Carliex Europe - Calculadora de Subastas',
  description: 'Herramienta de estimación de costes para importadores y concesionarios.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-black text-white min-h-screen">
        <Header />
        <main className="container-app py-6">{children}</main>
      </body>
    </html>
  )
}

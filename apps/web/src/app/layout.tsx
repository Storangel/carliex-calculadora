import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Carliex Calculadora',
  description: 'Calculadora de subastas y costes de importación | Carliex Europe',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ backgroundColor: 'var(--carbon)', color: 'var(--white)' }}>
        <Header />
        <main className="container-app py-8">{children}</main>
      </body>
    </html>
  )
}

import Link from 'next/link'

export default function Home() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl md:text-4xl font-semibold text-gold">
        Calculadora de Subastas
      </h1>
      <p className="text-white/80">
        Herramienta de estimación de costes para importadores y concesionarios.
      </p>

      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.25)' }}
      >
        <p className="text-sm text-white/80">
          Calcula base imponible, arancel, DUA, logística e IVA para vehículos procedentes de Dubái.
        </p>
        <div className="pt-3">
          <Link
            href="/calculadora"
            className="inline-block bg-gold text-black px-4 py-2 rounded shadow-gold hover:opacity-90"
          >
            Ir a la calculadora
          </Link>
        </div>
      </div>
    </section>
  )
}

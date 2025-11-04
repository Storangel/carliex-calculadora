export default function Home() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl text-gold font-semibold">Calculadora de Subastas</h1>
      <p>Herramienta de estimación de costes para importadores y concesionarios.</p>
      <a
        href="/calculadora"
        className="inline-block px-4 py-2 rounded border border-gold-30 text-gold hover:opacity-90"
      >
        Ir a la calculadora
      </a>
    </div>
  )
}

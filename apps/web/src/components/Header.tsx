export default function Header() {
  return (
    <header
      style={{
        backgroundColor: 'rgba(212,175,55,0.08)',
        borderBottom: '1px solid rgba(212,175,55,0.25)',
      }}
      className="w-full"
    >
      <div className="container-app flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          {/* Si subes tu logo a /public/logo-carliex.png, descomenta la imagen */}
          {/* <img src="/logo-carliex.png" alt="Carliex Europe" className="h-7 w-auto" /> */}
          <span className="text-gold text-lg font-semibold tracking-wide">Carliex Europe</span>
        </div>
        <nav className="flex items-center gap-4">
          <a href="/" className="hover:opacity-80">Inicio</a>
          <a href="/calculadora" className="text-gold hover:opacity-80">Calculadora</a>
        </nav>
      </div>
    </header>
  )
}

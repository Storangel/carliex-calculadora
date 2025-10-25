'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function CalculadoraPage() {
  const [form, setForm] = useState({ cif: '', freight: '', insurance: '', hsCode: '8703', originCountry: 'AE' })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const onCalc = async () => {
    setLoading(true)
    setResult(null)
    const res = await fetch('/api/calc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cif: Number(form.cif),
        freight: Number(form.freight || 0),
        insurance: Number(form.insurance || 0),
        hsCode: form.hsCode,
        originCountry: form.originCountry,
      }),
    })
    const json = await res.json()
    setResult(json.result)
    setLoading(false)
  }

  const Input = (props: any) => (
    <input
      {...props}
      className="bg-black/60 rounded p-2 border border-gold/30 focus:border-gold/60 outline-none"
    />
  )

  return (
    <div className="min-h-screen bg-carbon text-white">
      <div className="container-app py-6">
        <h1 className="text-2xl font-semibold text-gold">Calculadora de Subastas</h1>
        <Card className="mt-4 bg-black/40 border border-gold/20">
          <CardContent className="space-y-3 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="CIF (€)" value={form.cif} onChange={(e:any)=>setForm({...form, cif:e.target.value})} />
              <Input placeholder="Flete (€)" value={form.freight} onChange={(e:any)=>setForm({...form, freight:e.target.value})} />
              <Input placeholder="Seguro (€)" value={form.insurance} onChange={(e:any)=>setForm({...form, insurance:e.target.value})} />
              <Input placeholder="HS Code" value={form.hsCode} onChange={(e:any)=>setForm({...form, hsCode:e.target.value})} />
            </div>
            <Button className="bg-gold text-black hover:opacity-90 shadow-gold" onClick={onCalc} disabled={loading}>
              {loading ? 'Calculando…' : 'Calcular'}
            </Button>
            {result && (
              <div className="mt-4 space-y-1">
                <div>Base: € {result.baseImport.toFixed(2)}</div>
                <div>Arancel: € {result.arancel.toFixed(2)}</div>
                <div>DUA: € {result.dua.toFixed(2)}</div>
                <div>Logística: € {result.logistics.toFixed(2)}</div>
                <div className="text-gold font-semibold">TOTAL: € {result.total.toFixed(2)}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

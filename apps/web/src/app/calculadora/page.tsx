'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { CalcBreakdown } from '@/lib/calc-engine'
import * as React from 'react'

type FormState = {
  cif: string
  freight: string
  insurance: string
  hsCode: string
  originCountry: string
}

type ApiCalcResponse = {
  ok: boolean
  result: CalcBreakdown
}

export default function CalculadoraPage() {
  const [form, setForm] = useState<FormState>({
    cif: '',
    freight: '',
    insurance: '',
    hsCode: '8703',
    originCountry: 'AE',
  })
  const [result, setResult] = useState<CalcBreakdown | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const onCalc = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cif: Number(form.cif || 0),
          freight: Number(form.freight || 0),
          insurance: Number(form.insurance || 0),
          hsCode: form.hsCode,
          originCountry: form.originCountry,
        }),
      })
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`)
      const json: ApiCalcResponse = await res.json()
      setResult(json.result)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
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
              <Input placeholder="CIF (€)" value={form.cif} onChange={onChange('cif')} />
              <Input placeholder="Flete (€)" value={form.freight} onChange={onChange('freight')} />
              <Input placeholder="Seguro (€)" value={form.insurance} onChange={onChange('insurance')} />
              <Input placeholder="HS Code" value={form.hsCode} onChange={onChange('hsCode')} />
            </div>

            <Button className="bg-gold text-black hover:opacity-90 shadow-gold" onClick={onCalc} disabled={loading}>
              {loading ? 'Calculando…' : 'Calcular'}
            </Button>

            {error && <div className="text-red-400">Error: {error}</div>}

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

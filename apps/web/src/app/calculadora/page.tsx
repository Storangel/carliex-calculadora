'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Result = {
  baseImport: number
  arancel: number
  dua: number
  logistics: number
  total: number
}

export default function CalculadoraPage() {
  const [form, setForm] = useState({
    cif: '',
    freight: '',
    insurance: '',
    hsCode: '8703',
    originCountry: 'AE', // Dubái/EAU por defecto
  })
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((s) => ({ ...s, [field]: e.target.value }))
    }

  // Cálculo local (mismos parámetros del PDF)
  const onCalc = () => {
    setError(null)
    const cif = Number(form.cif || 0)
    const freight = Number(form.freight || 0)
    const insurance = Number(form.insurance || 0)

    // MVP: reglas fijas
    const baseImport = cif // base sobre CIF
    const arancel = baseImport * 0.10 // 10%
    const dua = 60 // €
    const logistics = 300 // €
    // IVA 21% sobre (base + arancel + DUA + logística)
    const iva = (baseImport + arancel + dua + logistics) * 0.21
    const total = baseImport + arancel + dua + logistics + iva

    setResult({
      baseImport,
      arancel,
      dua,
      logistics,
      total,
    })
  }

  const onExportPdf = async () => {
    setError(null)
    try {
      const res = await fetch('/api/pdf', {
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

      const ct = res.headers.get('content-type') || ''
      if (!res.ok || !ct.startsWith('application/pdf')) {
        // Si el server devolvió JSON de error, muéstralo
        try {
          const j = await res.json()
          setError(j?.error ?? `Error al generar PDF (HTTP ${res.status})`)
        } catch {
          setError(`Error al generar PDF (HTTP ${res.status})`)
        }
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (e) {
      setError('No se pudo conectar con el servicio de PDF.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gold font-semibold">Calculadora de Subastas</h1>
        <p className="text-sm text-white/70">
          Estimación rápida de costes para importación desde Dubái.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gold">CIF (€)</Label>
          <Input placeholder="0" value={form.cif} onChange={onChange('cif')} />
        </div>
        <div>
          <Label className="text-sm text-gold">Flete (€)</Label>
          <Input placeholder="0" value={form.freight} onChange={onChange('freight')} />
        </div>
        <div>
          <Label className="text-sm text-gold">Seguro (€)</Label>
          <Input placeholder="0" value={form.insurance} onChange={onChange('insurance')} />
        </div>
        <div>
          <Label className="text-sm text-gold">HS Code</Label>
          <Input placeholder="8703" value={form.hsCode} onChange={onChange('hsCode')} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          className="bg-gold text-black hover:opacity-90 shadow-gold"
          onClick={() => {
            setLoading(true)
            try {
              onCalc()
            } finally {
              setLoading(false)
            }
          }}
          disabled={loading}
        >
          {loading ? 'Calculando…' : 'Calcular'}
        </Button>

        {result && (
          <Button
            variant="outline"
            className="border-gold-30 text-gold hover:opacity-90"
            onClick={onExportPdf}
          >
            Exportar PDF
          </Button>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-400 border border-red-400/40 rounded px-3 py-2 bg-red-400/10 w-fit">
          {error}
        </div>
      )}

      {result && (
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.25)' }}
        >
          <ul className="text-sm space-y-1">
            <li>Base: € {result.baseImport.toFixed(2)}</li>
            <li>Arancel: € {result.arancel.toFixed(2)}</li>
            <li>DUA: € {result.dua.toFixed(2)}</li>
            <li>Logística: € {result.logistics.toFixed(2)}</li>
            <li className="text-gold font-semibold pt-1">
              TOTAL: € {result.total.toFixed(2)}
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

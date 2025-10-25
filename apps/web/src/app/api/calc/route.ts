import { NextRequest, NextResponse } from 'next/server'
import { calculateQuote, type Fee } from '@/lib/calc-engine'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    cif: number
    freight?: number
    insurance?: number
    hsCode: string
    originCountry: string
  }

  // MVP: tarifas fijas de ejemplo (luego se cargarán de Supabase)
  const fees: Fee[] = [
    { type: 'ARANCEL', mode: 'percent', value: 10 },
    { type: 'DUA', mode: 'fixed', value: 60 },
    { type: 'LOGISTICA', mode: 'fixed', value: 300 },
    { type: 'IVA', mode: 'percent', value: 21 },
  ]

  const result = calculateQuote(
    {
      cif: body.cif,
      freight: body.freight,
      insurance: body.insurance,
      hsCode: body.hsCode,
      originCountry: body.originCountry,
    },
    { fees, boe: null, plan: 'Pro' }
  )

  return NextResponse.json({ ok: true, result })
}

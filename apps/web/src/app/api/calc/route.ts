import { NextRequest, NextResponse } from 'next/server'
import { calculateQuote } from '@/lib/calc-engine'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { cif, freight, insurance, hsCode, originCountry } = body

  // MVP: tarifas fijas de ejemplo (luego las cargaremos de Supabase)
  const fees = [
    { type: 'ARANCEL', mode: 'percent', value: 10 },
    { type: 'DUA', mode: 'fixed', value: 60 },
    { type: 'LOGISTICA', mode: 'fixed', value: 300 },
    { type: 'IVA', mode: 'percent', value: 21 },
  ] as const

  const result = calculateQuote(
    { cif, freight, insurance, hsCode, originCountry },
    { fees: fees as any, boe: null, plan: 'Pro' }
  )

  return NextResponse.json({ ok: true, result })
}

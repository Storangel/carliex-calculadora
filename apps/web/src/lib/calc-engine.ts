export type FeeType = 'IVA' | 'ARANCEL' | 'DUA' | 'LOGISTICA' | 'OTROS'
export type Fee = { type: FeeType; mode: 'percent'|'fixed'; value: number }

export type CalcInput = {
  cif: number
  freight?: number
  insurance?: number
  hsCode: string
  originCountry: string  // 'AE'
  dealerMode?: boolean
}

export type CalcContext = {
  fees: Fee[]
  boe?: { base: number } | null
  plan: 'Free'|'Pro'|'Dealer'|'Pro+'
}

export type CalcBreakdown = {
  baseImport: number
  arancel: number
  dua: number
  iva: number
  logistics: number
  total: number
  visibility: { showMargins: boolean; showIVA: boolean }
}

export function calculateQuote(input: CalcInput, ctx: CalcContext): CalcBreakdown {
  const freight = input.freight ?? 0
  const insurance = input.insurance ?? 0
  const base = input.cif + freight + insurance

  const pick = (t: FeeType) => ctx.fees.filter(f => f.type === t)
  const sum = (arr: Fee[], refBase: number) =>
    arr.reduce((acc, f) => acc + (f.mode === 'percent' ? refBase * (f.value/100) : f.value), 0)

  const arancel = sum(pick('ARANCEL'), base)
  const dua = sum(pick('DUA'), base)
  const logistics = sum(pick('LOGISTICA'), base)
  const ivaBase = base + arancel + dua + logistics
  const iva = sum(pick('IVA'), ivaBase)

  const visibility = {
    showMargins: ctx.plan !== 'Dealer' || !!input.dealerMode,
    showIVA: ctx.plan !== 'Dealer' || !!input.dealerMode,
  }

  return {
    baseImport: base,
    arancel,
    dua,
    iva,
    logistics,
    total: base + arancel + dua + iva + logistics,
    visibility,
  }
}

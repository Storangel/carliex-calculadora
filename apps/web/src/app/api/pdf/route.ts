/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { calculateQuote } from '@/lib/calc-engine'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    // Import dinámico compatible CJS/ESM
    const mod = await import('pdfkit')
    const PDFDocument: any = (mod as any).default ?? (mod as any)

    const body = (await req.json()) as {
      cif: number
      freight?: number
      insurance?: number
      hsCode: string
      originCountry: string
    }

    const result = calculateQuote(
      {
        cif: Number(body.cif),
        freight: Number(body.freight ?? 0),
        insurance: Number(body.insurance ?? 0),
        hsCode: body.hsCode,
        originCountry: body.originCountry,
      },
      {
        fees: [
          { type: 'ARANCEL', mode: 'percent', value: 10 },
          { type: 'DUA', mode: 'fixed', value: 60 },
          { type: 'LOGISTICA', mode: 'fixed', value: 300 },
          { type: 'IVA', mode: 'percent', value: 21 },
        ],
        boe: null,
        plan: 'Pro',
      }
    )

    const doc = new PDFDocument({ margin: 40 })
    const chunks: Buffer[] = []
    doc.on('data', (c: Buffer) => chunks.push(c))

    // —— Contenido del PDF ——
    doc.fontSize(18).fillColor('#d4af37').text('Presupuesto Carliex Europe', { align: 'center' })
    doc.moveDown()
    doc.fontSize(12).fillColor('#ffffff')
    doc.text(`CIF: €${Number(body.cif).toFixed(2)}`)
    doc.text(`Flete: €${Number(body.freight ?? 0).toFixed(2)}`)
    doc.text(`Seguro: €${Number(body.insurance ?? 0).toFixed(2)}`)
    doc.text(`HS Code: ${body.hsCode}`)
    doc.moveDown()
    doc.text(`Base: €${result.baseImport.toFixed(2)}`)
    doc.text(`Arancel: €${result.arancel.toFixed(2)}`)
    doc.text(`DUA: €${result.dua.toFixed(2)}`)
    doc.text(`Logística: €${result.logistics.toFixed(2)}`)
    doc.moveDown()
    doc.fillColor('#d4af37').fontSize(14).text(`TOTAL: €${result.total.toFixed(2)}`)

    // Esperar a que termine de generarse
    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)
      doc.end()
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="presupuesto.pdf"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error generando PDF'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { calculateQuote } from '@/lib/calc-engine'

export const runtime = 'nodejs' // pdfkit necesita Node, no Edge

export async function POST(req: NextRequest) {
  const body = await req.json()

  const result = calculateQuote(
    {
      cif: Number(body.cif),
      freight: Number(body.freight),
      insurance: Number(body.insurance),
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

  // Crear PDF en memoria
  const doc = new PDFDocument({ margin: 40 })
  const chunks: Buffer[] = []

  doc.on('data', (c) => chunks.push(c))
  doc.on('end', () => {})

  doc.fontSize(18).fillColor('#d4af37').text('Presupuesto Carliex Europe', { align: 'center' })
  doc.moveDown()
  doc.fontSize(12).fillColor('#ffffff')
  doc.text(`CIF: €${body.cif}`)
  doc.text(`Flete: €${body.freight}`)
  doc.text(`Seguro: €${body.insurance}`)
  doc.text(`HS Code: ${body.hsCode}`)
  doc.moveDown()
  doc.text(`Base: €${result.baseImport.toFixed(2)}`)
  doc.text(`Arancel: €${result.arancel.toFixed(2)}`)
  doc.text(`DUA: €${result.dua.toFixed(2)}`)
  doc.text(`Logística: €${result.logistics.toFixed(2)}`)
  doc.moveDown()
  doc.fillColor('#d4af37').fontSize(14).text(`TOTAL: €${result.total.toFixed(2)}`)
  doc.end()

  const pdfBuffer = Buffer.concat(chunks)
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="presupuesto.pdf"',
    },
  })
}

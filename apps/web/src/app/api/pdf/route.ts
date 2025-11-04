/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server'
import { calculateQuote } from '@/lib/calc-engine'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server'
import { calculateQuote } from '@/lib/calc-engine'
import fs from 'node:fs'
import path from 'node:path'

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
        // MVP: tarifas fijas (luego vendrán de Supabase)
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

    // Paths y logo opcional
    const publicDir = path.join(process.cwd(), 'public')
    const logoPath = path.join(publicDir, 'logo-carliex.png')
    const hasLogo = fs.existsSync(logoPath)

    // Crear PDF
    const doc = new PDFDocument({ margin: 40 })
    const chunks: Buffer[] = []
    doc.on('data', (c: Buffer) => chunks.push(c))
    doc.on('error', (e: unknown) => {
      console.error('pdfkit error:', e)
    })

    // ===== Cabecera =====
    if (hasLogo) {
      try {
        doc.image(logoPath, 40, 30, { width: 110 })
      } catch {
        // si falla la imagen, seguimos sin bloquear
      }
    }
    doc
      .fillColor('#d4af37')
      .fontSize(16)
      .text('Presupuesto Carliex Europe', hasLogo ? 160 : 40, 35)
      .moveTo(40, 70)
      .lineTo(555, 70)
      .strokeColor('#d4af37')
      .stroke()

    doc.moveDown().moveDown()

    // ===== Datos de entrada =====
    doc.fillColor('#000000').fontSize(12)
    doc.text(`CIF: €${Number(body.cif).toFixed(2)}`)
    doc.text(`Flete: €${Number(body.freight ?? 0).toFixed(2)}`)
    doc.text(`Seguro: €${Number(body.insurance ?? 0).toFixed(2)}`)
    doc.text(`HS Code: ${body.hsCode}`)
    doc.moveDown()

    // ===== Tabla simple de desglose =====
    const startX = 40
    let y = doc.y
    const row = (label: string, value: string, bold = false) => {
      if (bold) doc.font('Helvetica-Bold')
      else doc.font('Helvetica')
      doc.text(label, startX, y, { width: 200 })
      doc.text(value, 260, y, { width: 280, align: 'right' })
      y += 18
    }

    row('Base', `€${result.baseImport.toFixed(2)}`)
    row('Arancel', `€${result.arancel.toFixed(2)}`)
    row('DUA', `€${result.dua.toFixed(2)}`)
    row('Logística', `€${result.logistics.toFixed(2)}`)
    doc.moveTo(startX, y + 4).lineTo(555, y + 4).strokeColor('#d4af37').stroke()
    y += 10
    row('TOTAL', `€${result.total.toFixed(2)}`, true)

    doc.moveDown().moveDown()
    doc.fillColor('#555').fontSize(9).text('Documento generado automáticamente por Carliex Calculadora.')

    // ===== Finalizar y devolver como Uint8Array (BodyInit válido) =====
    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)
      doc.end()
    })
    const uint8 = new Uint8Array(pdfBuffer)

    return new Response(uint8, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="presupuesto.pdf"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error generando PDF'
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
// ...
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
  <Button className="bg-gold text-black hover:opacity-90 shadow-gold" onClick={onCalc} disabled={loading}>
    {loading ? 'Calculando…' : 'Calcular'}
  </Button>
  {result && (
    <Button variant="outline" className="border-gold-30 text-gold hover:opacity-90" onClick={onExportPdf}>
      Exportar PDF
    </Button>
  )}
</div>

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export function exportMovementsToExcel(movements) {
  const rows = movements.map(m => ({
    Date:        m.date,
    Produit:     m.productName,
    Type:        m.type,
    Quantité:    m.quantity,
    Commentaire: m.comment || '',
  }))

  const worksheet  = XLSX.utils.json_to_sheet(rows)
  const workbook   = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mouvements')

  // Auto-width
  const colWidths = [
    { wch: 12 }, // Date
    { wch: 30 }, // Produit
    { wch: 10 }, // Type
    { wch: 10 }, // Quantité
    { wch: 40 }, // Commentaire
  ]
  worksheet['!cols'] = colWidths

  const filename = `mouvements_${new Date().toISOString().split('T')[0]}.xlsx`
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, filename)
}

export function exportProductsToExcel(products) {
  const rows = products.map(p => ({
    Nom:           p.name,
    Catégorie:     p.category,
    Quantité:      p.quantity,
    Unité:         p.unit,
    'Seuil min.':  p.minThreshold,
    'Prix unit.':  p.pricePerUnit,
    'Valeur (€)':  +(p.quantity * p.pricePerUnit).toFixed(2),
    Statut:        p.quantity <= 0 ? 'Rupture' : p.quantity < p.minThreshold ? 'Alerte' : 'OK',
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook  = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Produits')

  const filename = `produits_${new Date().toISOString().split('T')[0]}.xlsx`
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, filename)
}

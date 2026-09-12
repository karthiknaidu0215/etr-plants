'use client'

import { usePlannerStore } from '@/stores/plannerStore'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jspdf: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    html2canvas: any
  }
}

export async function generatePDF(plannerState: ReturnType<typeof usePlannerStore.getState>) {
  const {
        planId, landAcres, selectedState, selectedDistrict, selectedMandal,
    selectedPlants, calculations,
  } = plannerState

  // Dynamically import jsPDF
  const { jsPDF } = await import('jspdf')

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = 210
  const margin = 15
  let y = 20

  const addText = (
    text: string, x: number, yPos: number,
    opts: { size?: number; bold?: boolean; color?: [number,number,number] } = {}
  ) => {
    pdf.setFontSize(opts.size || 10)
    pdf.setFont('helvetica', opts.bold ? 'bold' : 'normal')
    if (opts.color) pdf.setTextColor(...opts.color)
    else pdf.setTextColor(28, 28, 28)
    pdf.text(text, x, yPos)
  }

  const addLine = (yPos: number) => {
    pdf.setDrawColor(26, 71, 49)
    pdf.setLineWidth(0.3)
    pdf.line(margin, yPos, pageW - margin, yPos)
  }

  const checkPage = (needed: number) => {
    if (y + needed > 275) {
      pdf.addPage()
      y = 20
    }
  }

  // ── Header ─────────────────────────────────────────────────
  pdf.setFillColor(26, 71, 49) // forest green
  pdf.rect(0, 0, pageW, 30, 'F')

  addText('ETR Plants', margin, 12, { size: 18, bold: true, color: [255,255,255] })
  addText('Plantation Planning Report', margin, 20, { size: 10, color: [180,230,200] })
  if (planId) {
    addText(planId, pageW - margin - 40, 20, { size: 9, color: [180,230,200] })
  }
  addText(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageW - margin - 40, 12, { size: 8, color: [180,230,200] })

  y = 40

  // ── Land & Location ─────────────────────────────────────────
  addText('Land & Location', margin, y, { size: 13, bold: true, color: [26,71,49] })
  y += 6
  addLine(y); y += 5

  addText(`Land Size: ${landAcres} Acres (${(landAcres * 43560).toLocaleString('en-IN')} sq ft)`, margin, y, { size: 10 })
  y += 6
  const loc = [selectedMandal, selectedDistrict, selectedState].filter(Boolean).join(', ')
  addText(`Location: ${loc || 'Not specified'}`, margin, y, { size: 10 })
  y += 6
  addText(`Plantation Area (~75%): ${calculations.plantableAcres.toFixed(2)} acres`, margin, y, { size: 10 })
  y += 10

  // ── Selected Plants ──────────────────────────────────────────
  checkPage(30)
  addText('Selected Plants', margin, y, { size: 13, bold: true, color: [26,71,49] })
  y += 6; addLine(y); y += 5

  if (selectedPlants.length === 0) {
    addText('No plants selected.', margin, y, { size: 10 })
    y += 8
  } else {
    // Table header
    pdf.setFillColor(240, 247, 244)
    pdf.rect(margin, y - 4, pageW - margin * 2, 7, 'F')
    addText('Plant', margin + 2, y, { size: 8, bold: true })
    addText('Spacing', 80, y, { size: 8, bold: true })
    addText('Allocation', 105, y, { size: 8, bold: true })
    addText('Acres', 135, y, { size: 8, bold: true })
    addText('Plants', 157, y, { size: 8, bold: true })
    addText('Cost (₹)', 175, y, { size: 8, bold: true })
    y += 6

    selectedPlants.forEach((sp) => {
      checkPage(10)
      addText(sp.plant.name, margin + 2, y, { size: 9 })
      addText(`${sp.spacing} ft`, 80, y, { size: 9 })
      addText(`${sp.allocationPercentage.toFixed(0)}%`, 105, y, { size: 9 })
      addText(sp.allocatedAcres.toFixed(2), 135, y, { size: 9 })
      addText(sp.plantCount.toLocaleString('en-IN'), 157, y, { size: 9 })
      const cost = new Intl.NumberFormat('en-IN').format(sp.plantCost)
      addText(cost, 175, y, { size: 9 })
      y += 7
    })
  }
  y += 5

  // ── Fertilizer & Maintenance ─────────────────────────────────
  checkPage(20)
  addText('Fertilizer & Maintenance Plan', margin, y, { size: 13, bold: true, color: [26,71,49] })
  y += 6; addLine(y); y += 5

  selectedPlants.forEach((sp) => {
    checkPage(20)
    addText(sp.plant.name, margin, y, { size: 10, bold: true })
    y += 5
    if (sp.plant.fertilizer_info) {
      addText(`Fertilizer: ${sp.plant.fertilizer_info.type} | Frequency: ${sp.plant.fertilizer_info.frequency}`, margin + 5, y, { size: 9 })
      y += 5
    }
    if (sp.plant.maintenance_info?.general) {
      const lines = pdf.splitTextToSize(sp.plant.maintenance_info.general, pageW - margin * 2 - 10)
      lines.forEach((line: string) => { addText(line, margin + 5, y, { size: 9 }); y += 5 })
    }
    if (sp.plant.water_requirement) {
      addText(`Water: ${sp.plant.water_requirement}`, margin + 5, y, { size: 9 })
      y += 5
    }
    y += 3
  })

  // ── Investment Breakdown ─────────────────────────────────────
  checkPage(60)
  addText('Investment Breakdown', margin, y, { size: 13, bold: true, color: [26,71,49] })
  y += 6; addLine(y); y += 5

  const costs = [
    ['Plant Cost', calculations.plantCost],
    ['Fertilizer Cost', calculations.fertilizerCost],
    ['Setup Cost', calculations.setupCost],
    ['Labour Cost', calculations.labourCost],
    ['Other Costs', calculations.otherCosts],
  ] as [string, number][]

  costs.forEach(([label, val]) => {
    addText(label, margin + 2, y, { size: 10 })
    addText(`₹${new Intl.NumberFormat('en-IN').format(val)}`, pageW - margin - 30, y, { size: 10 })
    y += 7
  })

  addLine(y); y += 5
  addText('TOTAL ESTIMATED INVESTMENT', margin + 2, y, { size: 11, bold: true, color: [26,71,49] })
  addText(`₹${new Intl.NumberFormat('en-IN').format(calculations.totalInvestment)}`, pageW - margin - 40, y, { size: 11, bold: true, color: [26,71,49] })
  y += 10

  if (calculations.expectedAnnualIncome > 0) {
    addText('Estimated Annual Income', margin + 2, y, { size: 10, bold: true })
    addText(`₹${new Intl.NumberFormat('en-IN').format(calculations.expectedAnnualIncome)}`, pageW - margin - 40, y, { size: 10, bold: true, color: [45,106,79] })
    y += 10
  }

  // ── Disclaimer ───────────────────────────────────────────────
  checkPage(25)
  pdf.setFillColor(255, 251, 235)
  pdf.rect(margin, y - 3, pageW - margin * 2, 22, 'F')
  pdf.setDrawColor(217, 119, 6)
  pdf.rect(margin, y - 3, pageW - margin * 2, 22, 'S')
  y += 3
  addText('Important Disclaimer', margin + 3, y, { size: 9, bold: true, color: [146, 64, 14] })
  y += 5
  const disc = 'Income and yield figures are estimates based on configured assumptions and may vary depending on climate, soil, maintenance, yield and market conditions. ETR Plants does not guarantee any income.'
  const discLines = pdf.splitTextToSize(disc, pageW - margin * 2 - 10)
  discLines.forEach((line: string) => {
    addText(line, margin + 3, y, { size: 8, color: [146, 64, 14] })
    y += 4
  })
  y += 8

  // ── Footer ───────────────────────────────────────────────────
  const totalPages = pdf.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFillColor(26, 71, 49)
    pdf.rect(0, 285, pageW, 12, 'F')
    pdf.setFontSize(7)
    pdf.setTextColor(180, 230, 200)
    pdf.text('ETR Plants | Plantation Planning Platform', margin, 292)
    pdf.text(`Page ${i} of ${totalPages}`, pageW - margin - 15, 292)
  }

  pdf.save(`${planId || 'ETR-Plan'}.pdf`)
}

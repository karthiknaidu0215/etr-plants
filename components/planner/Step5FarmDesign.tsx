/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { usePlannerStore } from '@/stores/plannerStore'
import { FarmZone } from '@/lib/types'
import { PLANTATION_COLORS, cn } from '@/lib/utils'
import { LayoutDashboard, Trash2, Home, DoorOpen, Route, Droplets, TreePine, Square } from 'lucide-react'

const CANVAS_W = 600
const CANVAS_H = 400

const ZONE_TYPES = [
  { type: 'farmhouse', label: 'Farmhouse', icon: Home, color: '#8b5e3c' },
  { type: 'entrance', label: 'Entrance', icon: DoorOpen, color: '#f59e0b' },
  { type: 'road', label: 'Road', icon: Route, color: '#9ca3af' },
  { type: 'water', label: 'Water Source', icon: Droplets, color: '#3b82f6' },
  { type: 'open', label: 'Open Space', icon: Square, color: '#d1fae5' },
  { type: 'plantation', label: 'Plantation Block', icon: TreePine, color: '#2d6a4f' },
]

export default function Step5FarmDesign() {
  const { farmZones, landAcres, selectedPlants, addFarmZone, updateFarmZone, deleteFarmZone } =
    usePlannerStore()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [resizing, setResizing] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [selectedPlantForBlock, setSelectedPlantForBlock] = useState<string>('')

  // Scale factor: map canvas px to acres
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    ctx.fillStyle = '#f9fafb'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    // Grid
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 0.5
    for (let x = 0; x <= CANVAS_W; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke()
    }
    for (let y = 0; y <= CANVAS_H; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke()
    }

    // Zones
    farmZones.forEach((zone) => {
      const isSelected = selectedZone === zone.id
      const fill = zone.type === 'plantation'
        ? PLANTATION_COLORS[selectedPlants.findIndex((sp) => sp.plantId === zone.plant_id) % PLANTATION_COLORS.length] || '#2d6a4f'
        : zone.fill

      if (zone.type === 'boundary') {
        ctx.strokeStyle = '#1a4731'
        ctx.lineWidth = 3
        ctx.setLineDash([10, 5])
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height)
        ctx.setLineDash([])
        ctx.fillStyle = 'rgba(26,71,49,0.03)'
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height)
        ctx.fillStyle = '#1a4731'
        ctx.font = 'bold 11px sans-serif'
        ctx.fillText(`${landAcres} Acre${landAcres > 1 ? 's' : ''} Land`, zone.x + 8, zone.y + 16)
        return
      }

      // Shadow for selected
      if (isSelected) {
        ctx.shadowColor = 'rgba(26,71,49,0.3)'
        ctx.shadowBlur = 8
      }

      ctx.fillStyle = fill + 'cc'
      ctx.fillRect(zone.x, zone.y, zone.width, zone.height)
      ctx.shadowBlur = 0

      ctx.strokeStyle = isSelected ? '#1a4731' : fill
      ctx.lineWidth = isSelected ? 2.5 : 1.5
      ctx.strokeRect(zone.x, zone.y, zone.width, zone.height)

      // Label
      ctx.fillStyle = '#1c1c1c'
      ctx.font = '11px sans-serif'
      ctx.fillText(zone.label, zone.x + 5, zone.y + 14)
      if (zone.plant_name) ctx.fillText(zone.plant_name, zone.x + 5, zone.y + 26)

      // Resize handle (bottom-right corner)
      if (isSelected) {
        ctx.fillStyle = '#1a4731'
        ctx.fillRect(zone.x + zone.width - 8, zone.y + zone.height - 8, 8, 8)
      }
    })
  }, [farmZones, selectedZone, selectedPlants, landAcres])

  useEffect(() => { draw() }, [draw])

  const getZoneAtPos = (x: number, y: number) => {
    // Iterate reverse so topmost zones are hit first
    for (let i = farmZones.length - 1; i >= 0; i--) {
      const z = farmZones[i]
      if (z.type === 'boundary') continue
      if (x >= z.x && x <= z.x + z.width && y >= z.y && y <= z.y + z.height) return z
    }
    return null
  }

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_W / rect.width
    const scaleY = CANVAS_H / rect.height
    if ('touches' in e) {
      const t = (e as React.TouchEvent).touches[0]
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY }
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
    }
  }

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCanvasPos(e)
    const zone = getZoneAtPos(x, y)
    if (!zone) { setSelectedZone(null); return }

    // Check resize handle
    const isResizeHandle = x >= zone.x + zone.width - 12 && y >= zone.y + zone.height - 12
    if (isResizeHandle) {
      setResizing(zone.id)
      setSelectedZone(zone.id)
    } else {
      setDragging(zone.id)
      setDragOffset({ x: x - zone.x, y: y - zone.y })
      setSelectedZone(zone.id)
    }
  }

  const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging && !resizing) return
    const { x, y } = getCanvasPos(e)
    const boundary = farmZones.find((z) => z.type === 'boundary')!

    if (dragging) {
      const zone = farmZones.find((z) => z.id === dragging)!
      const nx = Math.max(boundary.x, Math.min(x - dragOffset.x, boundary.x + boundary.width - zone.width))
      const ny = Math.max(boundary.y, Math.min(y - dragOffset.y, boundary.y + boundary.height - zone.height))
      updateFarmZone(dragging, { x: nx, y: ny })
    } else if (resizing) {
      const zone = farmZones.find((z) => z.id === resizing)!
      const nw = Math.max(30, Math.min(x - zone.x, boundary.x + boundary.width - zone.x))
      const nh = Math.max(20, Math.min(y - zone.y, boundary.y + boundary.height - zone.y))
      updateFarmZone(resizing, { width: nw, height: nh })
    }
  }

  const onPointerUp = () => { setDragging(null); setResizing(null) }

  const addZone = (type: string) => {
    const boundary = farmZones.find((z) => z.type === 'boundary')!
    const color = ZONE_TYPES.find((zt) => zt.type === type)?.color || '#ccc'
    const sp = type === 'plantation' && selectedPlants.length > 0
      ? selectedPlants.find((p) => p.plantId === selectedPlantForBlock) || selectedPlants[0]
      : null

    const newZone: FarmZone = {
      id: `zone-${Date.now()}`,
      type: type as FarmZone['type'],
      label: ZONE_TYPES.find((zt) => zt.type === type)?.label || type,
      plant_id: sp?.plantId,
      plant_name: sp?.plant.name,
      x: boundary.x + 50,
      y: boundary.y + 50,
      width: type === 'road' ? 15 : 80,
      height: type === 'road' ? 100 : 60,
      fill: type === 'plantation' && sp
        ? PLANTATION_COLORS[selectedPlants.indexOf(sp) % PLANTATION_COLORS.length]
        : color,
      area_acres: 0.1,
    }
    addFarmZone(newZone)
    setSelectedZone(newZone.id)
  }

  // Land utilization
  const boundary = farmZones.find((z) => z.type === 'boundary')
  const boundaryArea = boundary ? boundary.width * boundary.height : 1
  const usedPx = farmZones.filter((z) => z.type !== 'boundary').reduce((s, z) => s + z.width * z.height, 0)
  const usedFraction = Math.min(usedPx / boundaryArea, 1)
  const usedAcres = usedFraction * landAcres
  const remainingAcres = landAcres - usedAcres

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LayoutDashboard className="w-7 h-7 text-forest-700" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Design Your Farm Layout</h2>
        <p className="text-gray-500">Drag and resize zones to plan your farm — click a zone to select it</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-card">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="w-full touch-none cursor-crosshair farm-canvas"
              onMouseDown={onPointerDown}
              onMouseMove={onPointerMove}
              onMouseUp={onPointerUp}
              onMouseLeave={onPointerUp}
              onTouchStart={onPointerDown}
              onTouchMove={onPointerMove}
              onTouchEnd={onPointerUp}
            />
          </div>

          {/* Land utilization bar */}
          <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-gray-600">Total: <strong>{landAcres} acres</strong></span>
              <span className="text-forest-700">Used: <strong>{usedAcres.toFixed(2)} acres ({(usedFraction * 100).toFixed(0)}%)</strong></span>
              <span className="text-gray-500">Free: <strong>{remainingAcres.toFixed(2)} acres</strong></span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-forest-700 rounded-full transition-all duration-300"
                style={{ width: `${usedFraction * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar: Add zones */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="font-bold text-gray-800 text-sm mb-3">Add Zone</p>

            {/* Plant selector for plantation block */}
            {selectedPlants.length > 0 && (
              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-1 block">Plant for block:</label>
                <select
                  value={selectedPlantForBlock}
                  onChange={(e) => setSelectedPlantForBlock(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-forest-700"
                >
                  <option value="">First selected</option>
                  {selectedPlants.map((sp) => (
                    <option key={sp.plantId} value={sp.plantId}>{sp.plant.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {ZONE_TYPES.map((zt) => {
                const Icon = zt.icon
                return (
                  <button
                    key={zt.type}
                    onClick={() => addZone(zt.type)}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 border-gray-100 hover:border-forest-700 hover:bg-forest-50 transition-all text-xs font-medium text-gray-600 hover:text-forest-700"
                  >
                    <Icon className="w-4 h-4" />
                    {zt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Zone list */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 max-h-64 overflow-y-auto">
            <p className="font-bold text-gray-800 text-sm mb-3">Zones</p>
            <div className="space-y-1.5">
              {farmZones.map((zone) => (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-xs',
                    selectedZone === zone.id
                      ? 'bg-forest-50 border border-forest-200'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ background: zone.fill || '#ccc' }}
                    />
                    <span className="font-medium text-gray-700 truncate">{zone.label}</span>
                  </div>
                  {zone.type !== 'boundary' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteFarmZone(zone.id) }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            <strong>Tip:</strong> Click a zone to select it. Drag to move. Drag the small green corner handle to resize.
          </div>
        </div>
      </div>
    </div>
  )
}

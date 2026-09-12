import React, { useState, useEffect } from 'react'
import { Stage, Layer, Rect, Circle, Text, Group, Path } from 'react-konva'
import { usePlannerStore } from '@/stores/plannerStore'
import { FarmZone } from '@/lib/types'
import { Home, Route, Droplets, RotateCw, Trash2, Undo, Redo, Box } from 'lucide-react'

const CANVAS_W = 800
const CANVAS_H = 600
const GRID_SIZE = 20

// Custom Shapes for realistic visuals
const TreePattern = ({ x, y, width, height, color }: { x?: number, y?: number, width: number, height: number, color: string }) => {
  // Draw a top-down tree canopy using overlapping circles
  return (
    <Group x={x || 0} y={y || 0}>
      <Rect width={width} height={height} fill={color} opacity={0.3} cornerRadius={5} />
      {/* Draw some trees inside the block */}
      {Array.from({ length: 6 }).map((_, i) => {
        const tx = (width / 4) + (i % 3) * (width / 4)
        const ty = (height / 3) + Math.floor(i / 3) * (height / 3)
        return (
          <Group key={i} x={tx} y={ty}>
            <Circle radius={10} fill="#1e293b" opacity={0.2} x={2} y={2} />
            <Circle radius={12} fill={color} stroke="#064e3b" strokeWidth={1} />
            <Circle radius={8} fill="#34d399" opacity={0.4} x={-2} y={-2} />
          </Group>
        )
      })}
    </Group>
  )
}

const BeeBox = ({ x, y, width, height }: { x?: number, y?: number, width: number, height: number }) => (
  <Group x={x || 0} y={y || 0}>
    <Rect width={width} height={height} fill="#fbbf24" stroke="#b45309" strokeWidth={2} cornerRadius={2} />
    <Rect width={width * 0.8} height={2} x={width * 0.1} y={height / 2} fill="#78350f" />
  </Group>
)

const FarmHouse = ({ x, y, width, height }: { x?: number, y?: number, width: number, height: number }) => (
  <Group x={x || 0} y={y || 0}>
    <Rect width={width} height={height} fill="#f8fafc" stroke="#94a3b8" strokeWidth={2} />
    <Path data={`M -5 ${height/2} L ${width/2} -10 L ${width+5} ${height/2} Z`} fill="#ef4444" stroke="#b91c1c" strokeWidth={2} />
  </Group>
)

export default function FarmCanvas() {
  const { farmZones, selectedPlants, landAcres, setFarmZones } = usePlannerStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  // History for Undo/Redo
  const [history, setHistory] = useState<FarmZone[][]>([farmZones])
  const [historyStep, setHistoryStep] = useState(0)

  // Initialize automatic layout if empty
  useEffect(() => {
    if (farmZones.length === 0) {
      // Auto-arrange
      const initialZones: FarmZone[] = []
      
      // Boundary
      initialZones.push({
        id: 'boundary', type: 'boundary', label: 'Land Boundary',
        x: 50, y: 50, width: CANVAS_W - 100, height: CANVAS_H - 100,
        fill: 'transparent', area_acres: landAcres, rotation: 0
      })
      
      // Gate (South center)
      initialZones.push({
        id: 'gate', type: 'entrance', label: 'Main Gate',
        x: CANVAS_W/2 - 20, y: CANVAS_H - 50, width: 40, height: 10,
        fill: '#f59e0b', area_acres: 0, rotation: 0
      })
      
      // Farmhouse (Center)
      initialZones.push({
        id: 'house', type: 'farmhouse', label: 'Farmhouse',
        x: CANVAS_W/2 - 40, y: CANVAS_H/2 - 30, width: 80, height: 60,
        fill: '#8b5e3c', area_acres: 0, rotation: 0
      })
      
      // Roads (Gate to Farmhouse)
      initialZones.push({
        id: 'road-main', type: 'road', label: 'Main Road',
        x: CANVAS_W/2 - 10, y: CANVAS_H/2 + 30, width: 20, height: CANVAS_H/2 - 80,
        fill: '#9ca3af', area_acres: 0, rotation: 0
      })

      // Distribute Plants
      const colors = ['#10b981', '#059669', '#047857', '#34d399']
      selectedPlants.forEach((sp, idx) => {
        const w = 150
        const h = 100
        const xOffset = idx % 2 === 0 ? 80 : CANVAS_W - 80 - w
        const yOffset = idx < 2 ? 80 : 200
        initialZones.push({
          id: `plant-${sp.plantId}`,
          type: 'plantation',
          label: sp.plant.name,
          plant_id: sp.plantId,
          plant_name: sp.plant.name,
          x: xOffset, y: yOffset, width: w, height: h,
          fill: colors[idx % colors.length],
          area_acres: (sp.allocation_percentage / 100) * landAcres,
          rotation: 0
        })
      })

      setFarmZones(initialZones)
      setHistory([initialZones])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once

  const saveHistory = (newZones: FarmZone[]) => {
    const newHist = history.slice(0, historyStep + 1)
    newHist.push(JSON.parse(JSON.stringify(newZones)))
    setHistory(newHist)
    setHistoryStep(newHist.length - 1)
  }

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1)
      setFarmZones(history[historyStep - 1])
    }
  }

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1)
      setFarmZones(history[historyStep + 1])
    }
  }

  const handleDragEnd = (e: { target: { x: () => number; y: () => number } }, id: string) => {
    const node = e.target
    const updated = farmZones.map(z => z.id === id ? { ...z, x: node.x(), y: node.y() } : z)
    setFarmZones(updated)
    saveHistory(updated)
  }

  const handleRotate = () => {
    if (!selectedId) return
    const updated = farmZones.map(z => z.id === selectedId ? { ...z, rotation: ((z.rotation || 0) + 90) % 360 } : z)
    setFarmZones(updated)
    saveHistory(updated)
  }
  
  const handleDelete = () => {
    if (!selectedId || selectedId === 'boundary') return
    const updated = farmZones.filter(z => z.id !== selectedId)
    setFarmZones(updated)
    setSelectedId(null)
    saveHistory(updated)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addElement = (type: FarmZone['type'], plant: any = null) => {
    const newZone: FarmZone = {
      id: `zone-${Date.now()}`,
      type,
      label: plant ? plant.plant.name : type,
      plant_id: plant?.plantId,
      plant_name: plant?.plant?.name,
      x: CANVAS_W / 2,
      y: CANVAS_H / 2,
      width: type === 'road' ? 20 : type === 'honey_bee_box' ? 30 : 100,
      height: type === 'road' ? 100 : type === 'honey_bee_box' ? 30 : 100,
      fill: plant ? '#10b981' : '#ccc',
      area_acres: 0.1,
      rotation: 0
    }
    const updated = [...farmZones, newZone]
    setFarmZones(updated)
    setSelectedId(newZone.id)
    saveHistory(updated)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => addElement('road')} className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"><Route className="w-4 h-4"/> Road</button>
          <button onClick={() => addElement('farmhouse')} className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"><Home className="w-4 h-4"/> House</button>
          <button onClick={() => addElement('water')} className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"><Droplets className="w-4 h-4"/> Water</button>
          <button onClick={() => addElement('honey_bee_box')} className="flex items-center gap-1 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded text-sm"><Box className="w-4 h-4"/> Bee Box</button>
          
          <select 
            onChange={(e) => {
              if (e.target.value) {
                const plant = selectedPlants.find(p => p.plantId === e.target.value)
                addElement('plantation', plant)
                e.target.value = ''
              }
            }}
            className="px-3 py-2 bg-forest-50 border border-forest-200 text-forest-700 rounded text-sm outline-none"
          >
            <option value="">+ Add Plant Block</option>
            {selectedPlants.map(p => <option key={p.plantId} value={p.plantId}>{p.plant.name}</option>)}
          </select>
        </div>

        <div className="flex gap-2 border-l pl-3">
          <button onClick={handleRotate} disabled={!selectedId} className="p-2 bg-gray-50 hover:bg-gray-200 rounded disabled:opacity-50"><RotateCw className="w-4 h-4"/></button>
          <button onClick={handleDelete} disabled={!selectedId || selectedId === 'boundary'} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded disabled:opacity-50"><Trash2 className="w-4 h-4"/></button>
          <button onClick={handleUndo} disabled={historyStep === 0} className="p-2 bg-gray-50 hover:bg-gray-200 rounded disabled:opacity-50"><Undo className="w-4 h-4"/></button>
          <button onClick={handleRedo} disabled={historyStep === history.length - 1} className="p-2 bg-gray-50 hover:bg-gray-200 rounded disabled:opacity-50"><Redo className="w-4 h-4"/></button>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-inner flex justify-center w-full overflow-x-auto">
        <Stage 
          width={CANVAS_W} 
          height={CANVAS_H} 
          onMouseDown={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage()
            if (clickedOnEmpty) setSelectedId(null)
          }}
        >
          <Layer>
            {/* Grid */}
            {Array.from({ length: CANVAS_W / GRID_SIZE }).map((_, i) => (
              <Path key={`v${i}`} data={`M ${i * GRID_SIZE} 0 L ${i * GRID_SIZE} ${CANVAS_H}`} stroke="#f1f5f9" strokeWidth={1} />
            ))}
            {Array.from({ length: CANVAS_H / GRID_SIZE }).map((_, i) => (
              <Path key={`h${i}`} data={`M 0 ${i * GRID_SIZE} L ${CANVAS_W} ${i * GRID_SIZE}`} stroke="#f1f5f9" strokeWidth={1} />
            ))}

            {farmZones.map((zone) => {
              const isSelected = selectedId === zone.id
              const isDraggable = zone.type !== 'boundary'

              return (
                <Group
                  key={zone.id}
                  x={zone.x}
                  y={zone.y}
                  rotation={zone.rotation || 0}
                  draggable={isDraggable}
                  onDragEnd={(e) => handleDragEnd(e as unknown as { target: { x: () => number; y: () => number } }, zone.id)}
                  onClick={() => setSelectedId(zone.id)}
                  onTap={() => setSelectedId(zone.id)}
                >
                  {zone.type === 'boundary' && (
                    <Rect width={zone.width} height={zone.height} stroke="#166534" strokeWidth={3} dash={[10, 5]} fill="rgba(34,197,94,0.05)" />
                  )}
                  {zone.type === 'plantation' && (
                    <TreePattern width={zone.width} height={zone.height} color={zone.fill || '#10b981'} />
                  )}
                  {zone.type === 'honey_bee_box' && <BeeBox width={zone.width} height={zone.height} />}
                  {zone.type === 'farmhouse' && <FarmHouse width={zone.width} height={zone.height} />}
                  {zone.type === 'entrance' && <Rect width={zone.width} height={zone.height} fill="#f59e0b" />}
                  {zone.type === 'road' && <Rect width={zone.width} height={zone.height} fill="#9ca3af" />}
                  {zone.type === 'water' && <Circle radius={zone.width/2} x={zone.width/2} y={zone.height/2} fill="#3b82f6" opacity={0.6} />}
                  
                  {/* Selection Highlight */}
                  {isSelected && (
                    <Rect 
                      x={-2} y={-2} 
                      width={zone.width + 4} height={zone.height + 4} 
                      stroke="#2563eb" strokeWidth={2} dash={[5, 5]} 
                    />
                  )}
                  
                  {/* Labels */}
                  {zone.type !== 'boundary' && (
                    <Text 
                      text={zone.label} 
                      x={0} y={zone.height + 5} 
                      fontSize={12} fill="#333" 
                      width={zone.width} align="center" 
                    />
                  )}
                </Group>
              )
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

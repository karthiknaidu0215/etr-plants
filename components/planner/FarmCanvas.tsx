/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react'
import { Stage, Layer, Rect, Circle, Text, Group, Path, Line, Image as KonvaImage } from 'react-konva'
import useImage from 'use-image'
import { usePlannerStore } from '@/stores/plannerStore'
import { FarmZone, SelectedPlant } from '@/lib/types'
import { Home, Route, Droplets, RotateCw, Trash2, Undo, Redo, Box, RefreshCw, ZoomIn, ZoomOut, Maximize2, Sparkles, Plus, Layers } from 'lucide-react'

const CANVAS_W = 1000
const CANVAS_H = 750
const GRID_SIZE = 25

function getFarmDimensionsFt(acres: number) {
  const sqFt = acres * 43560;
  const side = Math.round(Math.sqrt(sqFt));
  return { widthFt: side, heightFt: side };
}

const CoconutPlantShape = ({ size }: { size: number }) => {
  const radius = size / 2;
  return (
    <Group>
      <Circle radius={radius * 0.9} fill="black" opacity={0.25} x={4} y={5} />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x2 = Math.cos(angle) * radius;
        const y2 = Math.sin(angle) * radius;
        const cpX = Math.cos(angle + 0.3) * (radius * 0.6);
        const cpY = Math.sin(angle + 0.3) * (radius * 0.6);
        return (
          <Path key={i} data={`M 0 0 Q ${cpX} ${cpY} ${x2} ${y2}`} stroke="#15803d" strokeWidth={size > 30 ? 6 : 4} lineCap="round" />
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = ((i * 45 + 22.5) * Math.PI) / 180;
        const x2 = Math.cos(angle) * (radius * 0.75);
        const y2 = Math.sin(angle) * (radius * 0.75);
        return (
          <Line key={`in-${i}`} points={[0, 0, x2, y2]} stroke="#4ade80" strokeWidth={size > 30 ? 4 : 2} lineCap="round" />
        );
      })}
      <Circle radius={radius * 0.25} fill="#78350f" stroke="#451a03" strokeWidth={1} />
      <Circle radius={radius * 0.12} fill="#86efac" x={-1} y={-1} />
    </Group>
  );
};

const BananaPlantShape = ({ size }: { size: number }) => {
  const radius = size / 2;
  return (
    <Group>
      <Circle radius={radius * 0.85} fill="#052e16" opacity={0.25} x={3} y={4} />
      {[0, 60, 120, 180, 240, 300].map((angleDeg, i) => (
        <Group key={i} rotation={angleDeg}>
          <Path data={`M 0 0 Q ${radius * 0.4} ${-radius * 0.3} ${radius} 0 Q ${radius * 0.4} ${radius * 0.3} 0 0`} fill={i % 2 === 0 ? '#16a34a' : '#22c55e'} stroke="#14532d" strokeWidth={1} />
          <Line points={[0, 0, radius * 0.9, 0]} stroke="#86efac" strokeWidth={1.5} />
        </Group>
      ))}
      <Circle radius={radius * 0.2} fill="#a7f3d0" stroke="#047857" strokeWidth={1} />
    </Group>
  );
};

const MangoPlantShape = ({ size }: { size: number }) => {
  const r = size / 2;
  return (
    <Group>
      <Circle radius={r * 0.95} fill="#022c22" opacity={0.3} x={4} y={5} />
      <Circle radius={r} fill="#14532d" stroke="#052e16" strokeWidth={1.5} />
      <Circle radius={r * 0.65} fill="#15803d" x={-r * 0.25} y={-r * 0.2} />
      <Circle radius={r * 0.6} fill="#16a34a" x={r * 0.25} y={-r * 0.15} />
      <Circle radius={r * 0.55} fill="#22c55e" x={-r * 0.1} y={r * 0.25} />
      <Circle radius={r * 0.35} fill="#4ade80" opacity={0.6} x={-r * 0.2} y={-r * 0.25} />
      <Circle radius={r * 0.15} fill="#bbf7d0" opacity={0.8} x={-r * 0.25} y={-r * 0.3} />
    </Group>
  );
};

const PapayaPlantShape = ({ size }: { size: number }) => {
  const r = size / 2;
  return (
    <Group>
      <Circle radius={r * 0.8} fill="black" opacity={0.2} x={3} y={4} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
        <Group key={i} rotation={ang}>
          <Path data={`M 0 0 L ${r * 0.5} ${-r * 0.2} L ${r} 0 L ${r * 0.5} ${r * 0.2} Z`} fill={i % 2 === 0 ? '#15803d' : '#4ade80'} stroke="#14532d" strokeWidth={1} />
        </Group>
      ))}
      <Circle radius={r * 0.3} fill="#f59e0b" stroke="#b45309" strokeWidth={1} />
      <Circle radius={r * 0.15} fill="#fef08a" />
    </Group>
  );
};

const LemonPlantShape = ({ size }: { size: number }) => {
  const r = size / 2;
  return (
    <Group>
      <Circle radius={r * 0.9} fill="#064e3b" opacity={0.25} x={3} y={4} />
      <Circle radius={r} fill="#166534" stroke="#052e16" strokeWidth={1} />
      <Circle radius={r * 0.7} fill="#15803d" x={-r * 0.15} y={-r * 0.15} />
      <Circle radius={r * 0.4} fill="#22c55e" x={-r * 0.25} y={-r * 0.25} />
      <Circle radius={r * 0.14} fill="#eab308" x={r * 0.35} y={-r * 0.3} />
      <Circle radius={r * 0.14} fill="#facc15" x={-r * 0.4} y={r * 0.2} />
      <Circle radius={r * 0.14} fill="#eab308" x={r * 0.2} y={r * 0.4} />
      <Circle radius={r * 0.12} fill="#facc15" x={-r * 0.1} y={-r * 0.45} />
    </Group>
  );
};

const GuavaPlantShape = ({ size }: { size: number }) => {
  const r = size / 2;
  return (
    <Group>
      <Circle radius={r * 0.9} fill="#022c22" opacity={0.25} x={3} y={4} />
      <Circle radius={r} fill="#047857" stroke="#064e3b" strokeWidth={1} />
      <Circle radius={r * 0.65} fill="#10b981" x={-r * 0.2} y={-r * 0.2} />
      <Circle radius={r * 0.4} fill="#34d399" opacity={0.7} x={-r * 0.3} y={-r * 0.3} />
    </Group>
  );
};

const DragonFruitPlantShape = ({ size }: { size: number }) => {
  const r = size / 2;
  return (
    <Group>
      <Circle radius={r * 0.85} fill="black" opacity={0.2} x={3} y={4} />
      {[0, 72, 144, 216, 288].map((ang, i) => (
        <Group key={i} rotation={ang}>
          <Path data={`M 0 0 Q ${r * 0.5} ${-r * 0.25} ${r} 0 Q ${r * 0.5} ${r * 0.25} 0 0`} fill="#059669" stroke="#047857" strokeWidth={1.5} />
          <Circle radius={r * 0.15} fill="#ec4899" x={r * 0.85} y={0} />
        </Group>
      ))}
      <Circle radius={r * 0.2} fill="#047857" />
    </Group>
  );
};

const Generic3DTreeShape = ({ size, color }: { size: number; color: string }) => {
  const r = size / 2;
  return (
    <Group>
      <Circle radius={r * 0.9} fill="#0f172a" opacity={0.25} x={3} y={4} />
      <Circle radius={r} fill={color || '#15803d'} stroke="#064e3b" strokeWidth={1.5} />
      <Circle radius={r * 0.65} fill="#22c55e" opacity={0.8} x={-r * 0.2} y={-r * 0.2} />
      <Circle radius={r * 0.35} fill="#86efac" opacity={0.6} x={-r * 0.3} y={-r * 0.3} />
    </Group>
  );
};

const PlantVisualRenderer = ({ plantName, imageUrl, size, color }: { plantName?: string; imageUrl?: string; size: number; color: string }) => {
  const [img] = useImage(imageUrl || '', 'anonymous');
  if (img) {
    return (
      <Group>
        <Circle radius={size / 2} fill="#0f172a" opacity={0.2} x={2} y={3} />
        <KonvaImage image={img} x={-size / 2} y={-size / 2} width={size} height={size} />
      </Group>
    );
  }
  const nameLower = (plantName || '').toLowerCase();
  if (nameLower.includes('coconut') || nameLower.includes('palm')) return <CoconutPlantShape size={size} />;
  if (nameLower.includes('banana')) return <BananaPlantShape size={size} />;
  if (nameLower.includes('mango')) return <MangoPlantShape size={size} />;
  if (nameLower.includes('papaya')) return <PapayaPlantShape size={size} />;
  if (nameLower.includes('lemon') || nameLower.includes('citrus') || nameLower.includes('lime')) return <LemonPlantShape size={size} />;
  if (nameLower.includes('guava')) return <GuavaPlantShape size={size} />;
  if (nameLower.includes('dragon')) return <DragonFruitPlantShape size={size} />;
  return <Generic3DTreeShape size={size} color={color} />;
};

const FarmHouseComponent = ({ width, height }: { width: number; height: number }) => (
  <Group>
    <Rect width={width} height={height} fill="#000000" opacity={0.2} x={5} y={6} cornerRadius={4} />
    <Rect width={width + 16} height={height + 16} x={-8} y={-8} fill="#86efac" opacity={0.4} cornerRadius={8} stroke="#4ade80" strokeWidth={1} />
    <Rect width={width} height={height} fill="#f8fafc" stroke="#64748b" strokeWidth={2} cornerRadius={4} />
    <Path data={`M 0 0 L ${width / 2} ${height / 2} L ${width} 0`} fill="#ef4444" stroke="#b91c1c" strokeWidth={2} />
    <Path data={`M 0 ${height} L ${width / 2} ${height / 2} L ${width} ${height}`} fill="#dc2626" stroke="#b91c1c" strokeWidth={2} />
    <Rect width={width * 0.3} height={height * 0.3} x={width * 0.1} y={height * 0.1} fill="#1e40af" stroke="#60a5fa" strokeWidth={1} />
    <Rect width={8} height={8} x={width * 0.75} y={height * 0.15} fill="#475569" />
    <Rect width={12} height={8} x={width / 2 - 6} y={height} fill="#d97706" />
  </Group>
);

const WaterReservoirComponent = ({ width, height }: { width: number; height: number }) => (
  <Group>
    <Circle radius={width / 2} x={width / 2 + 3} y={height / 2 + 3} fill="#000" opacity={0.15} />
    <Circle radius={width / 2 + 4} x={width / 2} y={height / 2} fill="#d97706" opacity={0.6} />
    <Circle radius={width / 2} x={width / 2} y={height / 2} fill="#0284c7" stroke="#0369a1" strokeWidth={2} />
    <Circle radius={width * 0.35} x={width / 2} y={height / 2} stroke="#7dd3fc" strokeWidth={1.5} opacity={0.6} />
    <Circle radius={width * 0.2} x={width / 2} y={height / 2} stroke="#bae6fd" strokeWidth={1} opacity={0.8} />
    <Rect width={12} height={18} x={width / 2 - 6} y={height / 2 - width / 2 - 4} fill="#78350f" stroke="#451a03" strokeWidth={1} />
  </Group>
);

const BeeBoxComponent = ({ width, height }: { width: number; height: number }) => (
  <Group>
    <Rect width={width} height={height} fill="#fbbf24" stroke="#b45309" strokeWidth={2} cornerRadius={3} />
    <Rect width={width * 0.8} height={4} x={width * 0.1} y={height * 0.3} fill="#78350f" />
    <Rect width={width * 0.8} height={4} x={width * 0.1} y={height * 0.6} fill="#78350f" />
    <Circle radius={2} fill="#000" x={width * 0.3} y={-4} />
    <Circle radius={2} fill="#eab308" x={width * 0.6} y={-8} />
  </Group>
);

const MainGateComponent = ({ width, height }: { width: number; height: number }) => (
  <Group>
    <Rect width={12} height={height + 6} x={-6} y={-3} fill="#475569" stroke="#1e293b" strokeWidth={1} cornerRadius={2} />
    <Rect width={12} height={height + 6} x={width - 6} y={-3} fill="#475569" stroke="#1e293b" strokeWidth={1} cornerRadius={2} />
    <Rect width={width} height={height} fill="#f59e0b" stroke="#b45309" strokeWidth={1.5} cornerRadius={2} opacity={0.9} />
    <Line points={[0, height / 2, width, height / 2]} stroke="#78350f" strokeWidth={2} />
  </Group>
);

export default function FarmCanvas() {
  const { farmZones, selectedPlants, landAcres, setFarmZones } = usePlannerStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<FarmZone[][]>([farmZones]);
  const [historyStep, setHistoryStep] = useState(0);

  const plantImageMap = useMemo(() => {
    const map: Record<string, { topDownUrl?: string; visualUrl?: string }> = {};
    selectedPlants.forEach((sp) => {
      if (sp.plant) {
        map[sp.plantId] = {
          topDownUrl: (sp.plant as any).top_down_icon_url || undefined,
          visualUrl: (sp.plant as any).visual_asset_url || undefined,
        };
      }
    });
    return map;
  }, [selectedPlants]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (farmZones.length === 0) autoArrangeFarm();
  }, [landAcres, selectedPlants.length]);

  const saveHistoryWith = (newZones: FarmZone[]) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyStep + 1);
      const next = [...trimmed, JSON.parse(JSON.stringify(newZones))];
      setHistoryStep(next.length - 1);
      return next;
    });
  };

  const autoArrangeFarm = () => {
    const zones: FarmZone[] = [];
    const dim = getFarmDimensionsFt(landAcres);
    const bMargin = 40;
    const bW = CANVAS_W - bMargin * 2;
    const bH = CANVAS_H - bMargin * 2;

    zones.push({
      id: 'boundary', type: 'boundary',
      label: `Land Boundary: ${landAcres} Acres (${dim.widthFt} ft × ${dim.heightFt} ft)`,
      x: bMargin, y: bMargin, width: bW, height: bH, fill: 'rgba(34,197,94,0.05)', area_acres: landAcres, rotation: 0
    });

    const gateW = 60;
    zones.push({ id: 'gate', type: 'entrance', label: 'Main Gate Entrance', x: bMargin + bW / 2 - gateW / 2, y: bMargin + bH - 12, width: gateW, height: 14, fill: '#f59e0b', area_acres: 0, rotation: 0 });

    const roadW = 28;
    const roadX = bMargin + bW / 2 - roadW / 2;
    zones.push({ id: 'road-main', type: 'road', label: 'Main Access Road', x: roadX, y: bMargin + 80, width: roadW, height: bH - 90, fill: '#94a3b8', area_acres: 0, rotation: 0 });

    const pathH = 20;
    const pathY = bMargin + bH / 2;
    zones.push({ id: 'road-internal', type: 'road', label: 'Internal Pathway', x: bMargin + 20, y: pathY, width: bW - 40, height: pathH, fill: '#cbd5e1', area_acres: 0, rotation: 0 });

    const houseW = 90; const houseH = 70;
    zones.push({ id: 'house', type: 'farmhouse', label: 'Farmhouse & Lawn', x: roadX - houseW - 20, y: bMargin + 30, width: houseW, height: houseH, fill: '#8b5e3c', area_acres: 0.05, rotation: 0 });

    const waterSize = 75;
    zones.push({ id: 'water-pond', type: 'water', label: 'Irrigation Pond / Reservoir', x: bMargin + bW - waterSize - 35, y: bMargin + 30, width: waterSize, height: waterSize, fill: '#0284c7', area_acres: 0.08, rotation: 0 });

    zones.push({ id: 'bee-box-zone', type: 'honey_bee_box', label: 'Honey Bee Hives', x: bMargin + bW - 60, y: pathY - 45, width: 40, height: 25, fill: '#fbbf24', area_acres: 0.01, rotation: 0 });

    const plantPlots = [
      { x: bMargin + 35, y: bMargin + 115, w: roadX - bMargin - 60, h: pathY - (bMargin + 130) },
      { x: bMargin + 35, y: pathY + pathH + 25, w: roadX - bMargin - 60, h: bMargin + bH - (pathY + pathH + 45) },
      { x: roadX + roadW + 25, y: bMargin + 115, w: bMargin + bW - (roadX + roadW + 55), h: pathY - (bMargin + 130) },
      { x: roadX + roadW + 25, y: pathY + pathH + 25, w: bMargin + bW - (roadX + roadW + 55), h: bMargin + bH - (pathY + pathH + 45) },
    ];

    const colors = ['#15803d', '#16a34a', '#059669', '#047857', '#0d9488', '#166534'];
    selectedPlants.forEach((sp, idx) => {
      const plot = plantPlots[idx % plantPlots.length];
      const allocatedAcres = Number((((sp.allocationPercentage || 25) / 100) * landAcres).toFixed(2));
      zones.push({
        id: `plant-${sp.plantId}`, type: 'plantation', label: sp.plant.name, plant_id: sp.plantId, plant_name: sp.plant.name,
        spacing: sp.spacing || sp.plant.default_spacing || 15, plantCount: sp.plantCount || 50, plantSize: sp.size || 'M',
        topDownIconUrl: (sp.plant as any).top_down_icon_url || undefined,
        visualAssetUrl: (sp.plant as any).visual_asset_url || undefined,
        x: plot.x, y: plot.y, width: Math.max(160, plot.w), height: Math.max(120, plot.h), fill: colors[idx % colors.length], area_acres: allocatedAcres, rotation: 0
      });
    });

    setFarmZones(zones);
    saveHistoryWith(zones);
  };

  const handleDragEnd = (e: any, id: string) => {
    const updated = farmZones.map((z) => z.id === id ? { ...z, x: Math.round(e.target.x()), y: Math.round(e.target.y()) } : z);
    setFarmZones(updated); saveHistoryWith(updated);
  };

  const handleRotateSelected = () => {
    if (!selectedId) return;
    const updated = farmZones.map((z) => z.id === selectedId ? { ...z, rotation: ((z.rotation || 0) + 90) % 360 } : z);
    setFarmZones(updated); saveHistoryWith(updated);
  };

  const handleScaleSelected = (delta: number) => {
    if (!selectedId || selectedId === 'boundary') return;
    const updated = farmZones.map((z) => {
      if (z.id === selectedId) {
        const newW = Math.max(60, z.width + delta);
        const newH = Math.max(60, z.height + delta * (z.height / z.width));
        return { ...z, width: newW, height: newH };
      }
      return z;
    });
    setFarmZones(updated); saveHistoryWith(updated);
  };

  const handleDeleteSelected = () => {
    if (!selectedId || selectedId === 'boundary') return;
    const updated = farmZones.filter((z) => z.id !== selectedId);
    setFarmZones(updated); setSelectedId(null); saveHistoryWith(updated);
  };

  const handleUndo = () => {
    if (historyStep > 0) { const step = historyStep - 1; setHistoryStep(step); setFarmZones(history[step]); }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) { const step = historyStep + 1; setHistoryStep(step); setFarmZones(history[step]); }
  };

  const handleResetLayout = () => { setSelectedId(null); setFarmZones([]); setTimeout(autoArrangeFarm, 50); };

  const addInfrastructureItem = (type: FarmZone['type'], plant: SelectedPlant | null = null) => {
    const newZone: FarmZone = {
      id: `zone-${Date.now()}`, type, label: plant ? plant.plant.name : type === 'road' ? 'Path' : type === 'farmhouse' ? 'House' : type === 'water' ? 'Water Pond' : type === 'honey_bee_box' ? 'Bee Hives' : 'Open Plot',
      plant_id: plant?.plantId, plant_name: plant?.plant?.name, spacing: plant?.spacing || 15, plantCount: plant?.plantCount || 40, plantSize: plant?.size || 'M',
      x: CANVAS_W / 2 - 60, y: CANVAS_H / 2 - 40, width: type === 'road' ? 24 : type === 'honey_bee_box' ? 36 : 140, height: type === 'road' ? 120 : type === 'honey_bee_box' ? 24 : 100, fill: plant ? '#15803d' : '#94a3b8', area_acres: 0.1, rotation: 0,
    };
    const updated = [...farmZones, newZone]; setFarmZones(updated); setSelectedId(newZone.id); saveHistoryWith(updated);
  };

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (direction === 'reset') { setStageScale(1); setStagePos({ x: 0, y: 0 }); }
    else if (direction === 'in') { setStageScale((prev) => Math.min(2.5, prev + 0.15)); }
    else { setStageScale((prev) => Math.max(0.6, prev - 0.15)); }
  };

  const selectedZone = farmZones.find((z) => z.id === selectedId);
  const dim = getFarmDimensionsFt(landAcres);

  return (
    <div className="flex flex-col gap-3 font-sans">
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-400" />
            <h2 className="text-xl font-bold text-white">Visual Farm Layout Plan</h2>
          </div>
          <p className="text-white/70 text-xs mt-0.5">
            Auto-generated 3D plantation design based on {landAcres} Acres ({dim.widthFt} ft × {dim.heightFt} ft)
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur">
            <span className="text-white/60">Selected Plants: </span>
            <span className="font-bold text-accent-400">{selectedPlants.length} Varieties</span>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur">
            <span className="text-white/60">Total Population: </span>
            <span className="font-bold text-accent-400">{selectedPlants.reduce((sum, p) => sum + (p.plantCount || 0), 0)} Plants</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => addInfrastructureItem('road')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors"><Route className="w-3.5 h-3.5 text-gray-600" /> + Pathway</button>
          <button onClick={() => addInfrastructureItem('farmhouse')} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-semibold text-amber-800 transition-colors"><Home className="w-3.5 h-3.5 text-amber-700" /> + House</button>
          <button onClick={() => addInfrastructureItem('water')} className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 rounded-xl text-xs font-semibold text-sky-800 transition-colors"><Droplets className="w-3.5 h-3.5 text-sky-600" /> + Water Pond</button>
          <button onClick={() => addInfrastructureItem('honey_bee_box')} className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 rounded-xl text-xs font-semibold text-yellow-900 transition-colors"><Box className="w-3.5 h-3.5 text-yellow-700" /> + Bee Hives</button>
          <select onChange={(e) => { if (e.target.value) { const sp = selectedPlants.find((p) => p.plantId === e.target.value); addInfrastructureItem('plantation', sp || null); e.target.value = ''; } }} className="px-3 py-1.5 bg-forest-50 border border-forest-200 text-forest-800 rounded-xl text-xs font-bold outline-none cursor-pointer hover:bg-forest-100 transition-colors">
            <option value="">+ Add Plant Block</option>
            {selectedPlants.map((p) => (<option key={p.plantId} value={p.plantId}>+ {p.plant.name} ({p.size})</option>))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {selectedZone && selectedZone.type !== 'boundary' && (
            <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded-xl mr-2">
              <span className="text-[11px] font-bold text-blue-700 max-w-[100px] truncate">{selectedZone.label}</span>
              <button title="Rotate 90°" onClick={handleRotateSelected} className="p-1 bg-white hover:bg-blue-100 text-blue-700 rounded-lg shadow-xs"><RotateCw className="w-3.5 h-3.5" /></button>
              <button title="Scale Up" onClick={() => handleScaleSelected(20)} className="p-1 bg-white hover:bg-blue-100 text-blue-700 rounded-lg shadow-xs"><Plus className="w-3.5 h-3.5" /></button>
              <button title="Delete Block" onClick={handleDeleteSelected} className="p-1 bg-white hover:bg-red-100 text-red-600 rounded-lg shadow-xs"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
          <div className="flex items-center gap-1 border-l pl-2 border-gray-200">
            <button title="Undo" onClick={handleUndo} disabled={historyStep === 0} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 disabled:opacity-40"><Undo className="w-4 h-4" /></button>
            <button title="Redo" onClick={handleRedo} disabled={historyStep >= history.length - 1} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 disabled:opacity-40"><Redo className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-1 border-l pl-2 border-gray-200">
            <button title="Auto Arrange Layout" onClick={handleResetLayout} className="flex items-center gap-1 px-3 py-1.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"><RefreshCw className="w-3.5 h-3.5" /> Auto Arrange</button>
          </div>
          <div className="flex items-center gap-1 border-l pl-2 border-gray-200">
            <button title="Zoom In" onClick={() => handleZoom('in')} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700"><ZoomIn className="w-4 h-4" /></button>
            <button title="Zoom Out" onClick={() => handleZoom('out')} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700"><ZoomOut className="w-4 h-4" /></button>
            <button title="Fit Screen" onClick={() => handleZoom('reset')} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700"><Maximize2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50/70 border border-emerald-200 px-4 py-2 rounded-xl flex flex-wrap items-center justify-between text-xs text-emerald-900 gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold text-emerald-950 flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-emerald-700" /> Selected Varieties:</span>
          {selectedPlants.map((sp) => {
            const hasCustomImage = !!(plantImageMap[sp.plantId]?.topDownUrl || plantImageMap[sp.plantId]?.visualUrl);
            return (
              <span key={sp.plantId} className="flex items-center gap-1.5 font-medium bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                <span className={`w-2.5 h-2.5 rounded-full ${hasCustomImage ? 'bg-forest-600' : 'bg-emerald-500'}`} />
                {sp.plant.name} ({sp.size}) • {sp.spacing}m spacing
                {hasCustomImage && <span className="text-[10px] bg-forest-100 text-forest-800 px-1 rounded font-bold">Admin Image</span>}
              </span>
            );
          })}
        </div>
        <span className="text-emerald-700 font-medium">💡 Drag any block to customize placement. Movement stays saved.</span>
      </div>

      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex justify-center w-full relative">
        <div className="absolute top-3 left-3 bg-slate-800/80 backdrop-blur text-white px-2.5 py-1 rounded-lg text-xs font-mono z-10 border border-slate-700">Scale: {Math.round(stageScale * 100)}%</div>
        <Stage width={CANVAS_W} height={CANVAS_H} scaleX={stageScale} scaleY={stageScale} x={stagePos.x} y={stagePos.y} draggable onDragEnd={(e) => { if (e.target === e.target.getStage()) setStagePos({ x: e.target.x(), y: e.target.y() }); }} onMouseDown={(e) => { if (e.target === e.target.getStage()) setSelectedId(null); }}>
          <Layer>
            <Rect width={CANVAS_W * 2} height={CANVAS_H * 2} x={-CANVAS_W / 2} y={-CANVAS_H / 2} fill="#0f172a" />
            {Array.from({ length: Math.ceil((CANVAS_W * 2) / GRID_SIZE) }).map((_, i) => (<Line key={`v-${i}`} points={[i * GRID_SIZE, 0, i * GRID_SIZE, CANVAS_H]} stroke="#1e293b" strokeWidth={1} opacity={0.4} />))}
            {Array.from({ length: Math.ceil((CANVAS_H * 2) / GRID_SIZE) }).map((_, i) => (<Line key={`h-${i}`} points={[0, i * GRID_SIZE, CANVAS_W, i * GRID_SIZE]} stroke="#1e293b" strokeWidth={1} opacity={0.4} />))}
            {farmZones.map((zone) => {
              const isSelected = selectedId === zone.id; const isDraggable = zone.type !== 'boundary';
              return (
                <Group key={zone.id} x={zone.x} y={zone.y} rotation={zone.rotation || 0} draggable={isDraggable} onDragEnd={(e) => handleDragEnd(e, zone.id)} onClick={() => setSelectedId(zone.id)} onTap={() => setSelectedId(zone.id)}>
                  {zone.type === 'boundary' && (
                    <Group>
                      <Rect width={zone.width} height={zone.height} fill="#14532d" opacity={0.25} cornerRadius={12} />
                      <Rect width={zone.width} height={zone.height} stroke="#22c55e" strokeWidth={4} dash={[12, 6]} cornerRadius={12} />
                      {[[0, 0], [zone.width, 0], [0, zone.height], [zone.width, zone.height]].map(([cx, cy], i) => (<Circle key={i} x={cx} y={cy} radius={7} fill="#15803d" stroke="#86efac" strokeWidth={2} />))}
                      <Text text={`← ${dim.widthFt} ft →`} x={zone.width / 2 - 60} y={-22} fontSize={13} fill="#86efac" fontStyle="bold" />
                      <Text text={`↑ ${dim.heightFt} ft ↓`} x={zone.width + 10} y={zone.height / 2 - 8} fontSize={13} fill="#86efac" fontStyle="bold" />
                    </Group>
                  )}
                  {zone.type === 'plantation' && (
                    <Group>
                      <Rect width={zone.width} height={zone.height} fill={zone.fill || '#15803d'} opacity={0.2} cornerRadius={8} stroke="#22c55e" strokeWidth={1.5} />
                      {(() => {
                        const spacing = zone.spacing || 15;
                        const plantVisualRadius = Math.min(48, Math.max(26, spacing * 2.2));
                        const cols = Math.max(2, Math.floor(zone.width / (plantVisualRadius * 1.3)));
                        const rows = Math.max(2, Math.floor(zone.height / (plantVisualRadius * 1.3)));
                        const cellW = zone.width / cols; const cellH = zone.height / rows; const totalGridCount = cols * rows;
                        const customImgUrl = zone.topDownIconUrl || zone.visualAssetUrl || (zone.plant_id ? plantImageMap[zone.plant_id]?.topDownUrl : undefined);
                        return (
                          <Group>
                            {Array.from({ length: totalGridCount }).map((_, pIdx) => {
                              const col = pIdx % cols; const row = Math.floor(pIdx / cols);
                              const px = col * cellW + cellW / 2; const py = row * cellH + cellH / 2;
                              return (
                                <Group key={pIdx} x={px} y={py}>
                                  <PlantVisualRenderer plantName={zone.plant_name || zone.label} imageUrl={customImgUrl} size={plantVisualRadius} color={zone.fill || '#15803d'} />
                                </Group>
                              );
                            })}
                          </Group>
                        );
                      })()}
                      {zone.width > 120 && (
                        <Group y={zone.height - 18}>
                          <Line points={[15, 0, zone.width - 15, 0]} stroke="#86efac" strokeWidth={1} dash={[3, 3]} />
                          <Text text={`← ${zone.spacing || 15}m Spacing →`} x={0} y={-12} width={zone.width} align="center" fontSize={10} fill="#86efac" fontStyle="bold" />
                        </Group>
                      )}
                      <Group y={zone.height + 6}>
                        <Rect width={zone.width} height={38} fill="#0f172a" opacity={0.9} cornerRadius={6} stroke="#334155" strokeWidth={1} />
                        <Text text={(zone.plant_name || zone.label).toUpperCase()} x={6} y={4} fontSize={11} fontStyle="bold" fill="#4ade80" />
                        <Text text={`${zone.spacing || 15}m × ${zone.spacing || 15}m • ${zone.plantCount || 50} Plants • ${zone.area_acres || 0.5} Acres`} x={6} y={19} fontSize={10} fill="#cbd5e1" />
                      </Group>
                    </Group>
                  )}
                  {zone.type === 'farmhouse' && (<Group><FarmHouseComponent width={zone.width} height={zone.height} /><Text text={zone.label} y={zone.height + 10} width={zone.width} align="center" fontSize={11} fill="#f8fafc" fontStyle="bold" /></Group>)}
                  {zone.type === 'water' && (<Group><WaterReservoirComponent width={zone.width} height={zone.height} /><Text text={zone.label} y={zone.height + 10} width={zone.width} align="center" fontSize={11} fill="#38bdf8" fontStyle="bold" /></Group>)}
                  {zone.type === 'honey_bee_box' && (<Group><BeeBoxComponent width={zone.width} height={zone.height} /><Text text={zone.label} y={zone.height + 6} width={zone.width} align="center" fontSize={10} fill="#facc15" fontStyle="bold" /></Group>)}
                  {zone.type === 'entrance' && (<Group><MainGateComponent width={zone.width} height={zone.height} /><Text text={zone.label} y={zone.height + 4} width={zone.width} align="center" fontSize={10} fill="#fbbf24" fontStyle="bold" /></Group>)}
                  {zone.type === 'road' && (
                    <Group>
                      <Rect width={zone.width} height={zone.height} fill="#64748b" stroke="#334155" strokeWidth={1} cornerRadius={3} />
                      {zone.height > zone.width ? (<Line points={[zone.width / 2, 0, zone.width / 2, zone.height]} stroke="#fef08a" strokeWidth={2} dash={[8, 6]} />) : (<Line points={[0, zone.height / 2, zone.width, zone.height / 2]} stroke="#fef08a" strokeWidth={2} dash={[8, 6]} />)}
                      <Text text={zone.label} y={zone.height / 2 - 5} width={zone.width} align="center" fontSize={10} fill="#f8fafc" fontStyle="bold" />
                    </Group>
                  )}
                  {isSelected && zone.type !== 'boundary' && (
                    <Group>
                      <Rect x={-4} y={-4} width={zone.width + 8} height={zone.height + (zone.type === 'plantation' ? 48 : 20)} stroke="#38bdf8" strokeWidth={2} dash={[6, 4]} cornerRadius={6} />
                      <Group x={zone.width / 2 - 14} y={-18}><Circle radius={12} fill="#0284c7" stroke="#ffffff" strokeWidth={1.5} /><Path data="M-4 0 L4 0 M0 -4 L0 4" stroke="#ffffff" strokeWidth={2} /></Group>
                    </Group>
                  )}
                </Group>
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

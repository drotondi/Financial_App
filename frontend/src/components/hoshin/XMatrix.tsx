import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  StrategicObjective,
  AnnualObjective,
  HoshinProgram,
  HoshinKPI,
  Correlation,
  CorrelationStrength,
} from '../../api/hoshin'
import { hoshinApi } from '../../api/hoshin'
import XMatrixCell from './XMatrixCell'
import CorrelationPicker from './CorrelationPicker'
import Button from '../ui/Button'

// ── helpers ──────────────────────────────────────────────────────────────────

function findCorrelation(
  correlations: Correlation[],
  typeA: string,
  idA: number,
  typeB: string,
  idB: number,
): Correlation | undefined {
  return correlations.find(
    (c) =>
      (c.element_a_type === typeA && c.element_a_id === idA && c.element_b_type === typeB && c.element_b_id === idB) ||
      (c.element_a_type === typeB && c.element_a_id === idB && c.element_b_type === typeA && c.element_b_id === idA),
  )
}

// ── component ─────────────────────────────────────────────────────────────────

interface XMatrixProps {
  strategicObjs: StrategicObjective[]
  annualObjs: AnnualObjective[]
  programs: HoshinProgram[]
  kpis: HoshinKPI[]
  correlations: Correlation[]
  onAddStrategic: () => void
  onAddAnnual: () => void
  onAddProgram: () => void
  onAddKPI: () => void
  onEditStrategic: (obj: StrategicObjective) => void
  onEditAnnual: (obj: AnnualObjective) => void
  onEditProgram: (obj: HoshinProgram) => void
  onEditKPI: (obj: HoshinKPI) => void
  onDeleteStrategic: (id: number) => void
  onDeleteAnnual: (id: number) => void
  onDeleteProgram: (id: number) => void
  onDeleteKPI: (id: number) => void
}

interface PickerState {
  typeA: string
  idA: number
  typeB: string
  idB: number
  anchorRect: DOMRect
}

const CELL_SIZE = 36 // px
const LABEL_W = 180 // px
const HEADER_H = 180 // px for rotated program labels

export default function XMatrix({
  strategicObjs,
  annualObjs,
  programs,
  kpis,
  correlations,
  onAddStrategic,
  onAddAnnual,
  onAddProgram,
  onAddKPI,
  onEditStrategic,
  onEditAnnual,
  onEditProgram,
  onEditKPI,
  onDeleteStrategic,
  onDeleteAnnual,
  onDeleteProgram,
  onDeleteKPI,
}: XMatrixProps) {
  const qc = useQueryClient()
  const [picker, setPicker] = useState<PickerState | null>(null)
  const [hoveredType, setHoveredType] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const upsertMutation = useMutation({
    mutationFn: hoshinApi.setCorrelation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }),
  })
  const deleteMutation = useMutation({
    mutationFn: hoshinApi.deleteCorrelation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hoshin-matrix'] }),
  })

  function openPicker(e: React.MouseEvent, typeA: string, idA: number, typeB: string, idB: number) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setPicker({ typeA, idA, typeB, idB, anchorRect: rect })
  }

  function handleSelect(strength: CorrelationStrength | null) {
    if (!picker) return
    if (strength === null) {
      deleteMutation.mutate({
        element_a_type: picker.typeA,
        element_a_id: picker.idA,
        element_b_type: picker.typeB,
        element_b_id: picker.idB,
      })
    } else {
      upsertMutation.mutate({
        element_a_type: picker.typeA,
        element_a_id: picker.idA,
        element_b_type: picker.typeB,
        element_b_id: picker.idB,
        strength,
      })
    }
    setPicker(null)
  }

  function isHighlighted(typeA: string, idA: number, typeB: string, idB: number) {
    if (!hoveredType || !hoveredId) return false
    return (
      (hoveredType === typeA && hoveredId === idA) ||
      (hoveredType === typeB && hoveredId === idB)
    )
  }

  const nP = programs.length
  const nK = kpis.length
  const nA = annualObjs.length
  const nS = strategicObjs.length

  // Grid columns: [label-left] [programs...] [kpis...] [label-right]
  // Grid rows: [program-headers] [annual rows...] [strategic rows...]
  const totalCols = 1 + nP + nK + 1
  const totalRows = 1 + nA + nS

  // helper: 1-based CSS grid position
  const progColStart = 2
  const kpiColStart = 2 + nP
  const rightLabelCol = 2 + nP + nK
  const annualRowStart = 2
  const strategicRowStart = 2 + nA

  const isEmpty = nP === 0 && nA === 0 && nS === 0 && nK === 0

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-zinc-500">
        <p className="text-lg font-medium">La matriz está vacía</p>
        <p className="text-sm text-zinc-400 text-center max-w-md">
          Empezá agregando Objetivos Estratégicos, Objetivos Anuales, Programas y KPIs. Luego podrás
          trazar las correlaciones entre ellos.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={onAddStrategic}>+ Obj. Estratégico</Button>
          <Button variant="ghost" onClick={onAddAnnual}>+ Obj. Anual</Button>
          <Button variant="ghost" onClick={onAddProgram}>+ Programa</Button>
          <Button variant="ghost" onClick={onAddKPI}>+ KPI</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Add buttons toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button size="sm" onClick={onAddStrategic}>+ Obj. Estratégico</Button>
        <Button size="sm" variant="ghost" onClick={onAddAnnual}>+ Obj. Anual</Button>
        <Button size="sm" variant="ghost" onClick={onAddProgram}>+ Programa</Button>
        <Button size="sm" variant="ghost" onClick={onAddKPI}>+ KPI</Button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-zinc-500">
        <span className="font-medium text-zinc-600">Correlación:</span>
        <span className="text-indigo-600 font-bold">◎ Fuerte</span>
        <span className="text-sky-500">○ Media</span>
        <span className="text-zinc-400">△ Débil</span>
      </div>

      {/* Scrollable matrix */}
      <div className="overflow-auto rounded-xl border border-zinc-200 shadow-sm">
        <div
          className="relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `${LABEL_W}px repeat(${nP}, ${CELL_SIZE}px) repeat(${nK}, ${CELL_SIZE}px) ${LABEL_W}px`,
            gridTemplateRows: `${HEADER_H}px repeat(${nA}, ${CELL_SIZE}px) repeat(${nS}, ${CELL_SIZE}px)`,
            minWidth: LABEL_W * 2 + (nP + nK) * CELL_SIZE,
          }}
        >

          {/* ── TOP-LEFT corner: empty ────────────────────────────────────── */}
          <div
            style={{ gridColumn: 1, gridRow: 1 }}
            className="bg-zinc-100 flex items-end justify-end p-2 border-r border-b border-zinc-200"
          >
            <span className="text-[10px] text-zinc-400 font-medium text-right leading-tight">
              Obj. Anuales<br />↕ Programas
            </span>
          </div>

          {/* ── Program headers (rotated, top) ───────────────────────────── */}
          {programs.map((prog, pi) => (
            <div
              key={`ph-${prog.id}`}
              style={{ gridColumn: progColStart + pi, gridRow: 1 }}
              className="relative overflow-hidden border-r border-b border-zinc-200 bg-zinc-50"
              title={prog.title}
              onMouseEnter={() => { setHoveredType('program'); setHoveredId(prog.id) }}
              onMouseLeave={() => { setHoveredType(null); setHoveredId(null) }}
            >
              <div
                className={`
                  absolute bottom-0 left-0 right-0 px-2 py-1 group
                  flex flex-col items-center justify-end
                  transition-colors cursor-default
                  ${hoveredType === 'program' && hoveredId === prog.id ? 'bg-indigo-50' : ''}
                `}
                style={{ height: HEADER_H }}
              >
                <div
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    maxHeight: HEADER_H - 24,
                    overflow: 'hidden',
                  }}
                  className="text-xs font-medium text-zinc-700 leading-tight"
                >
                  {prog.title}
                </div>
                <div className="flex gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEditProgram(prog)} className="text-[10px] text-zinc-400 hover:text-indigo-600">✎</button>
                  <button onClick={() => onDeleteProgram(prog.id)} className="text-[10px] text-zinc-400 hover:text-rose-600">×</button>
                </div>
              </div>
            </div>
          ))}

          {/* ── KPI headers (rotated, top) ────────────────────────────────── */}
          {kpis.map((kpi, ki) => (
            <div
              key={`kh-${kpi.id}`}
              style={{ gridColumn: kpiColStart + ki, gridRow: 1 }}
              className="relative overflow-hidden border-r border-b border-zinc-200 bg-indigo-50"
              title={kpi.title}
              onMouseEnter={() => { setHoveredType('kpi'); setHoveredId(kpi.id) }}
              onMouseLeave={() => { setHoveredType(null); setHoveredId(null) }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 px-2 py-1 group flex flex-col items-center justify-end"
                style={{ height: HEADER_H }}
              >
                <div
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    maxHeight: HEADER_H - 24,
                    overflow: 'hidden',
                  }}
                  className="text-xs font-medium text-indigo-700 leading-tight"
                >
                  {kpi.title}
                </div>
                <div className="flex gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEditKPI(kpi)} className="text-[10px] text-indigo-400 hover:text-indigo-700">✎</button>
                  <button onClick={() => onDeleteKPI(kpi.id)} className="text-[10px] text-indigo-400 hover:text-rose-600">×</button>
                </div>
              </div>
            </div>
          ))}

          {/* ── TOP-RIGHT corner: KPI section header ──────────────────────── */}
          <div
            style={{ gridColumn: rightLabelCol, gridRow: 1 }}
            className="bg-indigo-100 flex items-end justify-start p-2 border-b border-zinc-200"
          >
            <span className="text-[10px] text-indigo-600 font-medium leading-tight">
              KPIs<br />↕ Programas
            </span>
          </div>

          {/* ── Annual objective rows ─────────────────────────────────────── */}
          {annualObjs.map((ao, ai) => (
            <>
              {/* Left label */}
              <div
                key={`al-${ao.id}`}
                style={{ gridColumn: 1, gridRow: annualRowStart + ai }}
                className="flex items-center border-r border-b border-zinc-200 bg-zinc-50 group px-2 gap-1.5 cursor-default"
                onMouseEnter={() => { setHoveredType('annual'); setHoveredId(ao.id) }}
                onMouseLeave={() => { setHoveredType(null); setHoveredId(null) }}
              >
                {ao.color && (
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ao.color }} />
                )}
                <span
                  className={`flex-1 text-xs font-medium leading-tight truncate
                    ${hoveredType === 'annual' && hoveredId === ao.id ? 'text-indigo-700' : 'text-zinc-700'}
                  `}
                  title={ao.title}
                >
                  {ao.title}
                </span>
                <span className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => onEditAnnual(ao)} className="text-[10px] text-zinc-400 hover:text-indigo-600">✎</button>
                  <button onClick={() => onDeleteAnnual(ao.id)} className="text-[10px] text-zinc-400 hover:text-rose-600">×</button>
                </span>
              </div>

              {/* TOP-LEFT quadrant: Annual ↔ Program cells */}
              {programs.map((prog, pi) => {
                const corr = findCorrelation(correlations, 'program', prog.id, 'annual', ao.id)
                const hl = isHighlighted('program', prog.id, 'annual', ao.id)
                return (
                  <div
                    key={`ap-${ao.id}-${prog.id}`}
                    style={{ gridColumn: progColStart + pi, gridRow: annualRowStart + ai }}
                    className="relative"
                    onClick={(e) => openPicker(e, 'program', prog.id, 'annual', ao.id)}
                  >
                    <XMatrixCell strength={corr?.strength} highlighted={hl} onClick={() => {}} />
                    {picker?.typeA === 'program' && picker?.idA === prog.id && picker?.typeB === 'annual' && picker?.idB === ao.id && (
                      <div className="absolute top-full left-0 z-50">
                        <CorrelationPicker
                          current={corr?.strength}
                          onSelect={handleSelect}
                          onClose={() => setPicker(null)}
                        />
                      </div>
                    )}
                  </div>
                )
              })}

              {/* TOP-RIGHT quadrant: KPI ↔ Annual — not a valid pair; show as disabled */}
              {kpis.map((kpi, ki) => (
                <div
                  key={`ak-${ao.id}-${kpi.id}`}
                  style={{ gridColumn: kpiColStart + ki, gridRow: annualRowStart + ai }}
                  className="bg-zinc-50 border border-zinc-100"
                />
              ))}

              {/* Right label: empty for annual rows */}
              <div
                key={`ar-${ao.id}`}
                style={{ gridColumn: rightLabelCol, gridRow: annualRowStart + ai }}
                className="border-b border-l border-zinc-200 bg-zinc-50"
              />
            </>
          ))}

          {/* ── Strategic objective rows ───────────────────────────────────── */}
          {strategicObjs.map((so, si) => (
            <>
              {/* Left label */}
              <div
                key={`sl-${so.id}`}
                style={{ gridColumn: 1, gridRow: strategicRowStart + si }}
                className="flex items-center border-r border-b border-zinc-200 bg-amber-50 group px-2 gap-1.5 cursor-default"
                onMouseEnter={() => { setHoveredType('strategic'); setHoveredId(so.id) }}
                onMouseLeave={() => { setHoveredType(null); setHoveredId(null) }}
              >
                {so.color && (
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: so.color }} />
                )}
                <span
                  className={`flex-1 text-xs font-semibold leading-tight truncate
                    ${hoveredType === 'strategic' && hoveredId === so.id ? 'text-amber-700' : 'text-amber-800'}
                  `}
                  title={`${so.title} (${so.time_horizon_years}a)`}
                >
                  {so.title}
                </span>
                <span className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => onEditStrategic(so)} className="text-[10px] text-amber-400 hover:text-amber-700">✎</button>
                  <button onClick={() => onDeleteStrategic(so.id)} className="text-[10px] text-amber-400 hover:text-rose-600">×</button>
                </span>
              </div>

              {/* BOTTOM-LEFT quadrant: Annual ↔ Strategic — not valid (annual lives in rows above) */}
              {/* We show disabled cells here representing strategic alignment with programs */}
              {programs.map((_prog, pi) => (
                <div
                  key={`sp-${so.id}-${_prog.id}`}
                  style={{ gridColumn: progColStart + pi, gridRow: strategicRowStart + si }}
                  className="bg-amber-50 border border-amber-100"
                />
              ))}

              {/* BOTTOM-RIGHT quadrant: Strategic ↔ KPI cells */}
              {kpis.map((kpi, ki) => {
                const corr = findCorrelation(correlations, 'strategic', so.id, 'kpi', kpi.id)
                const hl = isHighlighted('strategic', so.id, 'kpi', kpi.id)
                return (
                  <div
                    key={`sk-${so.id}-${kpi.id}`}
                    style={{ gridColumn: kpiColStart + ki, gridRow: strategicRowStart + si }}
                    className="relative"
                    onClick={(e) => openPicker(e, 'strategic', so.id, 'kpi', kpi.id)}
                  >
                    <XMatrixCell strength={corr?.strength} highlighted={hl} onClick={() => {}} />
                    {picker?.typeA === 'strategic' && picker?.idA === so.id && picker?.typeB === 'kpi' && picker?.idB === kpi.id && (
                      <div className="absolute top-full left-0 z-50">
                        <CorrelationPicker
                          current={corr?.strength}
                          onSelect={handleSelect}
                          onClose={() => setPicker(null)}
                        />
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Right: strategic objective label */}
              <div
                key={`sr-${so.id}`}
                style={{ gridColumn: rightLabelCol, gridRow: strategicRowStart + si }}
                className="flex items-center border-b border-l border-zinc-200 bg-amber-50 px-2"
              >
                <span className="text-xs font-semibold text-amber-800 truncate" title={so.title}>
                  {so.title}
                </span>
              </div>
            </>
          ))}
        </div>

        {/* ── KPI ↔ Program section (below the main grid as a separate table) ── */}
        {nP > 0 && nK > 0 && (
          <div className="border-t border-zinc-300">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `${LABEL_W}px repeat(${nP}, ${CELL_SIZE}px) repeat(${nK}, ${CELL_SIZE}px) ${LABEL_W}px`,
              }}
            >
              {/* Header row */}
              <div className="bg-indigo-100 border-r border-b border-zinc-200 px-2 py-1 flex items-center">
                <span className="text-[10px] text-indigo-600 font-semibold">KPI ↔ Programa</span>
              </div>
              {programs.map((p) => (
                <div
                  key={`kp-ph-${p.id}`}
                  className="bg-zinc-50 border-r border-b border-zinc-200 px-1 py-1 flex items-center justify-center"
                  onMouseEnter={() => { setHoveredType('program'); setHoveredId(p.id) }}
                  onMouseLeave={() => { setHoveredType(null); setHoveredId(null) }}
                >
                  <span
                    className={`text-[9px] font-medium truncate transition-colors
                      ${hoveredType === 'program' && hoveredId === p.id ? 'text-indigo-600' : 'text-zinc-500'}
                    `}
                    title={p.title}
                  />
                </div>
              ))}
              {kpis.map((k) => (
                <div key={`kp-kh-${k.id}`} className="bg-indigo-50 border-r border-b border-zinc-200" />
              ))}
              <div className="bg-indigo-100 border-b border-zinc-200" />

              {/* KPI rows */}
              {kpis.map((kpi) => (
                <>
                  <div
                    key={`kpi-label-${kpi.id}`}
                    style={{ gridColumn: 1 }}
                    className="flex items-center border-r border-b border-zinc-200 bg-indigo-50 group px-2 gap-1.5"
                    onMouseEnter={() => { setHoveredType('kpi'); setHoveredId(kpi.id) }}
                    onMouseLeave={() => { setHoveredType(null); setHoveredId(null) }}
                  >
                    <span className="flex-1 text-xs font-medium text-indigo-700 truncate leading-tight" title={kpi.title}>
                      {kpi.title}
                    </span>
                    {kpi.target_value != null && (
                      <span className="text-[10px] text-indigo-400 flex-shrink-0">
                        {kpi.current_value ?? 0}/{kpi.target_value}{kpi.unit ?? ''}
                      </span>
                    )}
                  </div>

                  {programs.map((prog, pi) => {
                    const corr = findCorrelation(correlations, 'kpi', kpi.id, 'program', prog.id)
                    const hl = isHighlighted('kpi', kpi.id, 'program', prog.id)
                    return (
                      <div
                        key={`kp-${kpi.id}-${prog.id}`}
                        style={{ gridColumn: progColStart + pi }}
                        className="relative border-b border-r border-zinc-200"
                        onClick={(e) => openPicker(e, 'kpi', kpi.id, 'program', prog.id)}
                      >
                        <XMatrixCell strength={corr?.strength} highlighted={hl} onClick={() => {}} />
                        {picker?.typeA === 'kpi' && picker?.idA === kpi.id && picker?.typeB === 'program' && picker?.idB === prog.id && (
                          <div className="absolute top-full left-0 z-50">
                            <CorrelationPicker
                              current={corr?.strength}
                              onSelect={handleSelect}
                              onClose={() => setPicker(null)}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {kpis.map((_, ki) => (
                    <div key={`kk-${kpi.id}-${ki}`} style={{ gridColumn: kpiColStart + ki }} className="bg-indigo-50 border-b border-r border-zinc-100" />
                  ))}

                  <div style={{ gridColumn: rightLabelCol }} className="border-b border-l border-zinc-200 bg-indigo-50 px-2 flex items-center">
                    <span className="text-[10px] text-indigo-500 truncate" title={kpi.title}>{kpi.title}</span>
                  </div>
                </>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Annual ↔ Strategic correlation section */}
      {nA > 0 && nS > 0 && (
        <div className="mt-6 rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="bg-amber-50 px-4 py-2 border-b border-zinc-200">
            <span className="text-xs font-semibold text-amber-700">Objetivos Anuales ↔ Objetivos Estratégicos</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `${LABEL_W}px repeat(${nS}, ${CELL_SIZE}px)`,
            }}
          >
            {/* Header */}
            <div className="bg-zinc-50 border-r border-b border-zinc-200 px-2 py-1 text-[10px] text-zinc-400">Obj. Anual / Estratégico</div>
            {strategicObjs.map((so) => (
              <div key={`ash-${so.id}`} className="bg-amber-50 border-r border-b border-zinc-200 px-1 flex items-center justify-center" title={so.title}>
                <span className="text-[9px] font-semibold text-amber-700 truncate">{so.title.slice(0, 8)}</span>
              </div>
            ))}

            {/* Rows */}
            {annualObjs.map((ao) => (
              <>
                <div key={`asl-${ao.id}`} className="flex items-center border-r border-b border-zinc-200 bg-zinc-50 px-2 gap-1.5">
                  {ao.color && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ao.color }} />}
                  <span className="text-xs text-zinc-700 truncate" title={ao.title}>{ao.title}</span>
                </div>
                {strategicObjs.map((so) => {
                  const corr = findCorrelation(correlations, 'annual', ao.id, 'strategic', so.id)
                  const hl = isHighlighted('annual', ao.id, 'strategic', so.id)
                  return (
                    <div
                      key={`as-${ao.id}-${so.id}`}
                      className="relative border-b border-r border-zinc-200"
                      onClick={(e) => openPicker(e, 'annual', ao.id, 'strategic', so.id)}
                    >
                      <XMatrixCell strength={corr?.strength} highlighted={hl} onClick={() => {}} />
                      {picker?.typeA === 'annual' && picker?.idA === ao.id && picker?.typeB === 'strategic' && picker?.idB === so.id && (
                        <div className="absolute top-full left-0 z-50">
                          <CorrelationPicker
                            current={corr?.strength}
                            onSelect={handleSelect}
                            onClose={() => setPicker(null)}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

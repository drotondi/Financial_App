import type { CorrelationStrength } from '../../api/hoshin'

interface CorrelationPickerProps {
  current?: CorrelationStrength
  onSelect: (strength: CorrelationStrength | null) => void
  onClose: () => void
}

const OPTIONS: { value: CorrelationStrength; symbol: string; label: string; color: string }[] = [
  { value: 'strong', symbol: '◎', label: 'Fuerte', color: 'text-indigo-600 hover:bg-indigo-50' },
  { value: 'medium', symbol: '○', label: 'Media', color: 'text-sky-500 hover:bg-sky-50' },
  { value: 'weak', symbol: '△', label: 'Débil', color: 'text-zinc-500 hover:bg-zinc-50' },
]

export default function CorrelationPicker({ current, onSelect, onClose }: CorrelationPickerProps) {
  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute z-50 bg-white rounded-xl shadow-xl border border-zinc-200 p-1 min-w-[160px]">
        <p className="text-xs text-zinc-400 px-3 pt-2 pb-1 font-medium uppercase tracking-wide">
          Correlación
        </p>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { onSelect(opt.value); onClose() }}
            className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-sm transition-colors ${opt.color} ${current === opt.value ? 'font-semibold' : ''}`}
          >
            <span className="text-base w-5 text-center">{opt.symbol}</span>
            {opt.label}
            {current === opt.value && <span className="ml-auto text-xs">✓</span>}
          </button>
        ))}
        {current && (
          <>
            <div className="border-t border-zinc-100 my-1" />
            <button
              onClick={() => { onSelect(null); onClose() }}
              className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-sm text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <span className="text-base w-5 text-center">✕</span>
              Quitar
            </button>
          </>
        )}
      </div>
    </>
  )
}

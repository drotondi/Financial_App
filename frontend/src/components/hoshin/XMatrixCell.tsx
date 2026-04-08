import type { CorrelationStrength } from '../../api/hoshin'

const SYMBOLS: Record<CorrelationStrength, string> = {
  strong: '◎',
  medium: '○',
  weak: '△',
}

const SYMBOL_COLORS: Record<CorrelationStrength, string> = {
  strong: 'text-indigo-600 font-bold',
  medium: 'text-sky-500',
  weak: 'text-zinc-400',
}

interface XMatrixCellProps {
  strength?: CorrelationStrength
  highlighted?: boolean
  onClick?: () => void
}

export default function XMatrixCell({ strength, highlighted, onClick }: XMatrixCellProps) {
  return (
    <div
      onClick={onClick}
      title={strength ? `Correlación: ${strength}` : 'Sin correlación — click para agregar'}
      className={`
        w-full h-full flex items-center justify-center border border-zinc-200 cursor-pointer
        select-none transition-colors text-sm
        ${highlighted ? 'bg-indigo-50' : 'bg-white hover:bg-zinc-50'}
        ${onClick ? 'hover:border-indigo-300' : ''}
      `}
    >
      {strength && (
        <span className={`leading-none ${SYMBOL_COLORS[strength]}`}>
          {SYMBOLS[strength]}
        </span>
      )}
    </div>
  )
}

interface XMatrixLabelProps {
  text: string
  rotated?: boolean
  color?: string | null
  onEdit?: () => void
  onDelete?: () => void
  highlighted?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export default function XMatrixLabel({
  text,
  rotated,
  color,
  onEdit,
  onDelete,
  highlighted,
  onMouseEnter,
  onMouseLeave,
}: XMatrixLabelProps) {
  const dot = color ? (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: color }}
    />
  ) : null

  const inner = (
    <div
      className={`
        group flex items-center gap-1.5 w-full h-full px-2 text-xs font-medium
        border border-zinc-200 transition-colors select-none
        ${highlighted ? 'bg-indigo-50 text-indigo-700' : 'bg-zinc-50 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700'}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {dot}
      <span className="flex-1 truncate leading-tight">{text}</span>
      {(onEdit || onDelete) && (
        <span className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 flex-shrink-0">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit() }}
              className="hover:text-indigo-600 leading-none"
              title="Editar"
            >
              ✎
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="hover:text-rose-600 leading-none"
              title="Eliminar"
            >
              ×
            </button>
          )}
        </span>
      )}
    </div>
  )

  if (!rotated) return inner

  return (
    <div className="w-full h-full overflow-hidden">
      <div
        className="origin-bottom-left absolute"
        style={{
          transform: 'rotate(-90deg) translateX(-100%)',
          width: 'var(--label-height)',
          height: 'var(--label-width)',
        }}
      >
        {inner}
      </div>
    </div>
  )
}

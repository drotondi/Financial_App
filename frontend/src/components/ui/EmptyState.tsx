interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
        <span className="text-zinc-400 text-xl">○</span>
      </div>
      <h3 className="text-sm font-semibold text-zinc-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-zinc-500 mb-4">{description}</p>}
      {action}
    </div>
  )
}

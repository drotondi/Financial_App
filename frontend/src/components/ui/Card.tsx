interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-zinc-200 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

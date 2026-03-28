const COLORS: Record<string, string> = {
  cash: 'bg-emerald-100 text-emerald-700',
  stock: 'bg-indigo-100 text-indigo-700',
  crypto: 'bg-amber-100 text-amber-700',
  real_estate: 'bg-sky-100 text-sky-700',
  fixed_income: 'bg-violet-100 text-violet-700',
  other: 'bg-zinc-100 text-zinc-600',
  mortgage: 'bg-rose-100 text-rose-700',
  car_loan: 'bg-orange-100 text-orange-700',
  credit_card: 'bg-pink-100 text-pink-700',
  personal_loan: 'bg-yellow-100 text-yellow-700',
  student_loan: 'bg-teal-100 text-teal-700',
  income: 'bg-emerald-100 text-emerald-700',
  expense: 'bg-rose-100 text-rose-700',
  buy: 'bg-indigo-100 text-indigo-700',
  sell: 'bg-amber-100 text-amber-700',
  payment: 'bg-orange-100 text-orange-700',
  transfer: 'bg-sky-100 text-sky-700',
}

interface BadgeProps {
  value: string
  label?: string
}

export default function Badge({ value, label }: BadgeProps) {
  const color = COLORS[value] ?? 'bg-zinc-100 text-zinc-600'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${color}`}>
      {label ?? value}
    </span>
  )
}

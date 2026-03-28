import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-zinc-700">{label}</label>}
    <input
      ref={ref}
      className={`w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-zinc-50 disabled:text-zinc-500 ${error ? 'border-rose-400' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-rose-600">{error}</p>}
  </div>
))

Input.displayName = 'Input'
export default Input

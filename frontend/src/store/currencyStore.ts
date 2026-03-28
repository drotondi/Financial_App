import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ExchangeRate {
  id: number
  from_currency: string
  to_currency: string
  rate: number
  label: string | null
}

interface CurrencyState {
  displayCurrency: string
  rates: ExchangeRate[]
  setDisplayCurrency: (currency: string) => void
  setRates: (rates: ExchangeRate[]) => void
  convert: (amount: number, fromCurrency: string) => number | null
}

export const CURRENCIES = ['USD', 'EUR', 'ARS', 'GBP', 'BRL', 'MXN', 'CLP', 'COP', 'PEN', 'UYU', 'CAD', 'CHF', 'JPY', 'CNY']

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      displayCurrency: 'USD',
      rates: [],
      setDisplayCurrency: (currency) => set({ displayCurrency: currency }),
      setRates: (rates) => set({ rates }),
      convert: (amount, fromCurrency) => {
        const { displayCurrency, rates } = get()
        if (fromCurrency === displayCurrency) return amount

        // Build rate map
        const rateMap = new Map<string, number>()
        for (const r of rates) {
          const key = `${r.from_currency}:${r.to_currency}`
          if (!rateMap.has(key)) rateMap.set(key, r.rate)
          const invKey = `${r.to_currency}:${r.from_currency}`
          if (!rateMap.has(invKey) && r.rate !== 0) rateMap.set(invKey, 1 / r.rate)
        }

        // Direct conversion
        const direct = rateMap.get(`${fromCurrency}:${displayCurrency}`)
        if (direct !== undefined) return amount * direct

        // Via USD pivot
        const toUsd = rateMap.get(`${fromCurrency}:USD`)
        const fromUsd = rateMap.get(`USD:${displayCurrency}`)
        if (toUsd !== undefined && fromUsd !== undefined) return amount * toUsd * fromUsd

        // Same currency (no conversion needed)
        if (fromCurrency === displayCurrency) return amount

        return null
      },
    }),
    { name: 'wealth_currency' },
  ),
)

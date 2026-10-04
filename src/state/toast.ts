import { createContext, useContext } from 'react'

export interface ToastOptions {
  title: string
  description?: string
  action?: { label: string; to: string }
  tone?: 'neutral' | 'success'
}

export const ToastContext = createContext<((toast: ToastOptions) => void) | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast precisa estar dentro de <ToastProvider>.')
  return context
}

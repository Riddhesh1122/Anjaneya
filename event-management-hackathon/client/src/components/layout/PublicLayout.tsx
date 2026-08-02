import type { ReactNode } from 'react'

type PublicLayoutProps = {
  children: ReactNode
  footer?: ReactNode
}

export function PublicLayout({ children, footer }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white antialiased relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-zinc-950 to-black" />
      {children}
      <footer className="max-w-7xl mx-auto px-4 py-8 text-xs text-white/50">
        {footer ?? '© 2026 EventHub — Built for Hackathon'}
      </footer>
    </div>
  )
}

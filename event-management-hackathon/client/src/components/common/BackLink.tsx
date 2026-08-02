import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type BackLinkProps = {
  to: string
  children: ReactNode
}

export function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link to={to} className="flex items-center gap-2 mx-auto">
      <span className="text-base">←</span>
      {children}
    </Link>
  )
}

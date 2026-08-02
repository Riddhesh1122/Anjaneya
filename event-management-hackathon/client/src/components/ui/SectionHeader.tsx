import type { ReactNode } from 'react'

type SectionHeaderProps = {
  title: string
  action?: ReactNode
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-bold text-white">{title}</h4>
      {action ?? <span className="text-sm text-white/60">See all</span>}
    </div>
  )
}

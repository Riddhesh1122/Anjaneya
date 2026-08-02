import { MapPin } from 'lucide-react'

type LocationBadgeProps = {
  label: string
}

export function LocationBadge({ label }: LocationBadgeProps) {
  return (
    <button className="flex items-center gap-2 text-sm text-white/90 bg-white/3 backdrop-blur rounded-full px-3 py-2 border border-white/5">
      <MapPin className="w-4 h-4 text-white/80" />
      <span className="text-xs">{label}</span>
    </button>
  )
}

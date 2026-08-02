import type { AuthRole } from '../../../types/auth'

type RoleTabsProps = {
  role: AuthRole
  onChange: (role: AuthRole) => void
}

export function RoleTabs({ role, onChange }: RoleTabsProps) {
  const roles: Array<{ value: AuthRole; label: string }> = [
    { value: 'attendee', label: 'Attendee' },
    { value: 'organizer', label: 'Organizer' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'attendee', label: 'Attendee' },
    { value: 'admin', label: 'Admin' },
  ]

  return (
    <div className="flex gap-2 bg-white/3 p-1 rounded-xl mb-5">
      {roles.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
            role === item.value
              ? 'bg-gradient-to-r from-neonPurple to-neonPink text-white shadow-[0_8px_30px_rgba(139,92,246,0.12)]'
              : 'text-white/80'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

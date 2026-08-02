import { Link } from 'react-router-dom'
import { Search, User, Ticket, PlusCircle, LogOut } from 'lucide-react'
import { BrandMark } from '../../../components/common/BrandMark'
import { SearchInput } from '../../../components/ui/SearchInput'
import { LocationBadge } from '../../../components/ui/LocationBadge'
import { PATHS } from '../../../constants/appRoutes'
import { useAuth } from '../../../contexts/AuthContext'

export function HomeHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="w-full bg-transparent py-4 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        <BrandMark />

        <div className="flex-1 max-w-xl mx-4">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm">
            <Search className="w-4 h-4 text-white/70" />
            <SearchInput ariaLabel="Search events" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LocationBadge label="Campus" />

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={PATHS.TICKETS}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white/10 hover:bg-white/20 text-white transition"
              >
                <Ticket className="w-3.5 h-3.5 text-pink-400" />
                My Tickets
              </Link>

              {(user.role === 'organizer' || user.role === 'admin') && (
                <Link
                  to={PATHS.CREATE_EVENT}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 text-purple-200 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  + Create Event
                </Link>
              )}

              <span className="text-xs text-white/80 font-medium px-2 py-1 rounded-md bg-white/5">
                {user.name}
              </span>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 rounded-full bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-300 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to={PATHS.AUTH}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium shadow-md hover:scale-105 transition"
            >
              <User className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

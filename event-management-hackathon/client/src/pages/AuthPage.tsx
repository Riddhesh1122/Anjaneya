import { AuthLayout } from '../components/layout/AuthLayout'
import { BackLink } from '../components/common/BackLink'
import { AuthCard } from '../features/auth/components/AuthCard'
import { PATHS } from '../constants/appRoutes'

export default function AuthPage() {
  return (
    <AuthLayout>
      <AuthCard />

      <div className="mt-4 text-center text-white/60 text-sm">
        <BackLink to={PATHS.HOME}>Back to home</BackLink>
      </div>
    </AuthLayout>
  )
}

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.14 }}
        transition={{ duration: 1.2 }}
        className="absolute -left-20 -top-24 w-[36rem] h-[28rem] rounded-full bg-gradient-to-r from-neonPurple via-neonPink to-neonBlue blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 1.5 }}
        className="absolute -right-20 -bottom-24 w-[36rem] h-[28rem] rounded-full bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-600 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-md px-6">{children}</div>
    </div>
  )
}

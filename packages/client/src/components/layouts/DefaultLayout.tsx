import type { ReactNode } from 'react'

interface DefaultLayoutProps {
  children: ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center from-gray-900 via-gray-800 to-gray-900 bg-gradient-to-br">
      <div className="mx-auto max-w-md w-full flex flex-col px-4">
        {children}
      </div>
    </div>
  )
}

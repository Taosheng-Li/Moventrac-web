import type { ReactNode } from 'react'
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Moventrac — Fitness Dashboard',
  description: 'Track your exercises and performance.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}


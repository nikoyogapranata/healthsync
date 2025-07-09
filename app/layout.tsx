//app\layout.tsx

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'HealthSync',
    template: '%s - HealthSync'
  },
  description: 'Integrated Digital Medical Records',
  icons: {
    icon: '/illustrations/favicon.png',
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/illustrations/favicon.png" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  )
}

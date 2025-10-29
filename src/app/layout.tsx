import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hypio NFT Dashboard - Real-time Holder Analytics',
  description: 'Track Hypio NFT holders, growth metrics, and ownership distribution on HyperEVM blockchain in real-time. View top holders, statistics, and historical trends.',
  keywords: 'Hypio, NFT, HyperEVM, blockchain, analytics, holders, dashboard',
  authors: [{ name: 'ManFromHell' }],
  openGraph: {
    title: 'Hypio NFT Dashboard',
    description: 'Real-time NFT holder analytics for HyperEVM',
    url: 'https://your-domain.vercel.app',
    siteName: 'Hypio NFT Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hypio NFT Dashboard',
    description: 'Real-time NFT holder analytics',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

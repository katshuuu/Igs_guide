import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

/** Тот же шрифт, что PressStart2P-Regular.ttf (Google Fonts) */
const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-pixel-game',
})

export const metadata: Metadata = {
  title: 'Страховое Приключение - Пиксельная 2D Игра',
  description: 'Пиксельная 2D игра о страховании с параллакс-эффектами и котом-компаньоном',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={pressStart2P.variable}>
      <body className={`${pressStart2P.className} font-sans antialiased min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

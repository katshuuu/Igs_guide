import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { IngosHeader } from '@/components/guide/ingos-header'
import { IngosFooter } from '@/components/guide/ingos-footer'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin", "cyrillic"], 
  variable: "--font-sans",
  display: "swap"
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#004DE5' },
    { media: '(prefers-color-scheme: dark)', color: '#121214' },
  ],
}

export const metadata: Metadata = {
  title: 'Умный Гайд по Страхованию | Ингосстрах',
  description: 'Интерактивный обучающий гайд по страхованию для подростков от Ингосстрах. Узнай как защитить телефон, путешествия, игровые аккаунты и многое другое!',
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
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.ingos.ru/styles/_bootstrap.css" />
        <link rel="preload" href="https://cdn.ingos.ru/fonts/IngoStem-Light-cut.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://cdn.ingos.ru/fonts/IngoStem-Regular-cut.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://cdn.ingos.ru/fonts/IngoStem-Bold-cut.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <IngosHeader />
            {children}
            <IngosFooter />
          </div>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

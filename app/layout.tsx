import '@/app/globals.css'
import { Header } from '@/components/header/header'
import { MySessionProvider } from '@/components/provider/session'
import { MyThemeProvider } from '@/components/provider/theme'
import { MyUsersProvider } from '@/components/provider/users'
import { Separator } from '@/components/ui/separator'
import { Toaster } from '@/components/ui/toaster'
import prisma from '@/lib/prisma'
import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { Fira_Code } from 'next/font/google'

export const fira = Fira_Code({
  subsets: ['latin'],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ntust.live'),
  title: 'NTUST.Live',
  description: 'NTUST Live | 台科直播平台',
  openGraph: {
    images: '/og.png',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const users = await prisma.user.findMany()

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "NTUST Live",
    "url": "https://ntust.live",
    "sameAs": ["https://github.com/zyx1121/ntust.live"],
    "description": "台科直播平台",
    "image": "https://ntust.live/og.png",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ntust.live/{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  if (users) return (
    <html lang="en" suppressHydrationWarning>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <body className={cn("min-h-[100dvh] bg-background font-mono antialiased grid", fira.variable)} style={{ gridTemplateRows: "3.5rem 1px" }}>
        <MyThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <MySessionProvider>
            <MyUsersProvider users={users}>
              <Header />
              <Separator />
              {children}
              <div className=" z-10 fixed">
                <Toaster />
              </div>
              <Analytics />
            </MyUsersProvider>
          </MySessionProvider>
        </MyThemeProvider>
      </body>
    </html>
  )
}

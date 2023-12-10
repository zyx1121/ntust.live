import "@/app/globals.css"
import { Header } from "@/components/header/header"
import { SessionClientProvider } from "@/components/provider/session"
import { ThemeProvider } from "@/components/provider/theme"
import { UsersProvider } from "@/components/provider/users"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/toaster"
import prisma from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { Fira_Code } from "next/font/google"

export const fira = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://ntust.live"),
  title: "NTUST.Live",
  description: "NTUST Live | 直播平台",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const users = await prisma.user.findMany()

  if (users) return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-[100dvh] bg-background font-mono antialiased grid", fira.variable)} style={{ gridTemplateRows: "3.5rem 1px" }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <UsersProvider users={users}>
            <SessionClientProvider>
              <Header />
              <Separator />
              {children}
              <div className="fixed z-10">
                <Toaster />
              </div>
              <SpeedInsights />
              <Analytics />
            </SessionClientProvider>
          </UsersProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

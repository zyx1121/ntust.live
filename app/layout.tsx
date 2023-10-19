import '@/app/globals.css';

import type { Metadata } from 'next';

import MyProfile from '@/components/header/profile';
import MySessionProvider from '@/components/provider/session';
import MyUsersProvider from '@/components/provider/users';
import prisma from '@/lib/prisma';
import Link from 'next/link';

import { ThemeToggle } from '@/components/header/theme';
import { MyThemeProvider } from '@/components/provider/theme';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { authOptions } from '@/lib/options';
import { Analytics } from '@vercel/analytics/react';
import { getServerSession } from 'next-auth';
import { Fira_Code } from 'next/font/google';

const fira = Fira_Code({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://ntust.live'),
  title: 'NTUST.Live',
  description: 'NTUST Live Streaming Platform',
  openGraph: {
    images: '/og.png',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const users = await prisma.user.findMany()

  return (
    <html lang="en" className={fira.className} suppressHydrationWarning>
      <body className="w-screen grid gap-0" style={{ height: "100dvh", gridTemplateRows: "3.5rem 1px" }}>
        <MyThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <MySessionProvider session={session}>
            <MyUsersProvider users={users}>
              <header className=" w-screen py-2 px-4 flex gap-2 justify-end" >
                <div className='m-auto ml-0'>
                  <Label className="mx-2" asChild>
                    <Link href="/">
                      NTUST.Live
                    </Link>
                  </Label>
                  <Badge variant="secondary" className='h-5 my-auto'>demo</Badge>
                </div>
                <ThemeToggle />
                <MyProfile />
              </header>
              <Separator />
              {children}
              <Analytics />
            </MyUsersProvider>
          </MySessionProvider>
        </MyThemeProvider>
      </body>
    </html>
  )
}

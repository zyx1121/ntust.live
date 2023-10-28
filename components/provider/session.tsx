"use client"

import { SessionProvider } from "next-auth/react"

export function MySessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider> {children} </SessionProvider>
}

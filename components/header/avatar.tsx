"use client"

import { Login } from "@/components/header/login"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export function MyAvatar() {
  const { data: session } = useSession()

  if (session) return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {session?.user?.image && session?.user?.name ? (
              <AvatarImage src={session.user.image} alt={session.user.name} />
            ) : (
              <></>
            )}
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="py-3 bg-background" align="end" forceMount>
        <DropdownMenuLabel className="font-normal py-2 mx-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none">
              {session?.user?.name ? (session.user.name) : (null)}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email ? (session.user.email) : (null)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-2" />
        <DropdownMenuItem className="py-2 mx-2" asChild>
          <Link href="https://github.com/zyx1121/ntust.live" target="_blank" rel="noopener noreferrer">
            Github
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="m-2" />
        <DropdownMenuItem className="py-2 mx-2" onClick={() => signOut({ callbackUrl: "/" })}>
          登出
          <DropdownMenuShortcut>👋</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
  else return (
    <Login />
  )
}

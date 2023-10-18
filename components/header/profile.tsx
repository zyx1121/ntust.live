'use client'

import Link from "next/link";

import { signIn, signOut, useSession } from "next-auth/react";
import { useContext } from "react";

import { UsersContext } from "@/components/provider/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function MyProfile() {
  const { data: session } = useSession()
  const { users } = useContext(UsersContext);

  if (session) return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="m-1 relative h-8 w-8 rounded-full">
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
      <DropdownMenuContent className="w-56 p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name ? (session.user.name) : (null)}
            </p>
            <p className="py-2 text-xs leading-none text-muted-foreground">
              {session?.user?.email ? (session.user.email) : (null)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="my-2">
          個人資料
        </DropdownMenuItem>
        <DropdownMenuItem className="my-2">
          商城
        </DropdownMenuItem>
        <DropdownMenuItem className="my-2">
          點數
          <DropdownMenuShortcut>{users.find((user) => user.name === session.user?.name)?.point}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="my-2" asChild>
          <Link href="https://github.com/zyx1121/ntust.live" target="_blank" rel="noopener noreferrer">
            Github
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="mt-2" onClick={() => signOut({ callbackUrl: "/" })}>
          登出
          <DropdownMenuShortcut>👋</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  else return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="m-1 relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2" align="end" forceMount>
        <DropdownMenuItem className="mb-2" onClick={() => signIn("github")}>
          透過 Github 登入
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signIn("google")}>
          透過 Google 登入
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

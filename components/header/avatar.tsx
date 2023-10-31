'use client'

import Image from "next/image";
import Link from "next/link";

import { UsersContext } from "@/components/provider/users";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";


export function MyAvatar() {
  const { data: session } = useSession()
  const { users } = useContext(UsersContext);

  const router = useRouter();

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
      <DropdownMenuContent className="py-3" align="end" forceMount>
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
        <DropdownMenuItem className="py-2 mx-2">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 mx-2">
          Store
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 mx-2">
          Point
          <DropdownMenuShortcut>{users.find((user) => user.name === session.user?.name)?.point}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="m-2" />
        <DropdownMenuItem className="py-2 mx-2" asChild>
          <Link href="https://github.com/zyx1121/ntust.live" target="_blank" rel="noopener noreferrer">
            Github
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="m-2" />
        <DropdownMenuItem className="py-2 mx-2" onClick={() => signOut({ callbackUrl: "/" })}>
          Login out
          <DropdownMenuShortcut>👋</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  else return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="h-8">
          登入
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className=" rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>
            登入以使用更多功能！
          </AlertDialogTitle>
          <AlertDialogDescription>
          </AlertDialogDescription>
          <Button variant="secondary" onClick={() => signIn("github")}>
            <span className="pr-2">
              <Image src="/github.svg" alt="GitHub" width={16} height={16} />
            </span>透過 GitHub 登入
          </Button>
          <Button variant="secondary" onClick={() => signIn("google")}>
            <span className="pr-2">
              <Image src="/google.svg" alt="Google" width={16} height={16} />
            </span>透過 Google 登入
          </Button>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>先不了，我再想想</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

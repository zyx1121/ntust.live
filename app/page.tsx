'use client'

import confetti from 'canvas-confetti'
import Image from "next/image"
import Link from "next/link"

import { UsersContext } from '@/components/provider/users'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Room } from "livekit-server-sdk"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  const session = useSession().data
  const users = useContext(UsersContext).users

  const [rooms, setRooms] = useState([])

  const getRooms = async () => {
    try {
      const resp = await fetch(`/api/room?user=${session?.user?.name}`, { method: 'GET' });
      const data = await resp.json();
      setRooms(data.rooms);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getRooms();
  }, [])

  useEffect(() => {
    let id = setInterval(() => {
      getRooms();
    }, 3000);
    return () => clearInterval(id);
  }, [])

  const handleConfetti = () => {
    confetti();
  };

  if (session) return (
    <main className="flex justify-center items-center h-full">
      <div className="grid gap-4">
        <ScrollArea className="w-[calc(100dvw-2rem)] h-[calc(100dvh-9.25rem)] sm:h-[40dvh] sm:w-[616px] rounded-md border">
          <Button variant="ghost" className="w-full rounded-none justify-start" key="title">
            <Label className="flex-1 text-left text-muted-foreground">
              Name
            </Label>
            <Label className="flex-1 text-left text-muted-foreground">
              Online
            </Label>
          </Button>
          <Separator />
          {rooms.map((room: Room) => room.numParticipants > 0 &&
            <>
              <Button variant="ghost" className="w-full rounded-none justify-start" key={room.name} asChild>
                <Link href={room.name}>
                  <Label className="flex-1 text-left">
                    {users.find((user) => user.id === room.name)?.name}
                  </Label>
                  <Label className="flex-1 text-left">
                    {room.numParticipants}
                  </Label>
                </Link>
              </Button>
              <Separator className="" />
            </>
          )}
        </ScrollArea>
        <Button onClick={() => router.push(`/${users.find((user) => user.name === session?.user?.name)?.id}`)}>
          {/* <Button onClick={() => handleConfetti()}> */}
          Start Live
        </Button>
      </div>
    </main >
  )

  return (
    <main className="flex justify-center items-center h-full">
      <div className="grid gap-4">
        <Label className="text-center text-muted-foreground">
          Welcome !!!
        </Label>
        <Button onClick={() => signIn("github")}>
          <span className="pr-2"><Image src="/github.svg" alt="GitHub" width={16} height={16} /></span>Sign in with GitHub
        </Button>
        <Button onClick={() => signIn("google")}>
          <span className="pr-2"><Image src="/google.svg" alt="Google" width={16} height={16} /></span>Sign in with Google
        </Button>
      </div>
    </main >
  )
}

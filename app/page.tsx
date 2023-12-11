'use client'

import { UsersContext } from '@/components/provider/users'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Room } from "livekit-server-sdk"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  const session = useSession()
  const users = useContext(UsersContext).users

  const [rooms, setRooms] = useState([])
  const activeRooms = rooms.filter((room: Room) => room.numParticipants > 0)

  const getRooms = async () => {
    try {
      const resp = await fetch(`/api/room?user=${session.data?.user?.name}`, { method: 'GET' })
      const data = await resp.json()
      setRooms(data.rooms)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    let id = setInterval(() => {
      getRooms()
    }, 2000)
    return () => clearInterval(id)
  })

  if (session.status === "loading") return

  return (
    <main className="flex justify-center items-center h-[100%]">
      <div className="grid gap-4">
        <Label className='pl-2'>
          {activeRooms.length > 0 ? '目前有 ' + activeRooms.length + ' 個直播中的房間' : '目前沒有直播中的房間'}
        </Label>
        <ScrollArea className="w-[calc(100dvw-2rem)] h-[calc(100dvh-11.25rem)] sm:h-[40dvh] sm:w-[616px] rounded-md border">
          <Button variant="ghost" className="w-full rounded-none justify-start" key="title">
            <Label className="flex-1 text-left text-muted-foreground">
              直播間
            </Label>
            <Label className="flex-1 text-left text-muted-foreground">
              觀看人數
            </Label>
          </Button>
          <Separator />
          {activeRooms.map((room: Room) =>
            <>
              <Button key={room.name} variant="ghost" className="w-full rounded-none justify-start" asChild>
                <Link key={room.name} href={room.name}>
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
        {session.status == "authenticated" ? (
          <Button className="border-border" variant="outline" onClick={() => router.push(`/${users.find((user) => user.name === session.data.user?.name)?.id}`)}>
            開始直播🔥🔥
          </Button>
        ) : (
          <Button className="border-border" variant="outline" disabled={true}>
            登入以建立直播
          </Button>
        )}
      </div>
    </main >
  )
}

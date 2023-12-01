"use client"

import { Room } from "livekit-server-sdk"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { UsersContext } from "../provider/users"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"

export function RoomList() {
  const { data: data, status: status } = useSession()
  const users = useContext(UsersContext).users

  const [rooms, setRooms] = useState([])

  const activeRooms = rooms.filter((room: Room) => room.numParticipants > 0)

  const getRooms = async () => {
    try {
      const resp = await fetch(`/api/room?user=${data?.user?.name}`, { method: "GET" })
      const d = await resp.json()
      setRooms(d.rooms)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getRooms()
  }, [])

  useEffect(() => {
    let id = setInterval(() => {
      getRooms();
    }, 2000);
    return () => clearInterval(id);
  }, [])

  return (
    <>
      <Label className="pl-2">
        {activeRooms.length > 0 ? "目前有 " + activeRooms.length + " 個直播中的房間" : "目前沒有直播中的房間"}
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
            <Separator />
          </>
        )}
      </ScrollArea>
    </>
  )
}
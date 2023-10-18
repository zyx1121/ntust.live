'use client'

import Link from "next/link";

import { UsersContext } from "@/components/provider/users";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Room } from "livekit-server-sdk";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  let { data: session } = useSession()
  let { users } = useContext(UsersContext);

  const router = useRouter();

  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/room?user=${session?.user?.name}`, { method: 'GET' });
        const data = await resp.json();
        setRooms(data.rooms);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [])

  if (session) return (
    <main>
      <div className="flex justify-center items-center h-full">
        <div className="grid gap-4">

          <Label className="px-4 text-muted-foreground">
            {rooms.length} online
          </Label>

          <ScrollArea className="w-[calc(100dvw-2rem)] h-[calc(100dvh-11rem)] sm:h-[40dvh] sm:w-[40dvw] rounded-md border p-2">
            {rooms.map((room: Room) => (
              <>
                <Button variant="ghost" className="w-full p-1" key={room.name} asChild>
                  <Link href={room.name}>
                    {users.find((user) => user.id === room.name)?.name}
                  </Link>
                </Button>
                <Separator className="my-2" />
              </>
            ))}
          </ScrollArea>


          <Button onClick={() => router.push(`/${users.find((user) => user.name === session?.user?.name)?.id}`)}>
            建立直播
          </Button>

        </div>
      </div>
    </main >
  )

  return (
    <main>
      <div className="flex justify-center items-center h-full">
        <div className="grid gap-4">
          <Label className="text-center text-base">
            登入以建立直播
          </Label>
          {/* <Separator /> */}
          <Button onClick={() => signIn("github")}>
            透過 Github 登入
          </Button>
          <Button onClick={() => signIn("google")}>
            透過 Google 登入
          </Button>
        </div>
      </div>
    </main>
  )
}

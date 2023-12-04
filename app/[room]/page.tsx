"use client"

import { Room } from "@/components/live/room"
import { UsersContext } from "@/components/provider/users"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { generateAnonymous } from "@/lib/anonymous"
import { LiveKitRoom } from "@livekit/components-react"
import "@livekit/components-styles"
import { useSession } from "next-auth/react"
import { Fira_Code } from "next/font/google"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"

const fira = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function Page({ params }: { params: { room: string } }) {
  const session = useSession()
  const users = useContext(UsersContext).users

  const anonymous = generateAnonymous()
  const room = params.room
  const id = users?.find((user) => user.email === session.data?.user?.email)?.id ?? anonymous
  const name = session.data?.user?.name ?? anonymous
  const control = id === room ? true : false

  const [token, setToken] = useState("")

  useEffect(() => {
    (async () => {
      try {
        if (session.status != "loading") {
          const resp = await fetch(`/api/livekit?room=${room}&username=${name}&id=${id}`)
          const data = await resp.json();
          setToken(data.token);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [session.status])

  if (token === "") return (
    <main className="flex justify-center items-center h-full">
      <Label className="text-center text-muted-foreground">
        正在建立連線...
      </Label>
    </main>
  )

  if (session.status === "loading" || !users) return (
    <main className="flex justify-center items-center h-full">
      <Label className="text-center text-muted-foreground">
        正在驗證身份...
      </Label>
    </main>
  )

  if (session.status === "authenticated" && users.find((user) => user.id === room)) return (
    <main>
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        video={control}
        audio={control}
        style={{ height: "100%" }}
        className={fira.className}
      >
        <Room room={room} users={users} authenticated={true} />
      </LiveKitRoom>
    </main>
  )

  if (session.status === "unauthenticated") return (
    <main>
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        video={control}
        audio={control}
        style={{ height: "100%" }}
        className={fira.className}
      >
        <Room room={room} users={users} authenticated={false} />
      </LiveKitRoom>
    </main>
  )

  return (
    <main className="flex justify-center items-center h-full">
      <section className="grid gap-4">
        <Label className="text-center text-muted-foreground">
          我想你應該迷路了，我們找不到這個房間
        </Label>
        <Button variant="outline" asChild>
          <Link href="/">
            返回首頁
          </Link>
        </Button>
      </section>
    </main>
  )
}

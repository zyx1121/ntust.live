"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { UsersContext } from "../provider/users"
import { Button } from "../ui/button"

export function Start() {
  const router = useRouter()
  const { users } = useContext(UsersContext)
  const { data: data, status: status } = useSession()

  if (status === "authenticated") return (
    <Button className="border-border" variant="outline" onClick={() => router.push(`/${users.find((user) => user.name === data.user?.name)?.id}`)}>
      開始直播🔥🔥
    </Button>
  )

  return (
    <Button className="border-border" variant="outline" disabled={true}>
      <Link href="/">
        登入以建立直播
      </Link>
    </Button>
  )
}
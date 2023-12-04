"use client"

import { Sparkles } from "lucide-react"
import { useSession } from "next-auth/react"
import { useContext } from "react"
import { UsersContext } from "../provider/users"
import { Badge } from "../ui/badge"

export function Point() {
  const users = useContext(UsersContext).users
  const session = useSession()

  if (session) return (
    <Badge variant="outline" className="h-5 my-auto">
      <Sparkles className="mr-2" size="16" />
      {users.find((user) => user.email === session.data?.user?.email)?.point}
    </Badge>
  )
}

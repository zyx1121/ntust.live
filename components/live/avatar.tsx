"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useContext } from "react"
import { UsersContext } from "../provider/users"

export default function MyAvatar({ identity }: { identity: string | undefined }) {
  const { users } = useContext(UsersContext)
  const userImage = users.find((user) => user.id === identity)?.image

  return (
    <Avatar className="h-6 w-6">
      {userImage && (
        <AvatarImage src={userImage} alt={identity} />
      )}
      <AvatarFallback />
    </Avatar>
  )
}
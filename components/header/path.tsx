"use client"

import { UsersContext } from "@/components/provider/users"
import { Label } from "@/components/ui/label"
import copy from 'copy-to-clipboard'
import { useSelectedLayoutSegments } from "next/navigation"
import { useContext } from "react"
import { useToast } from "../ui/use-toast"

export function Path() {
  const { toast } = useToast()
  const { users } = useContext(UsersContext)
  const segments = useSelectedLayoutSegments()

  return (
    <>
      {segments.map((segment, index) => (
        <>
          <Label className="mx-4 text-muted-foreground font-thin">
            /
          </Label>
          <Label className="cursor-pointer" key={index} onClick={() => {
            copy(`https://ntust.live/${segment}`)
            toast({
              title: "已複製直播網址 🎉",
            })
          }}>
            {users.find((user) => user.id === segment)?.name}
          </Label>
        </>
      ))}
    </>
  )
}
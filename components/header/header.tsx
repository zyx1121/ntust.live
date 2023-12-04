import Link from "next/link"
import { Badge } from "../ui/badge"
import { Label } from "../ui/label"
import { MyAvatar } from "./avatar"
import { Path } from "./path"
import { Point } from "./point"
import { ThemeToggle } from "./theme"

export function Header() {
  return (
    <header className="w-[100dvw] py-3 px-4 flex gap-2 justify-end" >
      <div className='m-auto ml-0'>
        <Label className="mx-2" asChild>
          <Link href="/">
            NTUST.Live
          </Link>
        </Label>
        <Badge variant="secondary" className='h-5 my-auto'>
          demo
        </Badge>
        <Path />
      </div>
      <Point />
      <ThemeToggle />
      <MyAvatar />
    </header>
  )
}

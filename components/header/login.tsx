import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import Link from "next/link"

export function Login() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="h-8" asChild>
          <Link href="/">
            登入
          </Link>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>
            登入以使用更多功能！
          </AlertDialogTitle>
          <AlertDialogDescription>
          </AlertDialogDescription>
          <Button variant="secondary" onClick={() => signIn("github")}>
            透過 GitHub 登入
          </Button>
          <Button variant="secondary" onClick={() => signIn("google")}>
            透過 Google 登入
          </Button>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            先不了，我再想想
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

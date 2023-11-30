import { RoomList } from '@/components/home/list'
import { Start } from "@/components/home/start"

export default function Home() {
  return (
    <main className="flex justify-center items-center h-[100%]">
      <div className="grid gap-4">
        <RoomList />
        <Start />
      </div>
    </main >
  )
}

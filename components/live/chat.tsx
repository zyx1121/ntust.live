import MyAvatar from "@/components/live/avatar"
import { UsersContext } from "@/components/provider/users"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Gift0, Gift1, Gift2 } from "@/lib/gift"
import type { ChatOptions, ReceivedChatMessage } from '@livekit/components-core'
import { ChatMessage, useChat, useRoomContext } from "@livekit/components-react"
import { DataPacket_Kind, LocalParticipant, RemoteParticipant, RoomEvent } from "livekit-client"
import { Gift, Mic2, RouteOff, SendHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { Observable } from "rxjs"
import { ToastAction } from "../ui/toast"

export type MessageEncoder = (message: ChatMessage) => Uint8Array
export type MessageDecoder = (message: Uint8Array) => ReceivedChatMessage

export function useObservableState<T>(observable: Observable<T> | undefined, startWith: T) {
  const [state, setState] = useState<T>(startWith)
  useEffect(() => {
    if (typeof window === "undefined" || !observable) return
    const subscription = observable.subscribe(setState)
    return () => subscription.unsubscribe()
  }, [observable])
  return state
}

export interface ChatProps extends React.HTMLAttributes<HTMLDivElement>, ChatOptions {
  messageFormatter?: MessageFormatter;
}

export interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
  messageFormatter?: MessageFormatter
  messageEncoder?: MessageEncoder
  messageDecoder?: MessageDecoder
  room: string
  lp: LocalParticipant
  authenticated: boolean
}
export function Chat({ messageFormatter, messageDecoder, messageEncoder, room, lp, authenticated, ...props }: ChatProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  const { toast } = useToast()
  const { users } = useContext(UsersContext)

  const roomContext = useRoomContext()
  const router = useRouter()

  const chatOptions = useMemo(() => {
    return { messageDecoder, messageEncoder }
  }, [messageDecoder, messageEncoder])
  const { send, chatMessages, isSending } = useChat(chatOptions)

  useEffect(() => {
    setTimeout(async () => {
      if (send) await send(`加入了直播間`)
    }, 3000)
  }, [send])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (inputRef.current && inputRef.current.value.trim() !== "") {
      if (send) {
        await send(inputRef.current.value)
        inputRef.current.value = ""
        inputRef.current.focus()
      }
    }
  }

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const update = async (point: string) => {
    await fetch(`/api/users?id=${lp.identity}&point=${point}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: lp.identity,
        point: point,
      }),
    })
    router.refresh()
  }

  let [point, setPoint] = useState(0)
  const [pointLock, setPointLock] = useState(false)

  if (lp.identity && !pointLock) {
    setPoint(users.find((user) => user.id === lp.identity)?.point as number)
    if (lp.identity) setPointLock(true)
  }

  const getPoint = useCallback(async (point: number, gets: number) => {
    setPoint(point + gets)
    update((point + gets).toString())
  }, [])

  useEffect(() => {
    if (lp.identity === room || !authenticated) return
    let id = setInterval(() => {
      getPoint(point, 1);
    }, 5000);
    return () => clearInterval(id);
  })

  const [gets, setGets] = useState(0)

  useEffect(() => {
    if (gets === 0) return

    getPoint(point, gets);

    setGets(0)
  }, [gets])

  const sendGiftHandle = useCallback(async (point: number, gift: string) => {
    switch (gift) {
      case "🎉":
        setPoint(point - 10)
        update((point - 10).toString())
        Gift0()
        break
      case "🎊":
        setPoint(point - 100)
        update((point - 100).toString())
        Gift1()
        break
      case "🧨":
        setPoint(point - 200)
        update((point - 200).toString())
        Gift2()
        break
    }
    sendGift(gift)
  }, []);

  const sendGift = useCallback(async (gift: string) => {
    try {
      const payload: Uint8Array = new TextEncoder().encode(
        JSON.stringify({ payload: gift, channelId: "gift" })
      )
      await lp.publishData(payload, DataPacket_Kind.LOSSY)
    } finally {

    }
  }, [lp])

  const sendLinkQuest = useCallback(async (id: string) => {
    try {
      const payload: Uint8Array = new TextEncoder().encode(
        JSON.stringify({ payload: id, channelId: "link" })
      )
      await lp.publishData(payload, DataPacket_Kind.LOSSY)
    } finally {

    }
  }, [])

  const sendRefresh = useCallback(async () => {
    try {
      const payload: Uint8Array = new TextEncoder().encode(
        JSON.stringify({ payload: "refresh", channelId: "refresh" })
      )
      await lp.publishData(payload, DataPacket_Kind.LOSSY)
    } finally {

    }
  }, [])

  const updateLink = async (room: string, link: string) => {
    await fetch(`/api/link?id=${room}&link=${link}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: room,
        link: link,
      }),
    })
    router.refresh()
    sendRefresh()
  }

  const onDataChannel = useCallback(
    (payload: Uint8Array, participant: RemoteParticipant | undefined) => {
      if (!participant) return console.log("no participant");
      const data = JSON.parse(new TextDecoder().decode(payload));
      if (data.channelId === "gift") {
        switch (data.payload) {
          case "🎉":
            Gift0()
            if (lp.identity === room) setGets(10)
            break
          case "🎊":
            Gift1()
            if (lp.identity === room) setGets(100)
            break
          case "🧨":
            Gift2()
            if (lp.identity === room) setGets(200)
            break
        }
        if (lp.identity === room) toast({
          title: "收到來自 " + participant.name + " 的 " + data.payload + " !",
          description: new Date().toLocaleTimeString(),
        })
      }
      if (data.channelId === "link" && lp.identity === room) {
        toast({
          title: "收到來自 " + participant.name + " 的連麥請求 !",
          action: (
            <ToastAction altText="asdf" onClick={() => updateLink(room, participant.identity)}>
              接受請求
            </ToastAction>
          ),
        })
      }
      if (data.channelId === "refresh") {
        router.refresh()
      }
    }, []
  )

  useEffect(() => {
    roomContext.on(RoomEvent.DataReceived, onDataChannel)
    return () => {
      roomContext.off(RoomEvent.DataReceived, onDataChannel)
    }
  }, [onDataChannel, roomContext])

  const linkers = users.find((user) => user.id === room)?.link

  return (
    <div {...props} className="grid gap-4" >
      <ScrollArea className=" h-[9rem] rounded-md bg-[#00000040] m-4 lg:pb-4 lg:m-0 lg:bg-background lg:h-[calc(100dvh-9rem-1px)] lg:border">
        <ul>
          {chatMessages.map((msg, idx) =>
            <MyChatEntry key={idx} room={room} entry={msg} messageFormatter={messageFormatter} />
          )}
        </ul>
        <div ref={divRef} />
      </ScrollArea>
      <form className="flex gap-3" onSubmit={handleSubmit} >
        <Input className="rounded-md border border-border text-foreground" disabled={isSending} ref={inputRef} type="text" placeholder="..." />
        {lp.identity === room && users.find((user) => user.id === lp.identity)?.link.length !== 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="rounded-md border border-border text-foreground" size="icon" variant="outline" >
                <RouteOff className="h-4 w-4 text-foreground" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-background">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  取消連麥
                </AlertDialogTitle>
              </AlertDialogHeader>
              {
                linkers?.map((linker, index) => (
                  <AlertDialogAction key={index} onClick={() => updateLink(room, linker)}>
                    {users.find((user) => user.id === linker)?.name}
                  </AlertDialogAction>
                ))
              }
              <AlertDialogFooter>
                <AlertDialogCancel>
                  取消
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {linkers?.includes(lp.identity) && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="rounded-md border border-border text-foreground" size="icon" variant="outline" >
                <RouteOff className="h-4 w-4 text-foreground" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-background rounded-md">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  取消連麥
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  取消
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => updateLink(room, lp.identity)}>
                  確認
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {!linkers?.includes(lp.identity) && lp.identity !== room && authenticated && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="rounded-md border border-border text-foreground" size="icon" variant="outline" >
                <Mic2 className="h-4 w-4 text-foreground" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-background rounded-md">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  與主播連麥
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  取消
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => sendLinkQuest(lp.identity)}>
                  發送請求
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {lp.identity !== room && authenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-md border border-border text-foreground" size="icon" variant="outline">
                <Gift className="h-4 w-4 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" rounded-lg bg-background mb-3 mr-4 p-2 flex gap-2">
              <DropdownMenuItem asChild>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button className="rounded-sm border border-border text-foreground" size="icon" variant="outline">
                      🎉
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>贈送 🎉</AlertDialogTitle>
                      <AlertDialogDescription>
                        目前持有的點數：{point}
                        <br />
                        將花費 10 點數贈送
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={() => sendGiftHandle(point, "🎉")}>送出</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button className="rounded-sm border border-border text-foreground" size="icon" variant="outline">
                      🎊
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>贈送 🎉</AlertDialogTitle>
                      <AlertDialogDescription>
                        目前持有的點數：{point}
                        <br />
                        將花費 100 點數贈送
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      {point >= 100 ? (
                        <AlertDialogAction onClick={() => sendGiftHandle(point, "🎊")}>送出</AlertDialogAction>
                      ) : (
                        <AlertDialogAction >送出</AlertDialogAction>
                      )}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button className="rounded-sm border border-border text-foreground" size="icon" variant="outline">
                      🧨
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>贈送 🧨</AlertDialogTitle>
                      <AlertDialogDescription>
                        目前持有的點數：{point}
                        <br />
                        將花費 200 點數贈送
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      {point >= 0 ? (
                        <AlertDialogAction onClick={() => sendGiftHandle(point, "🧨")}>送出</AlertDialogAction>
                      ) : (
                        <AlertDialogAction >送出</AlertDialogAction>
                      )}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button className="rounded-md border border-border text-foreground" disabled={isSending} type="submit" size="icon" variant="outline" >
          <SendHorizontal className="h-4 w-4 text-foreground" />
        </Button>
      </form>
    </div>
  )
}

export type MessageFormatter = (message: string) => string
export interface ChatEntryProps extends React.HTMLAttributes<HTMLLIElement> {
  room: string
  entry: ReceivedChatMessage
  messageFormatter?: MessageFormatter
}
export function MyChatEntry({ room, entry, messageFormatter, ...props }: ChatEntryProps) {
  const formattedMessage = useMemo(() => {
    return messageFormatter ? messageFormatter(entry.message) : entry.message
  }, [entry.message, messageFormatter])

  const time = new Date(entry.timestamp)
  const locale = navigator ? navigator.language : "en-US"

  if (formattedMessage !== "abc") return (
    <li className="lk-chat-entry p-4 pb-0" title={time.toLocaleTimeString(locale, { timeStyle: "full" })} data-lk-message-origin={entry.from?.isLocal ? "local" : "remote"} {...props}>
      <div className="flex gap-2">
        <div className="mb-auto mt-0">
          <MyAvatar identity={entry.from?.identity} />
        </div>
        <Label className="h-6 leading-6 text-[#ffffff80] lg:text-muted-foreground" style={{ whiteSpace: "nowrap" }}>{entry.from?.name}</Label>
        <span className="box-border break-words w-fit p-0 leading-6 lg:text-foreground bg-transparent" style={{ wordBreak: "break-word" }}>
          {formattedMessage}
        </span>
      </div>
    </li >
  )
}

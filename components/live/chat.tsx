import MyAvatar from '@/components/live/avatar';

import { UsersContext } from "@/components/provider/users";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from '@/components/ui/scroll-area';
import { setupChat } from '@livekit/components-core';
import { ChatMessage, ReceivedChatMessage, useRoomContext } from '@livekit/components-react';
import { User } from "@prisma/client";
import { SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import type { Observable } from 'rxjs';

export type MessageEncoder = (message: ChatMessage) => Uint8Array;
export type MessageDecoder = (message: Uint8Array) => ReceivedChatMessage;

export function useObservableState<T>(observable: Observable<T> | undefined, startWith: T) {
  const [state, setState] = useState<T>(startWith);
  useEffect(() => {
    if (typeof window === 'undefined' || !observable) return;
    const subscription = observable.subscribe(setState);
    return () => subscription.unsubscribe();
  }, [observable]);
  return state;
}

export function useChat(options?: { messageEncoder?: MessageEncoder, messageDecoder?: MessageDecoder }) {
  const room = useRoomContext();
  const [setup, setSetup] = useState<ReturnType<typeof setupChat>>();
  const isSending = useObservableState(setup?.isSendingObservable as Observable<boolean> | undefined, false);
  const chatMessages = useObservableState(setup?.messageObservable as Observable<ReceivedChatMessage[]> | undefined, []);

  useEffect(() => {
    const setupChatReturn = setupChat(room, options);
    setSetup(setupChatReturn);
    return setupChatReturn.destroy;
  }, [room, options]);

  return { send: setup?.send, chatMessages, isSending };
}

export interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
  messageFormatter?: MessageFormatter;
  messageEncoder?: MessageEncoder;
  messageDecoder?: MessageDecoder;
  room: string;
}
export function Chat({ messageFormatter, messageDecoder, messageEncoder, room, ...props }: ChatProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const chatOptions = useMemo(() => {
    return { messageDecoder, messageEncoder };
  }, [messageDecoder, messageEncoder]);

  const { send, chatMessages, isSending } = useChat(chatOptions);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (inputRef.current && inputRef.current.value.trim() !== '') {
      if (send) {
        await send(inputRef.current.value);
        inputRef.current.value = '';
        inputRef.current.focus();
      }
    }
  }

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages]);

  return (
    <div {...props} className="grid gap-4" >
      <ScrollArea className="h-[8.5rem] lg:h-[calc(100dvh-9rem-1px)] lg:border rounded-lg pb-4">
        <ul>
          {chatMessages.map((msg, idx) =>
            <MyChatEntry key={idx} room={room} entry={msg} messageFormatter={messageFormatter} />
          )}
        </ul>
        <div ref={divRef} />
      </ScrollArea>
      <form className="flex gap-3" onSubmit={handleSubmit} >
        <Input disabled={isSending} ref={inputRef} type="text" placeholder="..." />
        <Button disabled={isSending} type="submit" size="icon" variant="outline" >
          <SendHorizontal className="h-4 w-4 text-foreground" />
        </Button>
      </form>
    </div>
  );
}

export type MessageFormatter = (message: string) => React.ReactNode;
export interface ChatEntryProps extends React.HTMLAttributes<HTMLLIElement> {
  room: string;
  entry: ReceivedChatMessage;
  messageFormatter?: MessageFormatter;
}
export function MyChatEntry({ room, entry, messageFormatter, ...props }: ChatEntryProps) {
  const formattedMessage = useMemo(() => {
    return messageFormatter ? messageFormatter(entry.message) : entry.message;
  }, [entry.message, messageFormatter]);
  const time = new Date(entry.timestamp);
  const locale = navigator ? navigator.language : 'en-US';

  let { users } = useContext(UsersContext);

  const owner = users.find((user) => user.id === room);

  const router = useRouter();
  const update = async (owner: User | undefined, link: string | undefined) => {
    await fetch(`/api/link?id=${owner?.id}&link=${link}`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: owner?.id,
        link: link,
      }),
    });
    router.refresh();
  };

  return (
    <li className="lk-chat-entry p-4 pb-0" title={time.toLocaleTimeString(locale, { timeStyle: 'full' })} data-lk-message-origin={entry.from?.isLocal ? 'local' : 'remote'} {...props}>
      <div className="flex gap-2">
        <div className="mb-auto mt-0">
          <Popover>
            <PopoverTrigger>
              <MyAvatar name={entry.from?.name} />
            </PopoverTrigger>
            <PopoverContent>
              {owner?.link === users.find((user) => user.name === entry.from?.name)?.id ? (
                <Button onClick={() => update(owner, "")} variant="secondary" className="mr-4">
                  Disconnect
                </Button>
              ) : (
                <Button onClick={() => update(owner, users.find((user) => user.name === entry.from?.name)?.id)} variant="secondary" className="mr-4">
                  Connect
                </Button>
              )}
            </PopoverContent>
          </Popover>
        </div>
        <Label className="h-6 leading-6 text-muted-foreground" style={{ whiteSpace: 'nowrap' }}>{entry.from?.name}</Label>
        <span className='box-border break-words w-fit p-0 leading-6 text-foreground bg-transparent' style={{ wordBreak: "break-word" }}>
          {formattedMessage}
        </span>
      </div>
    </li >
  );
}

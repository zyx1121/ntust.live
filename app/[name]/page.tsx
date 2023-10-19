'use client'

import '@livekit/components-styles';

import { signIn, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

import { Room } from '@/components/live/room';
import { UsersContext } from '@/components/provider/users';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LiveKitRoom } from '@livekit/components-react';

export default function Page() {
  let { data: session } = useSession()
  let { users } = useContext(UsersContext);

  const id = users?.find((user) => user.name === session?.user?.name)?.id
  const name = session?.user?.name ?? '';
  const room = usePathname().replace('/', '');
  const control = users?.find((user) => user.id === room)?.name === name ? true : false;

  const [token, setToken] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${room}&username=${name}&id=${id}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [])

  if (!session) return (
    <main className="flex justify-center items-center h-full">
      <div className="grid gap-4">
        <Label className="text-center text-base">
          登入以觀看直播
        </Label>
        {/* <Separator /> */}
        <Button onClick={() => signIn("github")}>
          透過 Github 登入
        </Button>
        <Button onClick={() => signIn("google")}>
          透過 Google 登入
        </Button>
      </div>
    </main>
  )

  if (token === "") return (
    <main className="flex justify-center items-center h-full">
      ...
    </main>
  )

  if (users.find((user) => user.id === room)) return (
    <main>
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        connect={true}
        video={control}
        audio={control}
        style={{ height: '100%' }}
      >
        <Room room={room} users={users} />
      </LiveKitRoom>
    </main>
  )

  return (
    <main className="flex justify-center items-center h-full">
      404
    </main>
  )
}

'use client'

import '@livekit/components-styles';

import Image from "next/image";

import { Room } from '@/components/live/room';
import { UsersContext } from '@/components/provider/users';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LiveKitRoom } from '@livekit/components-react';
import { signIn, useSession } from 'next-auth/react';
import { Fira_Code } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

const fira = Fira_Code({ subsets: ['latin'] })

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
        <Label className="text-center text-muted-foreground">
          Login to start watching
        </Label>
        <Button onClick={() => signIn("github")}>
          <span className="pr-2"><Image src="/github.svg" alt="GitHub" width={16} height={16} /></span>Sign in with GitHub
        </Button>
        <Button onClick={() => signIn("google")}>
          <span className="pr-2"><Image src="/google.svg" alt="Google" width={16} height={16} /></span>Sign in with Google
        </Button>
      </div>
    </main>
  )

  if (token === "") return (
    <main className="flex justify-center items-center h-full">
      Waiting for token...
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
        className={fira.className}
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

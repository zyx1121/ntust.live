
import { Chat } from "@/components/live/chat";
import { Label } from "@/components/ui/label";
import { ControlBar, GridLayout, LayoutContextProvider, RoomAudioRenderer, useCreateLayoutContext, useLocalParticipant, useParticipants, useTracks } from "@livekit/components-react";
import { User } from "@prisma/client";
import { RoomEvent, Track } from "livekit-client";
import { ParticipantTile } from "./participan";

export function Room({ room, users }: { room: string, users: User[] }) {
  const lp = useLocalParticipant().localParticipant;
  const ps = useParticipants();

  const streamer = room;
  let linker = users.find((user) => user.id === room)?.link;

  const layoutContext = useCreateLayoutContext();

  const hostTracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged, RoomEvent.TrackStreamStateChanged], onlySubscribed: false },
  ).filter(
    (track) => track.participant?.identity == streamer || track.participant?.identity === linker
  );

  if (ps.find((p) => p.identity === room)) return (
    <div className="lk-video-conference p-4 gap-4 bg-background">
      <LayoutContextProvider value={layoutContext} >
        <div className="lk-video-conference-inner lg:h-[calc(100dvh-5.5rem-1px)] h-[calc(100dvh-9rem-1px)] border rounded-md">
          <GridLayout className="h-[200px]" tracks={hostTracks}>
            <ParticipantTile />
          </GridLayout>
        </div>
        <aside className="fixed bottom-4 w-[calc(100%-2rem)] lg:static lg:w-[40rem]" >
          <Chat room={room} />
        </aside>
        {(lp.identity == streamer) || (lp.identity == linker) ? (
          <ControlBar style={{ border: 'none', position: 'fixed', left: '1rem', top: '4.5rem', padding: '1rem' }} variation='minimal' controls={{ leave: false, camera: true, microphone: true, screenShare: true, chat: false }} />
        ) : (
          null
        )}
      </LayoutContextProvider>
      <RoomAudioRenderer />
    </div>
  );

  else return (
    <div className="flex justify-center items-center h-full bg-background text-muted-foreground">
      <Label>
        Waiting for host...
      </Label>
    </div>
  )
}

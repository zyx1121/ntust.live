
import { Chat } from "@/components/live/Chat";
import { ControlBar, GridLayout, LayoutContextProvider, RoomAudioRenderer, useCreateLayoutContext, useLocalParticipant, useParticipants, useTracks } from "@livekit/components-react";
import { User } from "@prisma/client";
import { RoomEvent, Track } from "livekit-client";
import { ParticipantTile } from "./ParticipanTile";

export function Room({ room, users }: { room: string, users: User[] }) {

  const lp = useLocalParticipant().localParticipant;
  const ps = useParticipants();

  const streamer = room;
  const linker = users.find((user) => user.id === room)?.link;

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged, RoomEvent.TrackStreamStateChanged], onlySubscribed: false },
  );
  const hostTracks = tracks.filter(
    (track) => track.participant?.identity == streamer || track.participant?.identity === linker,
  );

  const layoutContext = useCreateLayoutContext();

  return (
    <div className="lk-video-conference p-4 gap-4 bg-background">
      <LayoutContextProvider value={layoutContext} >

        <div className="lk-video-conference-inner lg:h-full h-[calc(100dvh-9rem-1px)] border rounded-lg">
          <GridLayout tracks={hostTracks}>
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
}

import { GridLayout, RoomAudioRenderer, useLocalParticipant, useParticipants, useTracks } from "@livekit/components-react"
import { User } from "@prisma/client"
import { RoomEvent, Track } from "livekit-client"
import { Badge } from "../ui/badge"
import { ControlBar } from "./bar"
import { Chat } from "./chat"
import { ParticipantTile } from "./participan"

export function Room({ room, users, authenticated }: { room: string, users: User[], authenticated: boolean }) {
  const lp = useLocalParticipant().localParticipant
  const ps = useParticipants()

  const streamer = room
  const linkers = users.find((user) => user.id === room)?.link

  const hostTracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged, RoomEvent.TrackStreamStateChanged], onlySubscribed: false },
  ).filter(
    (track) => track.participant?.identity == streamer || linkers?.includes(track.participant?.identity)
  )

  return (
    <div className="relative flex items-stretch h-full p-4 gap-4 bg-background">
      <div className="flex flex-col items-stretch w-full lg:h-[calc(100dvh-5.5rem-1px)] h-[calc(100dvh-9rem-1px)] border rounded-md">
        <GridLayout tracks={hostTracks}>
          <ParticipantTile />
        </GridLayout>
      </div>
      <div className="fixed bottom-4 w-[calc(100%-2rem)] lg:static lg:w-[40rem]" >
        <Chat room={room} lp={lp} authenticated={authenticated} />
      </div>
      {(lp.identity == streamer) || linkers?.includes(lp.identity) ? (
        <>
          <ControlBar className="absolute top-9 left-9 p-0" style={{ border: "none" }} variation="minimal" controls={{ leave: false, camera: true, microphone: true, screenShare: true, chat: false }} />
          <Badge variant="secondary" className="absolute top-24 left-12">
            在線 {ps.length}
          </Badge>
        </>
      ) : (
        <Badge variant="secondary" className="absolute top-12 left-12">
          在線 {ps.length}
        </Badge>
      )}
      <RoomAudioRenderer />
    </div>
  )
}

import { GridLayout, RoomAudioRenderer, useLocalParticipant, useParticipants, useTracks } from "@livekit/components-react"
import { User } from "@prisma/client"
import { RoomEvent, Track } from "livekit-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Badge } from "../ui/badge"
import { Slider } from "../ui/slider"
import { ControlBar } from "./bar"
import { Chat } from "./chat"
import { ParticipantTile } from "./participan"

export function Room({ room, users, authenticated }: { room: string, users: User[], authenticated: boolean }) {
  const localParticipant = useLocalParticipant().localParticipant
  const participants = useParticipants()

  const router = useRouter()

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

  const [sliderValue, setSliderValue] = useState(0.5)

  return (
    <div className="relative flex items-stretch h-full p-4 gap-4 bg-background">
      <div className="flex flex-col items-stretch w-full lg:h-[calc(100dvh-5.5rem-1px)] h-[calc(100dvh-9rem-1px)] border rounded-md">
        <GridLayout tracks={hostTracks}>
          <ParticipantTile />
        </GridLayout>
      </div>
      <div className="fixed bottom-4 w-[calc(100%-2rem)] lg:static lg:w-[40rem]" >
        <Chat room={room} localParticipant={localParticipant} authenticated={authenticated} />
      </div>
      {(localParticipant.identity == streamer) || linkers?.includes(localParticipant.identity) ? (
        <>
          <ControlBar className="absolute top-9 left-9 p-0" style={{ border: "none" }} variation="minimal" controls={{ leave: false, camera: true, microphone: true, screenShare: true, chat: false }} />
          <Badge variant="secondary" className="absolute top-24 left-12">
            在線 {participants.length}
          </Badge>
          <Slider className="absolute top-[6.5rem] left-32 w-32" defaultValue={[0.5]} max={1} step={0.1} onValueChange={(v) => {setSliderValue(v.at(0)!); router.refresh()}} />
        </>
      ) : (
        <>
          <Badge variant="secondary" className="absolute top-12 left-12">
            在線 {participants.length}
          </Badge>
          <Slider className="absolute top-14 left-32 w-32" defaultValue={[0.5]} max={1} step={0.1} onValueChange={(v) => {setSliderValue(v.at(0)!); router.refresh()}} />
        </>
      )}
      <RoomAudioRenderer volume={sliderValue} />
      {sliderValue}
    </div>
  )
}

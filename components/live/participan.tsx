import { Label } from '@/components/ui/label';
import { ParticipantClickEvent, TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { AudioTrack, ParticipantContextIfNeeded, VideoTrack, useEnsureParticipant, useMaybeTrackContext, useParticipantTile } from '@livekit/components-react';
import { Participant, Track, TrackPublication } from "livekit-client";

export interface ParticipantTileProps extends React.HTMLAttributes<HTMLDivElement> {
  disableSpeakingIndicator?: boolean;
  participant?: Participant;
  source?: Track.Source;
  publication?: TrackPublication;
  onParticipantClick?: (event: ParticipantClickEvent) => void;
}
export function ParticipantTile({
  participant,
  children,
  source = Track.Source.Camera,
  onParticipantClick,
  publication,
  disableSpeakingIndicator,
  ...htmlProps
}: ParticipantTileProps) {

  const p = useEnsureParticipant(participant);
  const trackRef: TrackReferenceOrPlaceholder = useMaybeTrackContext() ?? {
    participant: p,
    source,
    publication,
  };

  const { elementProps } = useParticipantTile<HTMLDivElement>({
    participant: trackRef.participant,
    htmlProps,
    source: trackRef.source,
    publication: trackRef.publication,
    disableSpeakingIndicator,
    onParticipantClick,
  });

  return (
    <div className="relative" {...elementProps}>
      <ParticipantContextIfNeeded participant={trackRef.participant}>
        {trackRef.publication?.kind === 'video' ||
          trackRef.source === Track.Source.Camera ||
          trackRef.source === Track.Source.ScreenShare ? (
          <VideoTrack className='bg-background'
            manageSubscription={true}
          />
        ) : (
          <AudioTrack />
        )}
        <div className="lk-participant-placeholder">
          <Label className="text-muted-foreground">
            主播尚未開啟視訊
          </Label>
        </div>
      </ParticipantContextIfNeeded>
    </div >
  );
}

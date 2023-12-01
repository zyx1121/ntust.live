import type { ParticipantClickEvent, TrackReferenceOrPlaceholder } from "@livekit/components-core"
import { isTrackReference, isTrackReferencePinned } from "@livekit/components-core"
import { AudioTrack, ConnectionQualityIndicator, LockLockedIcon, ParticipantContext, ParticipantName, ScreenShareIcon, TrackMutedIndicator, TrackRefContext, VideoTrack, useEnsureParticipant, useFeatureContext, useIsEncrypted, useMaybeLayoutContext, useMaybeParticipantContext, useMaybeTrackRefContext, useParticipantTile } from "@livekit/components-react"
import type { Participant, TrackPublication } from "livekit-client"
import { Track } from "livekit-client"
import * as React from "react"

export function ParticipantContextIfNeeded(
  props: React.PropsWithChildren<{
    participant?: Participant
  }>,
) {
  const hasContext = !!useMaybeParticipantContext()
  return props.participant && !hasContext ? (
    <ParticipantContext.Provider value={props.participant}>
      {props.children}
    </ParticipantContext.Provider>
  ) : (
    <>{props.children}</>
  )
}

function TrackRefContextIfNeeded(
  props: React.PropsWithChildren<{
    trackRef?: TrackReferenceOrPlaceholder
  }>,
) {
  const hasContext = !!useMaybeTrackRefContext()
  return props.trackRef && !hasContext ? (
    <TrackRefContext.Provider value={props.trackRef}>{props.children}</TrackRefContext.Provider>
  ) : (
    <>{props.children}</>
  )
}

export interface ParticipantTileProps extends React.HTMLAttributes<HTMLDivElement> {
  trackRef?: TrackReferenceOrPlaceholder
  disableSpeakingIndicator?: boolean
  participant?: Participant
  source?: Track.Source
  publication?: TrackPublication
  onParticipantClick?: (event: ParticipantClickEvent) => void
}

export function ParticipantTile({
  trackRef,
  participant,
  children,
  source = Track.Source.Camera,
  onParticipantClick,
  publication,
  disableSpeakingIndicator,
  ...htmlProps
}: ParticipantTileProps) {
  const maybeTrackRef = useMaybeTrackRefContext()
  const p = useEnsureParticipant(participant)
  const trackReference: TrackReferenceOrPlaceholder = React.useMemo(() => {
    return {
      participant: trackRef?.participant ?? maybeTrackRef?.participant ?? p,
      source: trackRef?.source ?? maybeTrackRef?.source ?? source,
      publication: trackRef?.publication ?? maybeTrackRef?.publication ?? publication,
    }
  }, [maybeTrackRef, p, publication, source, trackRef])

  const { elementProps } = useParticipantTile<HTMLDivElement>({
    participant: trackReference.participant,
    htmlProps,
    source: trackReference.source,
    publication: trackReference.publication,
    disableSpeakingIndicator,
    onParticipantClick,
  })
  const isEncrypted = useIsEncrypted(p)
  const layoutContext = useMaybeLayoutContext()

  const autoManageSubscription = useFeatureContext()?.autoSubscription

  const handleSubscribe = React.useCallback(
    (subscribed: boolean) => {
      if (
        trackReference.source &&
        !subscribed &&
        layoutContext &&
        layoutContext.pin.dispatch &&
        isTrackReferencePinned(trackReference, layoutContext.pin.state)
      ) {
        layoutContext.pin.dispatch({ msg: "clear_pin" })
      }
    },
    [trackReference, layoutContext],
  )

  return (
    <div style={{ position: "relative" }} {...elementProps}>
      <TrackRefContextIfNeeded trackRef={trackReference}>
        <ParticipantContextIfNeeded participant={trackReference.participant}>
          {children ?? (
            <>
              {isTrackReference(trackReference) &&
                (trackReference.publication?.kind === "video" ||
                  trackReference.source === Track.Source.Camera ||
                  trackReference.source === Track.Source.ScreenShare) ? (
                <VideoTrack
                  trackRef={trackReference}
                  onSubscriptionStatusChanged={handleSubscribe}
                  manageSubscription={autoManageSubscription}
                />
              ) : (
                isTrackReference(trackReference) && (
                  <AudioTrack
                    trackRef={trackReference}
                    onSubscriptionStatusChanged={handleSubscribe}
                  />
                )
              )}
              <div className="lk-participant-placeholder text-foreground">
                無畫面
              </div>
              <div className="lk-participant-metadata">
                <div className="lk-participant-metadata-item">
                  {trackReference.source === Track.Source.Camera ? (
                    <>
                      {isEncrypted && <LockLockedIcon style={{ marginRight: "0.25rem" }} />}
                      <TrackMutedIndicator
                        source={Track.Source.Microphone}
                        show={"muted"}
                      ></TrackMutedIndicator>
                      <ParticipantName />
                    </>
                  ) : (
                    <>
                      <ScreenShareIcon style={{ marginRight: "0.25rem" }} />
                      <ParticipantName> 的螢幕</ParticipantName>
                    </>
                  )}
                </div>
                <ConnectionQualityIndicator className="lk-participant-metadata-item" />
              </div>
            </>
          )}
        </ParticipantContextIfNeeded>
      </TrackRefContextIfNeeded>
    </div>
  )
}

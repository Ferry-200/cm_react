import { styled } from "@linaria/react"
import { Avatar, Slider } from "radix-ui"
import { usePlayerDuration, usePlayerIsPlaying, usePlayerNowPlaying, usePlayerPosition } from "../hook/player-hooks"
import { PrimaryIconButton, SecondaryIconButton } from "../../../component/icon-button"
import { PLAYER } from "../../../player"
import { LucideChevronLeft, LucideChevronRight, LucideImageOff, LucidePause, LucidePlay } from "lucide-react"
import { useState } from "react"
import { getImageStreamUrl } from "../../../jellyfin/streaming"
import { PrimaryLinkChip, SecondaryLinkChip } from "./chips"
import { ROUTE_PATH } from "../../../router"
import { createSearchParams } from "react-router"

const NowPlayingViewWrapper = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: end;
  padding: 16px 8px;
`

const NowPlayingLargeImg = styled(Avatar.Image)`
  display: block;
  width: 268px;
  height: 268px;
  border-radius: 16px;
  box-shadow: var(--md-elevation-2);
`

const NowPlayingLargeImgFallback = styled(Avatar.Fallback)`
  display: block;
  width: 268px;
  height: 268px;
`

const NowPlayingViewTitle = styled.span`
  margin-top: 16px;
  font-size: 20px;
  font-weight: bold;
  overflow-wrap: anywhere;
`

const ArtistChipsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 8px 0 4px 0;
  gap: 4px;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const NowPlayingActions = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 16px;
`

const PlayPauseBtn = () => {
  const isPlaying = usePlayerIsPlaying()

  return (
    <PrimaryIconButton onClick={() => PLAYER.togglePlayAndPause()}>
      {isPlaying ? <LucidePause /> : <LucidePlay />}
    </PrimaryIconButton>
  )
}

const SliderRoot = styled(Slider.Root)`
  margin-top: 12px;
  position: relative;
	display: flex;
	align-items: center;
	user-select: none;
	touch-action: none;
	width: 100%;
	height: 24px;
`

const SliderTrack = styled(Slider.Track)`
  background-color: var(--md-secondary-container);
	position: relative;
	flex-grow: 1;
	border-radius: 2px;
	height: 8px;
`

const SliderRange = styled(Slider.Range)`
  position: absolute;
	background-color: var(--md-primary);
	border-radius: 2px;
	height: 100%;
`

const SliderThumb = styled(Slider.Thumb)`
  display: block;
	width: 4px;
	height: 24px;
	background-color: var(--md-primary);
	border-radius: 2px;
`

const SliderTextWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

function formatTime(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time) % 60

  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`

  return `${minutesStr} : ${secondsStr}`
}

const NowPlayingSlider = () => {
  const pos = usePlayerPosition()
  const dur = usePlayerDuration()
  const [isDragging, setIsDragging] = useState(false)
  const [draggingValue, setDraggingValue] = useState(0)

  return (<>
    <SliderRoot
      max={1000}
      value={[isDragging ? draggingValue : Math.floor((pos / dur) * 1000)]}
      onValueChange={([value]) => {
        if (!isDragging) setIsDragging(true)

        setDraggingValue(value)
      }}
      onValueCommit={([value]) => {
        setIsDragging(false)
        PLAYER.seek((value / 1000) * dur)
      }}
    >
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
      <SliderThumb />
    </SliderRoot>

    <SliderTextWrapper>
      <span>{formatTime(pos)}</span>
      <span>{formatTime(dur)}</span>
    </SliderTextWrapper>
  </>)
}

export const NowPlayingView = () => {
  const nowPlaying = usePlayerNowPlaying()

  return (
    <NowPlayingViewWrapper>
      <Avatar.Root>
        <NowPlayingLargeImg src={getImageStreamUrl(nowPlaying.album.id, 268)} />
        <NowPlayingLargeImgFallback asChild>
          <LucideImageOff strokeWidth='0.5' />
        </NowPlayingLargeImgFallback>
      </Avatar.Root>
      <NowPlayingViewTitle>{nowPlaying.title}</NowPlayingViewTitle>
      <ArtistChipsWrapper>{
        nowPlaying.artists.map((artist) => (
          <PrimaryLinkChip
            to={{
              pathname: ROUTE_PATH.artistDetail,
              search: `?${createSearchParams({ id: artist.id }).toString()}`
            }}
            key={artist.id}
          >
            {artist.name}
          </PrimaryLinkChip>
        ))
      }</ArtistChipsWrapper>
      <SecondaryLinkChip
        to={{
          pathname: ROUTE_PATH.albumDetail,
          search: `?${createSearchParams({ id: nowPlaying.album.id }).toString()}`
        }}
      >{nowPlaying.album.name}</SecondaryLinkChip>

      <NowPlayingSlider />

      <NowPlayingActions>
        <SecondaryIconButton onClick={() => PLAYER.playPrev()}>
          <LucideChevronLeft />
        </SecondaryIconButton>
        <PlayPauseBtn />
        <SecondaryIconButton onClick={() => PLAYER.playNext()}>
          <LucideChevronRight />
        </SecondaryIconButton>
      </NowPlayingActions>
    </NowPlayingViewWrapper>
  )
}
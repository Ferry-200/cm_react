import { styled } from "@linaria/react";
import { ScrollView } from "../../../component/scroll-view";
import { PlaylistView } from "./playlist-view";
import { usePlayerDuration, usePlayerIsPlaying, usePlayerNowPlaying, usePlayerPosition } from "../hook/player-hooks";
import { Avatar, Slider } from "radix-ui";
import { LucideChevronLeft, LucideChevronRight, LucideImageOff, LucidePause, LucidePlay } from "lucide-react";
import { getImageStreamUrl } from "../../../jellyfin/streaming";
import { PrimaryIconButton, SecondaryIconButton } from "../../../component/icon-button";
import { PLAYER } from "../../../player";
import { createSearchParams } from "react-router";
import { ROUTE_PATH } from "../../../router";
import { PrimaryLinkChip, SecondaryLinkChip } from "./chips";
import { useState } from "react";

const Wrapper = styled.div`
  flex-shrink: 0;
  width: 300px;
  height: 100vh;
  background-color: var(--md-surface-container);
  display: flex;
  flex-direction: column;
  padding: 8px;
`

const TopSubView = styled(ScrollView)`
  max-height: 50%;
`

const NowPlayingViewWrapper = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: end;
  padding: 8px;
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
  margin: 12px 0 4px 0;
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
	border-radius: 4px;
	height: 8px;
`

const SliderRange = styled(Slider.Range)`
  position: absolute;
	background-color: var(--md-primary);
	border-radius: 4px;
	height: 100%;
`

const SliderThumb = styled(Slider.Thumb)`
  display: block;
	width: 4px;
	height: 24px;
	background-color: var(--md-primary);
	border-radius: 2px;
`

const NowPlayingSlider = () => {
  const pos = usePlayerPosition()
  const dur = usePlayerDuration()
  const [isDragging, setIsDragging] = useState(false)
  const [draggingValue, setDraggingValue] = useState(0)

  return (
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
  )
}

const NowPlayingView = () => {
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

export const NowPlayingSidePanel = () => {
  return (
    <Wrapper>
      <TopSubView>
        <PlaylistView />
      </TopSubView>
      <NowPlayingView />
    </Wrapper>
  )
}
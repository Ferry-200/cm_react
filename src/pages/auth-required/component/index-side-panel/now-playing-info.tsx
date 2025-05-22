import { styled } from "@linaria/react"
import { Avatar } from "radix-ui"
import { usePlayerNowPlaying } from "../../hook/player-hooks"
import { LucideImageOff } from "lucide-react"
import { getImageStreamUrl } from "../../../../jellyfin/streaming"
import { ITEM_ID_DYN_SEG, ROUTE_PATH } from "../../../../router"
import { Stylable } from "../../../../utils"
import { AccentLinkChip } from "../now-playing/accent-link-chip"
import { NowPlayingSlider } from "../now-playing/slider"
import { HasShuffledBtn, LoopModeBtn, PlayNextBtn, PlayPauseBtn, PlayPrevBtn } from "../now-playing/action-btns"

const Wrapper = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: end;
  padding: 16px 8px 12px 8px;
`

const LargeImgWrapper = styled(Avatar.Root)`
  display: block;
  width: 100%;
  height: auto;
  line-height: 0;
`

const LargeImg = styled(Avatar.Image)`
  width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: var(--md-elevation-2);
  object-fit: cover;
`

const Title = styled.span`
  margin-top: 16px;
  font-size: 20px;
  font-weight: bold;
  max-height: 88px;
  overflow: hidden;
`

const ArtistChipsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 8px 0 4px 0;
  gap: 4px;
`

const NowPlayingActions = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: center;
  gap: 12px;
`

export const NowPlayingInfoView = ({ style, className }: Stylable) => {
  const nowPlaying = usePlayerNowPlaying()

  return (
    <Wrapper style={style} className={className}>
      <LargeImgWrapper>
        <LargeImg src={getImageStreamUrl(nowPlaying.album.id, 268)} />
        <Avatar.Fallback>
          <LucideImageOff size='100%' strokeWidth='0.5' />
        </Avatar.Fallback>
      </LargeImgWrapper>
      <Title>{nowPlaying.title}</Title>
      <ArtistChipsWrapper>{
        nowPlaying.artists.map((artist) => (
          <AccentLinkChip
            to={{
              pathname: ROUTE_PATH.artistDetail
                .replace(ITEM_ID_DYN_SEG, `/${artist.id}`),
            }}
            key={artist.id}
          >{artist.name}</AccentLinkChip>
        ))
      }</ArtistChipsWrapper>
      <AccentLinkChip
        to={{
          pathname: ROUTE_PATH.albumDetail
            .replace(ITEM_ID_DYN_SEG, `/${nowPlaying.album.id}`),
        }}
      >{nowPlaying.album.name}</AccentLinkChip>

      <NowPlayingSlider />

      <NowPlayingActions>
        <HasShuffledBtn type="secondary" />
        <PlayPrevBtn type="primary" />
        <PlayPauseBtn type="primary" />
        <PlayNextBtn type="primary" />
        <LoopModeBtn type="secondary" />
      </NowPlayingActions>
    </Wrapper>
  )
}
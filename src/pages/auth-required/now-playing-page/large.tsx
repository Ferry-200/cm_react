import { styled } from "@linaria/react"
import { ScrollView } from "../../../component/scroll-view"
import { NowPlayingLyricView } from "../component/now-playing/lyric-view"
import { Avatar } from "radix-ui"
import { getImageStreamUrl } from "../../../jellyfin/streaming"
import { LucideImageOff, LucideListMusic, LucideMoreHorizontal } from "lucide-react"
import { usePlayerNowPlaying } from "../hook/player-hooks"
import { AccentLinkChip } from "../component/now-playing/accent-link-chip"
import { ITEM_ID_DYN_SEG, ROUTE_PATH } from "../../../router"
import { NowPlayingSlider } from "../component/now-playing/slider"
import { HasShuffledBtn, LoopModeBtn, PlayNextBtn, PlayPauseBtn, PlayPrevBtn } from "../component/now-playing/action-btns"
import { StandardIconButton } from "../../../component/icon-button"
import { useContext } from "react"
import { PlayerContext } from "../../../player/context"
import { JellyfinApiContext } from "../../../jellyfin/context"

const LyricViewWrapper = styled(ScrollView)`
  width: auto;
  flex-shrink: 1;
`

const MusicInfoWrapper = styled.div`
  margin: 16px 0;
  width: 100%;
  display: flex;
  align-items: start;
`

const LargeImgWrapper = styled(Avatar.Root)`
  flex-shrink: 0;
  display: block;
  min-height: 0;
  min-width: 0;
  width: 264px;
  height: 264px;
  line-height: 0;

  margin-right: 16px;
`

const LargeImg = styled(Avatar.Image)`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  box-shadow: var(--md-elevation-2);
  object-fit: cover;
`

const Title = styled.span`
  font-size: 36px;
  font-weight: bold;
`

const ArtistChipsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin: 8px 0 4px 0;
  gap: 4px;
`

const SliderWrapper = styled.div`
  width: 100%;
`

const ActionsWrapper = styled.div`
  margin: 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const GroupActions = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 16px;
`

const AccentPlayPauseBtn = styled(PlayPauseBtn)`
  width: 88px;
  height: 56px;
  border-radius: 28px;
`

export const NowPlayingPageLarge = () => {
  const jellyfinApi = useContext(JellyfinApiContext)!
  const player = useContext(PlayerContext)!

  const nowPlaying = usePlayerNowPlaying(player)

  const largeImgUrl = getImageStreamUrl(jellyfinApi, nowPlaying.album.id, 264)
  return (<>
    <LyricViewWrapper visibility='hidden'>
      <NowPlayingLyricView align="center" />
    </LyricViewWrapper>

    <MusicInfoWrapper>
      <LargeImgWrapper>
        <LargeImg src={largeImgUrl} />
        <Avatar.Fallback>
          <LucideImageOff size='100%' strokeWidth='0.5' />
        </Avatar.Fallback>
      </LargeImgWrapper>

      <div>
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

        {
          nowPlaying.album.name.length > 0 &&
          (<AccentLinkChip
            style={{ flexShrink: '0' }}
            to={{
              pathname: ROUTE_PATH.albumDetail
                .replace(ITEM_ID_DYN_SEG, `/${nowPlaying.album.id}`),
            }}
          >{nowPlaying.album.name}</AccentLinkChip>)
        }
      </div>
    </MusicInfoWrapper>

    <SliderWrapper><NowPlayingSlider /></SliderWrapper>

    <ActionsWrapper>
      <GroupActions>
        <HasShuffledBtn type="standard" />
        <LoopModeBtn type="standard" />
      </GroupActions>
      <GroupActions>
        <PlayPrevBtn type="secondary" />
        <AccentPlayPauseBtn type="primary" />
        <PlayNextBtn type="secondary" />
      </GroupActions>
      <GroupActions>
        <StandardIconButton onClick={() => { }}>
          <LucideListMusic />
        </StandardIconButton>
        <StandardIconButton onClick={() => { }}>
          <LucideMoreHorizontal />
        </StandardIconButton>
      </GroupActions>
    </ActionsWrapper>
  </>)
}
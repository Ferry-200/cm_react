import { styled } from "@linaria/react"
import { StandardIconButton } from "../../../component/icon-button"
import { LucideImageOff, LucideListMusic, LucideMoreHorizontal } from "lucide-react"
import { Avatar } from "radix-ui"
import { getImageStreamUrl } from "../../../jellyfin/streaming"
import { usePlayerNowPlaying } from "../hook/player-hooks"
import { AccentLinkChip } from "../component/now-playing/accent-link-chip"
import { ITEM_ID_DYN_SEG, ROUTE_PATH } from "../../../router"
import { NowPlayingSlider } from "../component/now-playing/slider"
import { HasShuffledBtn, LoopModeBtn, PlayNextBtn, PlayPauseBtn, PlayPrevBtn } from "../component/now-playing/action-btns"
import { MouseEventHandler, useContext, useState } from "react"
import { AudioInfo } from "../../../player/playlist"
import { NowPlayingLyricView } from "../component/now-playing/lyric-view"
import { PlaylistView } from "../component/now-playing/playlist-view"
import { ScrollView } from "../../../component/scroll-view"
import { MDLyric } from "../../../component/md-lyric"
import { JellyfinApiContext } from "../../../jellyfin/context"
import { usePlayer } from "../../../player/context"

const LargeImgWrapper = styled(Avatar.Root)`
  margin: auto 0;
  display: block;
  min-height: 0;
  min-width: 0;
  max-width: 500px;
  max-height: 500px;
  line-height: 0;
`

const LargeImg = styled(Avatar.Image)`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  box-shadow: var(--md-elevation-2);
  object-fit: cover;
`

const Title = styled.span`
  margin-top: 8px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`

const ArtistChipsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 8px 0 4px 0;
  gap: 4px;
`

const SliderWrapper = styled.div`
  width: 100%;
`

const MainActionsWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`

const AccentPlayPauseBtn = styled(PlayPauseBtn)`
  width: 88px;
  height: 56px;
  border-radius: 28px;
`

const OtherActionsWrapper = styled(MainActionsWrapper)`
  width: 100%;
  justify-content: space-around;
`

type MainViewType = 'AlbumArt' | 'Lyric' | 'Playlist'


type MainViewProp = {
  view: MainViewType
  nowPlaying: AudioInfo
}

const MainViewScrollWrapper = styled(ScrollView)`
  flex-shrink: 1;
`

const MainView = ({ nowPlaying, view }: MainViewProp) => {
  const jellyfinApi = useContext(JellyfinApiContext)!
  switch (view) {
    case "AlbumArt": {
      const largeImgUrl = getImageStreamUrl(jellyfinApi, nowPlaying.album.id, 400)
      return (
        <LargeImgWrapper>
          <LargeImg src={largeImgUrl} />
          <Avatar.Fallback>
            <LucideImageOff size='100%' strokeWidth='0.5' />
          </Avatar.Fallback>
        </LargeImgWrapper>
      )
    }
    case "Lyric": return (<MainViewScrollWrapper visibility='hidden'><NowPlayingLyricView /></MainViewScrollWrapper>)
    case "Playlist": return (<MainViewScrollWrapper><PlaylistView /></MainViewScrollWrapper>)
  }
}

type ShowViewBtnProp = {
  view: MainViewType,
  onClick: MouseEventHandler<HTMLButtonElement>
}

const ShowLyricViewBtn = ({ view, onClick }: ShowViewBtnProp) => (
  <StandardIconButton onClick={onClick}>
    <MDLyric opacity={view === 'Lyric' ? 1.0 : 0.12} />
  </StandardIconButton>
)

const ShowPlaylistViewBtn = ({ view, onClick }: ShowViewBtnProp) => (
  <StandardIconButton onClick={onClick}>
    <LucideListMusic opacity={view === 'Playlist' ? 1.0 : 0.12} />
  </StandardIconButton>
)

export const NowPlayingPageSmall = () => {
  const player = usePlayer()

  const nowPlaying = usePlayerNowPlaying(player)
  const [mainView, setMainView] = useState<MainViewType>('AlbumArt')

  return (<>
    <MainView view={mainView} nowPlaying={nowPlaying} />

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
      style={{ flexShrink: '0' }}
      to={{
        pathname: ROUTE_PATH.albumDetail
          .replace(ITEM_ID_DYN_SEG, `/${nowPlaying.album.id}`),
      }}
    >{nowPlaying.album.name}</AccentLinkChip>

    <SliderWrapper><NowPlayingSlider /></SliderWrapper>

    <MainActionsWrapper>
      <PlayPrevBtn type="secondary" />
      <AccentPlayPauseBtn type="primary" />
      <PlayNextBtn type="secondary" />
    </MainActionsWrapper>

    <OtherActionsWrapper>
      <HasShuffledBtn type="standard" />
      <LoopModeBtn type="standard" />

      <ShowLyricViewBtn view={mainView} onClick={
        () => setMainView(mainView === 'Lyric' ? 'AlbumArt' : 'Lyric')
      } />

      <ShowPlaylistViewBtn view={mainView} onClick={
        () => setMainView(mainView === 'Playlist' ? 'AlbumArt' : 'Playlist')
      } />

      <StandardIconButton onClick={() => { }}>
        <LucideMoreHorizontal />
      </StandardIconButton>
    </OtherActionsWrapper>
  </>)
}
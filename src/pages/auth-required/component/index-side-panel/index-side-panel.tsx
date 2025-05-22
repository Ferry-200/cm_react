import { styled } from "@linaria/react";
import { ScrollView } from "../../../../component/scroll-view";
import { NowPlayingLyricView } from "../now-playing/lyric-view";
import { NowPlayingInfoView } from "./now-playing-info";
import { SegmentedButton, SegmentedButtonOption } from "../../../../component/segmented-button";
import { useState } from "react";
import { MDLyric } from "../../../../component/md-lyric";
import { LucideFullscreen, LucideListMusic } from "lucide-react";
import { PlaylistView } from "../now-playing/playlist-view";
import { StandardIconButton } from "../../../../component/icon-button";
import { useNavigate } from "react-router";
import { ROUTE_PATH } from "../../../../router";

const Wrapper = styled.div`
  flex-shrink: 0;
  width: 300px;
  height: 100vh;
  background-color: var(--md-surface-container);
  display: flex;
  flex-direction: column;
  padding: 8px;
`

const TopTabViewHeader = styled.div`
  padding: 0 8px 8px 8px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
`

const TopTabViewMain = styled(ScrollView)`
  max-height: 50%;
`

const topTabs: SegmentedButtonOption<'lyric' | 'playlist'>[] = [
  {
    icon: <MDLyric />,
    val: 'lyric'
  },
  {
    icon: <LucideListMusic />,
    val: 'playlist'
  }
]

const TopTabView = () => {
  const nav = useNavigate()
  const [tab, setTab] = useState(() => topTabs[0].val)

  const isLyricTab = tab === 'lyric'

  return (<>
    <TopTabViewHeader>
      <SegmentedButton
        options={topTabs}
        selected={tab}
        onSelected={(selected) => {
          setTab(selected)
        }} />
      <StandardIconButton onClick={
        () => void nav({ pathname: ROUTE_PATH.nowPlaying })
      }>
        <LucideFullscreen />
      </StandardIconButton>
    </TopTabViewHeader>
    <TopTabViewMain visibility={isLyricTab ? 'hidden' : undefined}>
      {
        isLyricTab
          ? <NowPlayingLyricView />
          : <PlaylistView />
      }
    </TopTabViewMain>
  </>)
}

export const IndexSidePanel = () => {
  return (
    <Wrapper>
      <TopTabView />
      <NowPlayingInfoView />
    </Wrapper>
  )
}
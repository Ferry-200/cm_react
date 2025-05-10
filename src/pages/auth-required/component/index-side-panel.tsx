import { styled } from "@linaria/react";
import { ScrollView } from "../../../component/scroll-view";
import { NowPlayingLyricView } from "./now-playing-lyric-view";
import { NowPlayingView } from "./now-playing-info-view";
import { SegmentedButton, SegmentedButtonOption } from "../../../component/segmented-button";
import { useState } from "react";
import { MDLyric } from "../../../component/md-lyric";
import { LucideListMusic } from "lucide-react";
import { PlaylistView } from "./playlist-view";
import { JSXWhen } from "../../../utils";

const Wrapper = styled.div`
  flex-shrink: 0;
  width: 300px;
  height: 100vh;
  background-color: var(--md-surface-container);
  display: flex;
  flex-direction: column;
  padding: 8px;
`

const TopSubViewHeader = styled.div`
  padding: 0 8px 8px 8px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
`

const TopSubViewMain = styled(ScrollView)`
  max-height: 50%;
`

const topViews = [
  {
    icon: <MDLyric />,
    val: 'lyric'
  },
  {
    icon: <LucideListMusic />,
    val: 'playlist'
  }
] as SegmentedButtonOption<'lyric' | 'playlist'>[]

const TopSubView = () => {
  const [view, setView] = useState(() => topViews[0].val)

  return (<>
    <TopSubViewHeader>
      <span>
        <JSXWhen flag={view === 'lyric'}
          t='歌词'
          f='播放列表'
        />
      </span>
      <SegmentedButton
        options={topViews}
        selected={view}
        onSelected={(selected) => {
          setView(selected)
        }} />
    </TopSubViewHeader>
    <TopSubViewMain>
      <JSXWhen flag={view === 'lyric'}
        t={<NowPlayingLyricView />}
        f={<PlaylistView />}
      />
    </TopSubViewMain>
  </>)
}

export const IndexSidePanel = () => {
  return (
    <Wrapper>
      <TopSubView />
      <NowPlayingView />
    </Wrapper>
  )
}
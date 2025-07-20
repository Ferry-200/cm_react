import { styled } from "@linaria/react"
import { usePlayerDuration, usePlayerIsPlaying, usePlayerNowPlaying, usePlayerPosition } from "../hook/player-hooks"
import { Avatar } from "radix-ui"
import { getImageStreamUrl } from "../../../jellyfin/streaming"
import { LucideImageOff, LucidePause, LucidePlay } from "lucide-react"
import { Stylable } from "../../../utils"
import { StandardIconButton } from "../../../component/icon-button"
import { useNavigate } from "react-router"
import { ROUTE_PATH } from "../../../router"
import { useContext } from "react"
import { PlayerContext } from "../../../player/context"
import { JellyfinApiContext } from "../../../jellyfin/context"

const PlayPauseBtnInner = styled(StandardIconButton)`
  margin-left: auto;
  z-index: 3;
`

const Wrapper = styled.div`
  height: 72px;
  flex-shrink: 0;
  color: var(--md-on-primary-container);
  background-color: var(--md-surface-container);
  padding: 8px 16px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;

  * {
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    border-radius: inherit;
    pointer-events: none;
    transition: background-color 150ms;
    z-index: 2;
  }

  /* 在支持的浏览器上使用更精细的 hover, active 效果 */
  @supports (selector(:has(*))) {
    &:hover:not(:has(${PlayPauseBtnInner}:hover))::before {
      background-color: var(--md-surface-hover);
    }

    &:active:not(:has(${PlayPauseBtnInner}:active))::before {
      background-color: var(--md-surface-active);
    }
  }

  /* 在不支持的浏览器上保留基本的 hover, active 效果 */
  @supports not (selector(:has(*))) {
    &:hover::before {
      background-color: var(--md-surface-hover);
    }

    &:active::before {
      background-color: var(--md-surface-active);
    }
  }
`

const NowPlayingImgWrapper = styled(Avatar.Root)`
  display: block;
  height: 56px;
  width: 56px;
  line-height: 0;
`

const NowPlayingImg = styled(Avatar.Image)`
  height: 56px;
  width: 56px;
  border-radius: 4px;
  box-shadow: var(--md-elevation-2);
  object-fit: cover;
`

const NowPlayingTitle = styled.span`
  font-size: 18px;
  margin: 0 16px;
  white-space: nowrap;      /* 防止换行 */
  overflow: hidden;         /* 隐藏溢出的内容 */
  text-overflow: ellipsis;  /* 在文本溢出时显示省略号 */
`

type BackgroundProgressBarProp = Stylable & {
  /** 0% ~ 100% */
  percent: string
}

const BackgroundProgressBarInner = styled.div<BackgroundProgressBarProp>`
  background-color: var(--md-primary-container);
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.percent};
  max-width: 100%;
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
`

const BackgroundProgressBar = () => {
  const player = useContext(PlayerContext)!
  const pos = usePlayerPosition(player)
  const dur = usePlayerDuration(player)
  const percent = `${(pos / dur) * 100}%`

  return <BackgroundProgressBarInner percent={percent} />
}

const PlayPauseBtn = () => {
  const player = useContext(PlayerContext)!

  const isPlaying = usePlayerIsPlaying(player)

  return (
    <PlayPauseBtnInner onClick={(e) => {
      e.stopPropagation()
      player.togglePlayAndPause()
    }}>
      {isPlaying ? <LucidePause /> : <LucidePlay />}
    </PlayPauseBtnInner>
  )
}

export const NowPlayingBottomPanel = ({ className, style }: Stylable) => {
  const jellyfinApi = useContext(JellyfinApiContext)!
  const player = useContext(PlayerContext)!
  
  const nowPlaying = usePlayerNowPlaying(player)
  const navigate = useNavigate()

  const nowPlayingImgUrl = getImageStreamUrl(jellyfinApi, nowPlaying.album.id, 56)
  return (
    <Wrapper
      className={`${className} bottom-panel`}
      style={style}
      onClick={() => {
        void navigate({ pathname: ROUTE_PATH.nowPlaying })
      }}
    >
      <BackgroundProgressBar />
      <NowPlayingImgWrapper>
        <NowPlayingImg src={nowPlayingImgUrl} />
        <Avatar.Fallback>
          <LucideImageOff size='100%' strokeWidth='1' />
        </Avatar.Fallback>
      </NowPlayingImgWrapper>
      <NowPlayingTitle>{nowPlaying.title}</NowPlayingTitle>
      <PlayPauseBtn />
    </Wrapper>
  )
}
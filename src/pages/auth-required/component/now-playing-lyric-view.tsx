import { styled } from "@linaria/react"
import { CMLyricLine } from "../../../jellyfin/browsing"
import { usePlayerNowPlaying } from "../hook/player-hooks"
import { forwardRef, useEffect, useRef } from "react"
import { PLAYER } from "../../../player"
import { useAudioLyric, useCurrLyricLineState } from "../hook/use-lyric"
import { TransitionLyricTile } from "./transition-lyric-tile"
import { JSXWhen, when } from "../../../utils"

export const LyricTileInner = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  color: var(--md-on-surface-variant);
  font-size: 20px;
  font-weight: bold;
  position: relative;
  border-radius: 8px;
  cursor: pointer;

  &>*:first-child {
    font-size: 24px;
  }

  &.curr {
    color: var(--md-on-surface);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    pointer-events: none;
  }

  &:not(.curr)::before {
    backdrop-filter: blur(2px);
  }

  &:hover::before {
    background-color: var(--md-surface-hover);
  }

  &:active::before {
    background-color: var(--md-surface-active);
  }
`

type LyricTileProp = {
  lyricLine: CMLyricLine,
  curr: boolean
}

const LyricTile = forwardRef<HTMLDivElement, LyricTileProp>(({ lyricLine, curr }, ref) => {
  return (
    <LyricTileInner
      ref={ref}
      className={when(curr, 'curr')}
      onClick={() => PLAYER.seek(lyricLine.start)}
    >
      {
        lyricLine.lines && lyricLine.lines.map(
          (val, index) => (<span key={index}>{val}</span>)
        )
      }
    </LyricTileInner>
  )
})

type LyricViewProp = {
  lyric: CMLyricLine[],
  curr: { index: number, instant: boolean }
}

const LyricView = ({ lyric, curr }: LyricViewProp) => {
  const currLine = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log(
      "delay:",
      (PLAYER.getPosition() - lyric[curr.index].start).toFixed(2)
    )

    currLine.current?.scrollIntoView({
      block: 'center',
      behavior: when(curr.instant, 'instant', 'smooth')
    })
  }, [curr, lyric])

  return (<>
    {
      lyric.map((line, index) => {
        const isCurr = curr.index === index
        const isTransition = (line.isTransition ?? false)
        return (
          <JSXWhen flag={line.lines && line.lines.length > 0}
            t={(<LyricTile
              key={index}
              ref={when(isCurr, currLine)}
              lyricLine={line}
              curr={isCurr}
            />)}
            f={(<JSXWhen flag={isTransition && isCurr}
              t={(<TransitionLyricTile
                key={index}
                ref={currLine}
                lyricLine={line}
              />)}
            />)}
          />
        )
      })
    }
  </>)
}

type CurrLineWrapperProp = {
  lyric: CMLyricLine[],
  itemId: string
}

const CurrLineWrapper = ({ lyric, itemId }: CurrLineWrapperProp) => {
  const curr = useCurrLyricLineState(lyric, itemId)

  return <LyricView lyric={lyric} curr={curr} />
}

export const NowPlayingLyricView = () => {
  const nowPlaying = usePlayerNowPlaying()
  const { data } = useAudioLyric(nowPlaying.id)

  return (
    data && <CurrLineWrapper lyric={data} itemId={nowPlaying.id} />
  )
}
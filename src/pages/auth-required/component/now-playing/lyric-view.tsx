import { styled } from "@linaria/react"
import { forwardRef, useEffect, useRef } from "react"
import { CMLyricLine } from "../../../../jellyfin/browsing"
import { PLAYER } from "../../../../player"
import { TransitionLyricTile } from "./transition-lyric-tile"
import { usePlayerNowPlaying } from "../../hook/player-hooks"
import { useCurrLyricLineState, useAudioLyric } from "../../hook/use-lyric"
import { LyricTileInner } from "./lyric-tile-inner"

type LyricTileProp = {
  lyricLine: CMLyricLine,
  curr: boolean
}

const LyricTile = forwardRef<HTMLDivElement, LyricTileProp>(({ lyricLine, curr }, ref) => {
  return (
    <LyricTileInner
      ref={ref}
      className={curr ? 'curr' : undefined}
      onClick={() => PLAYER.seek(lyricLine.start)}
    >
      {
        lyricLine.lines?.map(
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
    if (curr.index < lyric.length) {
      console.debug(
        "delay:",
        (PLAYER.getPosition() - lyric[curr.index].start).toFixed(2)
      )
    }

    currLine.current?.scrollIntoView({
      block: 'center',
      behavior: curr.instant ? 'instant' : 'smooth'
    })
  }, [curr, lyric])

  return (<>
    {
      lyric.map((line, index) => (
        line.lines && line.lines.length > 0
          ? (<LyricTile
            key={index}
            ref={curr.index === index ? currLine : undefined}
            lyricLine={line}
            curr={curr.index === index}
          />)
          : line.isTransition && curr.index === index
            ? (<TransitionLyricTile
              key={index}
              ref={currLine}
              lyricLine={line}
            />)
            : undefined
      ))
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

const EmptyMsg = styled.span`
  margin-left: 8px;
`

export const NowPlayingLyricView = () => {
  const nowPlaying = usePlayerNowPlaying()
  const { data } = useAudioLyric(nowPlaying.id)

  if (!data || data.length === 0) return (<EmptyMsg>无歌词</EmptyMsg>)

  return (
    data && <CurrLineWrapper lyric={data} itemId={nowPlaying.id} />
  )
}
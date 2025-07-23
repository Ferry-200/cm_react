import { LucideChevronLeft, LucideChevronRight, LucidePause, LucidePlay, LucideRepeat, LucideRepeat1, LucideShuffle } from "lucide-react"
import { usePlayerHasShuffled, usePlayerIsPlaying, usePlayerLoopMode } from "../../hook/player-hooks"
import { useMemo, useState } from "react"
import { RepeatOff } from "../../../../component/repeat-off"
import { LoopMode } from "../../../../player/playlist"
import { ShuffleOff } from "../../../../component/shuffle-off"
import { Stylable } from "../../../../utils"
import { usePlayer } from "../../../../player/context"
import { IconButtonVariant, UniIconButton } from "../../../../component/icon-button"

type NowPlayingActionBtnProp = Stylable & IconButtonVariant

export const PlayPrevBtn = ({ style, className, type }: NowPlayingActionBtnProp) => {
  const player = usePlayer()

  return (
    <UniIconButton style={style} className={className} type={type}
      onClick={() => player.playPrev()}
    >
      <LucideChevronLeft />
    </UniIconButton>
  )
}

export const PlayNextBtn = ({ style, className, type }: NowPlayingActionBtnProp) => {
  const player = usePlayer()

  return (
    <UniIconButton type={type} style={style} className={className}
      onClick={() => player.playNext()}
    >
      <LucideChevronRight />
    </UniIconButton>
  )
}

export const PlayPauseBtn = ({ style, className, type }: NowPlayingActionBtnProp) => {
  const player = usePlayer()
  
  const isPlaying = usePlayerIsPlaying(player)

  return (
    <UniIconButton type={type}
      style={style} className={className}
      onClick={() => player.togglePlayAndPause()}
    >
      {isPlaying ? <LucidePause /> : <LucidePlay />}
    </UniIconButton>
  )
}

export const LoopModeBtn = ({ style, className, type }: NowPlayingActionBtnProp) => {
  const player = usePlayer()
  
  const modes = useMemo(() => Object.keys(LoopMode), [])
  const icons = useMemo(() => ({
    playlist: <LucideRepeat />,
    single: <LucideRepeat1 />,
    disable: <RepeatOff />
  }), [])

  const loopMode = usePlayerLoopMode(player)
  const [index, setIndex] = useState(() => modes.indexOf(loopMode))

  return (
    <UniIconButton type={type}
      style={style} className={className}
      onClick={() => {
        const next = (index + 1) % modes.length
        player.playlist.setLoopMode(modes[next] as LoopMode)
        setIndex(next)
      }}
    >
      {icons[loopMode]}
    </UniIconButton>
  )
}

export const HasShuffledBtn = ({ style, className, type }: NowPlayingActionBtnProp) => {
  const player = usePlayer()
  
  const hasShuffled = usePlayerHasShuffled(player)

  return (
    <UniIconButton type={type}
      style={style} className={className}
      onClick={() => player.playlist.setHasShuffled(!hasShuffled)}
    >
      {hasShuffled ? <LucideShuffle /> : <ShuffleOff />}
    </UniIconButton>
  )
}
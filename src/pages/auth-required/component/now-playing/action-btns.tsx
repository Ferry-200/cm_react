import { LucideChevronLeft, LucideChevronRight, LucidePause, LucidePlay, LucideRepeat, LucideRepeat1, LucideShuffle } from "lucide-react"
import { IconButton, IconButtonType } from "../../../../component/icon-button"
import { PLAYER } from "../../../../player"
import { usePlayerHasShuffled, usePlayerIsPlaying, usePlayerLoopMode } from "../../hook/player-hooks"
import { useMemo, useState } from "react"
import { RepeatOff } from "../../../../component/repeat-off"
import { LoopMode } from "../../../../player/playlist"
import { ShuffleOff } from "../../../../component/shuffle-off"
import { Stylable } from "../../../../utils"

type NowPlayingActionBtnProp = Stylable & {
  type: IconButtonType
}

export const PlayPrevBtn = ({ style, className, type }: NowPlayingActionBtnProp) => (
  <IconButton type={type} style={style} className={className}
    onClick={() => PLAYER.playPrev()}
  >
    <LucideChevronLeft />
  </IconButton>
)

export const PlayNextBtn = ({ style, className, type }: NowPlayingActionBtnProp) => (
  <IconButton type={type} style={style} className={className}
    onClick={() => PLAYER.playNext()}
  >
    <LucideChevronRight />
  </IconButton>
)

export const PlayPauseBtn = ({ style, className, type }: NowPlayingActionBtnProp) => {
  const isPlaying = usePlayerIsPlaying()

  return (
    <IconButton type={type}
      style={style} className={className}
      onClick={() => PLAYER.togglePlayAndPause()}
    >
      {isPlaying ? <LucidePause /> : <LucidePlay />}
    </IconButton>
  )
}

export const LoopModeBtn = ({ style, className, type }: NowPlayingActionBtnProp) => {
  const modes = useMemo(() => Object.keys(LoopMode), [])
  const icons = useMemo(() => ({
    playlist: <LucideRepeat />,
    single: <LucideRepeat1 />,
    disable: <RepeatOff />
  }), [])

  const loopMode = usePlayerLoopMode()
  const [index, setIndex] = useState(() => modes.indexOf(loopMode))

  return (
    <IconButton type={type}
      style={style} className={className}
      onClick={() => {
        const next = (index + 1) % modes.length
        PLAYER.playlist.setLoopMode(modes[next] as LoopMode)
        setIndex(next)
      }}
    >
      {icons[loopMode]}
    </IconButton>
  )
}

export const HasShuffledBtn = ({ style, className, type }: NowPlayingActionBtnProp) => {
  const hasShuffled = usePlayerHasShuffled()

  return (
    <IconButton type={type}
      style={style} className={className}
      onClick={() => PLAYER.playlist.setHasShuffled(!hasShuffled)}
    >
      {hasShuffled ? <LucideShuffle /> : <ShuffleOff />}
    </IconButton>
  )
}
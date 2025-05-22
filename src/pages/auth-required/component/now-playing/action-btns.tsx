import { LucideChevronLeft, LucideChevronRight, LucidePause, LucidePlay, LucideRepeat, LucideRepeat1, LucideShuffle } from "lucide-react"
import { PrimaryIconButton, SecondaryIconButton } from "../../../../component/icon-button"
import { PLAYER } from "../../../../player"
import { usePlayerHasShuffled, usePlayerIsPlaying, usePlayerLoopMode } from "../../hook/player-hooks"
import { useMemo, useState } from "react"
import { RepeatOff } from "../../../../component/repeat-off"
import { LoopMode } from "../../../../player/playlist"
import { ShuffleOff } from "../../../../component/shuffle-off"
import { Stylable } from "../../../../utils"

export const PlayPrevBtn = ({ style, className }: Stylable) => (
  <PrimaryIconButton style={style} className={className}
    onClick={() => PLAYER.playPrev()}
  >
    <LucideChevronLeft />
  </PrimaryIconButton>
)

export const PlayNextBtn = ({ style, className }: Stylable) => (
  <PrimaryIconButton style={style} className={className}
    onClick={() => PLAYER.playNext()}
  >
    <LucideChevronRight />
  </PrimaryIconButton>
)

export const PlayPauseBtn = ({ style, className }: Stylable) => {
  const isPlaying = usePlayerIsPlaying()

  return (
    <PrimaryIconButton
      style={style} className={className}
      onClick={() => PLAYER.togglePlayAndPause()}
    >
      {isPlaying ? <LucidePause /> : <LucidePlay />}
    </PrimaryIconButton>
  )
}

export const LoopModeBtn = ({ style, className }: Stylable) => {
  const modes = useMemo(() => Object.keys(LoopMode), [])
  const icons = useMemo(() => ({
    playlist: <LucideRepeat />,
    single: <LucideRepeat1 />,
    disable: <RepeatOff />
  }), [])

  const loopMode = usePlayerLoopMode()
  const [index, setIndex] = useState(() => modes.indexOf(loopMode))

  return (
    <SecondaryIconButton
      style={style} className={className}
      onClick={() => {
        const next = (index + 1) % modes.length
        PLAYER.playlist.setLoopMode(modes[next] as LoopMode)
        setIndex(next)
      }}
    >
      {icons[loopMode]}
    </SecondaryIconButton>
  )
}

export const HasShuffledBtn = ({ style, className }: Stylable) => {
  const hasShuffled = usePlayerHasShuffled()

  return (
    <SecondaryIconButton
      style={style} className={className}
      onClick={() => PLAYER.playlist.setHasShuffled(!hasShuffled)}
    >
      {hasShuffled ? <LucideShuffle /> : <ShuffleOff />}
    </SecondaryIconButton>
  )
}
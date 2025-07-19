import { LucideChevronLeft, LucideChevronRight, LucidePause, LucidePlay, LucideRepeat, LucideRepeat1, LucideShuffle } from "lucide-react"
import { usePlayerHasShuffled, usePlayerIsPlaying, usePlayerLoopMode } from "../../hook/player-hooks"
import { MouseEventHandler, ReactNode, useContext, useMemo, useState } from "react"
import { RepeatOff } from "../../../../component/repeat-off"
import { LoopMode } from "../../../../player/playlist"
import { ShuffleOff } from "../../../../component/shuffle-off"
import { Stylable } from "../../../../utils"
import { PrimaryIconButton, SecondaryIconButton, StandardIconButton } from "../../../../component/icon-button"
import { PlayerContext } from "../../../../player/context"

type IconButtonVariant = {
  type: 'standard' | 'primary' | 'secondary'
}

type UniIconButtonProp = Stylable & IconButtonVariant & {
  onClick: MouseEventHandler<HTMLButtonElement>,
  children: ReactNode
}

const UniIconButton = (
  { style, className, type, children, onClick }: UniIconButtonProp
) => {
  switch (type) {
    case "standard": return (
      <StandardIconButton style={style} className={className}
        onClick={onClick}
      >{children}</StandardIconButton>
    )
    case "primary": return (
      <PrimaryIconButton style={style} className={className}
        onClick={onClick}
      >{children}</PrimaryIconButton>
    )
    case "secondary": return (
      <SecondaryIconButton style={style} className={className}
        onClick={onClick}
      >{children}</SecondaryIconButton>
    )
  }
}

type NowPlayingActionBtnProp = Stylable & IconButtonVariant

export const PlayPrevBtn = ({ style, className, type }: NowPlayingActionBtnProp) => {
  const player = useContext(PlayerContext)!

  return (
    <UniIconButton style={style} className={className} type={type}
      onClick={() => player.playPrev()}
    >
      <LucideChevronLeft />
    </UniIconButton>
  )
}

export const PlayNextBtn = ({ style, className, type }: NowPlayingActionBtnProp) => {
  const player = useContext(PlayerContext)!

  return (
    <UniIconButton type={type} style={style} className={className}
      onClick={() => player.playNext()}
    >
      <LucideChevronRight />
    </UniIconButton>
  )
}

export const PlayPauseBtn = ({ style, className, type }: NowPlayingActionBtnProp) => {
  const player = useContext(PlayerContext)!
  
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
  const player = useContext(PlayerContext)!
  
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
  const player = useContext(PlayerContext)!
  
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
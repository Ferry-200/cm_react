import { styled } from "@linaria/react"
import { Slider } from "radix-ui"
import { usePlayerDuration, usePlayerPosition } from "../../hook/player-hooks"
import { useState } from "react"
import { usePlayer } from "../../../../player/context"

const SliderRoot = styled(Slider.Root)`
  margin-top: 12px;
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 100%;
  height: 24px;
`

const SliderTrack = styled(Slider.Track)`
  background-color: var(--md-secondary-container);
  position: relative;
  flex-grow: 1;
  border-radius: 2px;
  height: 8px;
`

const SliderRange = styled(Slider.Range)`
  position: absolute;
  background-color: var(--md-primary);
  border-radius: 2px;
  height: 100%;
`

const SliderThumb = styled(Slider.Thumb)`
  display: block;
  width: 4px;
  height: 24px;
  background-color: var(--md-primary);
  border-radius: 2px;
`

const SliderTextWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

function formatTime(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time) % 60

  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`

  return `${minutesStr} : ${secondsStr}`
}

export const NowPlayingSlider = () => {
  const player = usePlayer()

  const pos = usePlayerPosition(player)
  const dur = usePlayerDuration(player)
  const [isDragging, setIsDragging] = useState(false)
  const [draggingValue, setDraggingValue] = useState(0)

  return (<>
    <SliderRoot
      max={1000}
      value={[isDragging ? draggingValue : Math.floor((pos / dur) * 1000)]}
      onValueChange={([value]) => {
        if (!isDragging) setIsDragging(true)

        setDraggingValue(value)
      }}
      onValueCommit={([value]) => {
        setDraggingValue(value)
        player.seek((value / 1000) * dur, () => {
          setIsDragging(false)
        })
      }}
    >
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
      <SliderThumb />
    </SliderRoot>

    <SliderTextWrapper>
      <span>{formatTime(pos)}</span>
      <span>{formatTime(dur)}</span>
    </SliderTextWrapper>
  </>)
}
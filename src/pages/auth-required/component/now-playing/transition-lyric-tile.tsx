import { forwardRef, useEffect, useRef } from "react"
import { PLAYER } from "../../../../player"
import { CMLyricLine } from "../../../../jellyfin/browsing"
import { LyricTileInner } from "./lyric-tile-inner"
import { styled } from "@linaria/react"

type TransitionLyricTileProp = {
  lyricLine: CMLyricLine
}

const TransitionPainter = styled.canvas`
  width: 64px;
  height: 16px;
`

export const TransitionLyricTile = forwardRef<HTMLDivElement, TransitionLyricTileProp>(
  ({ lyricLine }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
      const canvas = canvasRef.current!.getContext("2d")

      // rgb(25, 28, 32)
      const onSurface = getComputedStyle(document.body).getPropertyValue('--md-on-surface')

      // rgb(25, 28, 32
      const onSurfaceTemp = onSurface.slice(0, onSurface.indexOf(')'))

      const fillCircle = (x: number, y: number, radius: number) => {
        canvas!.beginPath()
        canvas!.arc(x, y, radius, 0, 2 * Math.PI)
        canvas!.fill()
      }

      const clampNum = (value: number, min: number, max: number) => {
        return Math.max(min, Math.min(max, value))
      }

      const baseOpacity = 0.08
      const endingAniDur = 150
      const durMs = lyricLine.dur! * 1000
      const breathingAniDur = durMs - endingAniDur
      const cycle = breathingAniDur / 7

      let rafId: number

      const render = () => {
        const pos = PLAYER.getPosition()
        const elapsed = (pos - lyricLine.start) * 1000
        const times = Math.floor(elapsed / cycle)

        const isEndingAni = elapsed >= breathingAniDur

        const x = isEndingAni
          ? clampNum((elapsed - breathingAniDur) / endingAniDur, 0, 1)
          : (elapsed % cycle) / cycle

        const sizeAni = times % 2 === 0 ? x : 1 - x

        const r = isEndingAni
          ? 8 * sizeAni
          : 6 + 2 * sizeAni

        canvas!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)

        const opacityAni = clampNum(elapsed / durMs, 0, 1)
        const o1 = clampNum(opacityAni * 3 + baseOpacity, 0, 1)
        canvas!.fillStyle = onSurfaceTemp + `, ${o1})`
        fillCircle(r, 8, r)

        const o2 = clampNum(Math.max(0, (opacityAni - 1 / 3) * 3) + baseOpacity, 0, 1)
        canvas!.fillStyle = onSurfaceTemp + `, ${o2})`
        fillCircle(4 * r, 8, r)

        const o3 = clampNum(Math.max(0, (opacityAni - 2 / 3) * 3) + baseOpacity, 0, 1)
        canvas!.fillStyle = onSurfaceTemp + `, ${o3})`
        fillCircle(7 * r, 8, r)

        if (elapsed <= durMs) {
          rafId = requestAnimationFrame(render)
        }
      };

      rafId = requestAnimationFrame(render)
      return () => cancelAnimationFrame(rafId)
    }, [lyricLine])

    return (
      <LyricTileInner
        ref={ref}
        className='curr'
        onClick={() => PLAYER.seek(lyricLine.start)}
      >
        <TransitionPainter height='16px' width='64px' ref={canvasRef}>Transition</TransitionPainter>
      </LyricTileInner>
    )
  }
)
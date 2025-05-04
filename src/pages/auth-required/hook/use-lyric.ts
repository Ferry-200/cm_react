import useSWR from "swr";
import { CMLyricLine, getAudioLyric } from "../../../jellyfin/browsing";
import { PLAYER } from "../../../player";
import { useEffect, useRef, useState } from "react";

export function useAudioLyric(itemId: string) {
    const { data, isLoading } = useSWR(itemId, getAudioLyric)

    return { data, isLoading }
}

function findCurrLineIndex(lyric: CMLyricLine[], start: number = 0) {
    const pos = PLAYER.getPosition()
    for (let i = start; i < lyric.length; i++) {
        const item = lyric[i]

        if (pos < item.start) {
            return i === 0 ? 0 : i - 1
        }
    }
    return lyric.length - 1
}

export function useCurrLyricLine(lyric: CMLyricLine[]) {
    const [lineIndex, setLineIndex] = useState(() => findCurrLineIndex(lyric))
    const lineIndexRef = useRef(lineIndex)

    useEffect(() => {
        return PLAYER.onNowPlayingChanged(() => {
            const index = findCurrLineIndex(lyric)
            lineIndexRef.current = index
            setLineIndex(index)
        })
    }, [lyric])

    useEffect(() => {
        return PLAYER.onSeeked(() => {
            const index = findCurrLineIndex(lyric)
            lineIndexRef.current = index
            setLineIndex(index)
        })
    }, [lyric])

    useEffect(() => {
        let rafId: number

        const update = () => {
            const newIndex = findCurrLineIndex(lyric, lineIndexRef.current)

            if (newIndex !== lineIndexRef.current) {
                lineIndexRef.current = newIndex
                setLineIndex(newIndex)
            }

            if (PLAYER.getIsPlaying()) rafId = requestAnimationFrame(update)
        }

        rafId = requestAnimationFrame(update)

        const unSubOnPlay = PLAYER.onPlay(update)
        const unSubOnPause = PLAYER.onPause(() => cancelAnimationFrame(rafId))

        return () => {
            unSubOnPlay()
            unSubOnPause()
            cancelAnimationFrame(rafId)
        }
    }, [lyric])

    return lineIndex
}
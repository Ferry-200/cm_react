import useSWR from "swr";
import { CMLyricLine, getAudioLyric } from "../../../jellyfin/browsing";
import { PLAYER } from "../../../player";
import { useCallback, useEffect, useRef, useState } from "react";

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
    const rafId = useRef<number>(null)

    const updateCurrLine = useCallback(() => {
        const newIndex = findCurrLineIndex(lyric, lineIndexRef.current)

        if (newIndex !== lineIndexRef.current) {
            lineIndexRef.current = newIndex
            setLineIndex(newIndex)
        }

        if (PLAYER.getIsPlaying()) {
            rafId.current = requestAnimationFrame(updateCurrLine)
        }
    }, [lyric])

    useEffect(() => {
        return PLAYER.onNowPlayingChanged(() => {
            const index = findCurrLineIndex(lyric)
            lineIndexRef.current = index
            setLineIndex(index)
        })
    }, [lyric])

    useEffect(() => {
        return PLAYER.onSeeked(() => {
            if (rafId.current) cancelAnimationFrame(rafId.current)
            const index = findCurrLineIndex(lyric)
            lineIndexRef.current = index
            setLineIndex(index)
            void Promise.resolve().then(updateCurrLine)
        })
    }, [lyric, updateCurrLine])

    useEffect(() => {
        if (PLAYER.getIsPlaying()) {
            rafId.current = requestAnimationFrame(updateCurrLine)
        }

        const unSubOnPlay = PLAYER.onPlay(updateCurrLine)
        const unSubOnPause = PLAYER.onPause(() => {
            if (rafId.current) cancelAnimationFrame(rafId.current)
        })

        return () => {
            unSubOnPlay()
            unSubOnPause()
            if (rafId.current) cancelAnimationFrame(rafId.current)
        }
    }, [lyric, updateCurrLine])

    return lineIndex
}
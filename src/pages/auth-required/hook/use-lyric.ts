import useSWR from "swr";
import { CMLyricLine, getAudioLyric } from "../../../jellyfin/browsing";
import { PLAYER } from "../../../player";
import { useEffect, useState } from "react";

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

    useEffect(() => {
        return PLAYER.onNowPlayingChanged(() => {
            setLineIndex(findCurrLineIndex(lyric))
        })
    }, [lyric])

    useEffect(() => {
        return PLAYER.onSeeked(() => {
            setLineIndex(findCurrLineIndex(lyric))
        })
    }, [lyric])

    useEffect(() => {
        return PLAYER.onPositionChanged(() => {
            setLineIndex(
                (prev) => prev === lyric.length - 1
                    ? prev
                    : PLAYER.getPosition() >= lyric[prev + 1].start
                        ? prev + 1
                        : prev
            )
        })
    }, [lyric])

    return lineIndex
}
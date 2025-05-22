import useSWR from "swr";
import { CMLyricLine, getAudioLyric } from "../../../jellyfin/browsing";
import { PLAYER } from "../../../player";
import { useCallback, useEffect, useRef, useState } from "react";

export function useAudioLyric(itemId: string) {
    const { data, isLoading } = useSWR(
        { identity: getAudioLyric, itemId: itemId },
        ({ itemId }) => getAudioLyric(itemId)
    )

    return { data, isLoading }
}

function findCurrLineIndex(lyric: CMLyricLine[], start: number = 0) {
    const pos = PLAYER.getPosition()
    for (let i = start; i < lyric.length; i++) {
        const item = lyric[i]

        if (pos < item.start) {
            const result = i === 0 ? 0 : i - 1

            if (pos >= lyric[result].start) return result

            // backward
            for (let j = result - 1; j >= 0; j--) {
                if (pos >= lyric[j].start) return j
            }
        }
    }
    return lyric.length - 1
}

export function useCurrLyricLineState(lyric: CMLyricLine[], itemId: string) {
    const [lineState, setLineState] = useState(
        () => ({
            index: findCurrLineIndex(lyric),
            instant: true
        })
    )
    const lineIndexRef = useRef(lineState)
    const rafId = useRef<number>(null)
    const ignoreRAFUpdate = useRef(false)

    const updateCurrLine = useCallback((instant?: boolean) => {
        const newIndex = findCurrLineIndex(lyric, lineIndexRef.current.index)

        if (newIndex !== lineIndexRef.current.index) {
            const state = { index: newIndex, instant: instant ?? false }
            console.debug('raf-lyric-update:', lyric[state.index])
            lineIndexRef.current = state
            setLineState(state)
        }

        // 确保只在必要时更新当前歌词行，确保队列中的旧的更新歌词行操作不会继续执行
        const ignoreUpdate = ignoreRAFUpdate.current === false
        const isLyricUpdated = itemId === PLAYER.getNowPlaying().id
        const isPlaying = PLAYER.getIsPlaying()
        if (ignoreUpdate && isLyricUpdated && isPlaying) {
            rafId.current = requestAnimationFrame(() => updateCurrLine())
        } else {
            console.debug(
                'stop raf for:',
                'ignoreUpdate:', ignoreUpdate,
                'isLyricUpdated:', isLyricUpdated,
                'isPlaying:', isPlaying
            )
        }
    }, [itemId, lyric])

    // 歌词更新时
    useEffect(() => {
        ignoreRAFUpdate.current = false
        updateCurrLine(true)

        return () => {
            ignoreRAFUpdate.current = true
            if (rafId.current) cancelAnimationFrame(rafId.current)
        }
    }, [updateCurrLine])

    // 暂停、播放时
    useEffect(() => {
        const unSubOnPlay = PLAYER.onPlay(() => {
            ignoreRAFUpdate.current = false
            updateCurrLine()
        })

        const unSubOnPause = PLAYER.onPause(() => {
            ignoreRAFUpdate.current = true
            if (rafId.current) cancelAnimationFrame(rafId.current)
        })

        return () => {
            unSubOnPlay()
            unSubOnPause()
        }
    }, [updateCurrLine])

    return lineState
}
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

    const updateCurrLine = useCallback(() => {
        const newIndex = findCurrLineIndex(lyric, lineIndexRef.current.index)

        if (newIndex !== lineIndexRef.current.index) {
            const state = { index: newIndex, instant: false }
            lineIndexRef.current = state
            setLineState(state)
        }

        // 确保只在必要时更新当前歌词行，确保队列中的旧的更新歌词行操作不会继续执行
        if (ignoreRAFUpdate.current === false
            && PLAYER.getNowPlaying().id === itemId
            && PLAYER.getIsPlaying()) {
            rafId.current = requestAnimationFrame(updateCurrLine)
        }
    }, [itemId, lyric])

    // 正在播放曲目变更时
    useEffect(() => {
        // 正在播放曲目刚开始变更
        const offOnNowPlayingChanging = PLAYER.onNowPlayingChanging(() => {
            ignoreRAFUpdate.current = true
            if (rafId.current) cancelAnimationFrame(rafId.current)

            const index = findCurrLineIndex(lyric)
            const state = { index: index, instant: true }
            lineIndexRef.current = state
            setLineState(state)
        })

        // 正在播放曲目元信息加载完，也就是变更完成
        const offOnNowPlayingChanged = PLAYER.onNowPlayingChanged(() => {
            ignoreRAFUpdate.current = false
            updateCurrLine()
        })

        return () => {
            offOnNowPlayingChanged()
            offOnNowPlayingChanging()
        }
    }, [lyric, updateCurrLine])

    // 修改播放进度时
    useEffect(() => {
        // 刚开始修改进度时
        const offOnSeeking = PLAYER.onSeeking(() => {
            ignoreRAFUpdate.current = true
            if (rafId.current) cancelAnimationFrame(rafId.current)

            const index = findCurrLineIndex(lyric)
            const state = { index: index, instant: true }
            lineIndexRef.current = state
            setLineState(state)
        })

        // 要求的进度已经加载，播放时
        const offOnSeeked = PLAYER.onSeeked(() => {
            ignoreRAFUpdate.current = false
            updateCurrLine()
        })

        return () => {
            offOnSeeking()
            offOnSeeked()
        }
    }, [lyric, updateCurrLine])

    // 暂停、播放时
    useEffect(() => {
        rafId.current = requestAnimationFrame(updateCurrLine)

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
            if (rafId.current) cancelAnimationFrame(rafId.current)
        }
    }, [itemId, lyric, updateCurrLine])

    return lineState
}
import { useCallback, useEffect, useState } from "react";
import { PLAYER } from "../../../player";

const getNowPlaying = PLAYER.getNowPlaying.bind(PLAYER)

export function usePlayerNowPlaying() {
    const [state, setState] = useState(getNowPlaying)

    const update = useCallback(() => {
        setState(getNowPlaying())
    }, [])

    useEffect(() => {
        const unsubscribe = PLAYER.onNowPlayingChanged(update)
        return unsubscribe
    }, [update])

    return state
}

const getPosition = PLAYER.getPosition.bind(PLAYER)

export function usePlayerPosition() {
    const [state, setState] = useState(getPosition)

    const update = useCallback(() => {
        setState(getPosition())
    }, [])

    useEffect(() => {
        const unsubscribe = PLAYER.onPositionChanged(update)
        return unsubscribe
    }, [update])

    return state
}

const getDuration = PLAYER.getDuration.bind(PLAYER)

export function usePlayerDuration() {
    const [state, setState] = useState(getDuration)

    const update = useCallback(() => {
        setState(getDuration())
    }, [])

    useEffect(() => {
        const unsubscribe = PLAYER.onDurationChanged(update)
        return unsubscribe
    }, [update])

    return state
}

const getIsPlaying = PLAYER.getIsPlaying.bind(PLAYER)

export function usePlayerIsPlaying() {
    const [state, setState] = useState(getIsPlaying)

    const update = useCallback(() => {
        setState(getIsPlaying())
    }, [])

    useEffect(() => {
        const unsubscribeOnPause = PLAYER.onPause(update)
        const unsubscribeOnPlay = PLAYER.onPlay(update)

        return () => {
            unsubscribeOnPause()
            unsubscribeOnPlay()
        }
    }, [update])

    return state
}

const getPlaylist = PLAYER.playlist.getList.bind(PLAYER.playlist)

export function usePlayerPlaylist() {
    const [state, setState] = useState(getPlaylist)

    const update = useCallback(() => {
        setState(getPlaylist())
    }, [])

    useEffect(() => {
        const unsubscribe = PLAYER.onPlaylistChanged(update)

        return unsubscribe
    }, [update])

    return state
}

const getLoopMode = PLAYER.playlist.getLoopMode.bind(PLAYER.playlist)

export function usePlayerLoopMode() {
    const [state, setState] = useState(getLoopMode)

    const update = useCallback(() => {
        setState(getLoopMode())
    }, [])

    useEffect(() => {
        const unsubscribe = PLAYER.onPlaylistChanged(update)

        return unsubscribe
    }, [update])

    return state
}

const getHasShuffled = PLAYER.playlist.getHasShuffled.bind(PLAYER.playlist)

export function usePlayerHasShuffled() {
    const [state, setState] = useState(getHasShuffled)

    const update = useCallback(() => {
        setState(getHasShuffled())
    }, [])

    useEffect(() => {
        const unsubscribe = PLAYER.onPlaylistChanged(update)

        return unsubscribe
    }, [update])

    return state
}
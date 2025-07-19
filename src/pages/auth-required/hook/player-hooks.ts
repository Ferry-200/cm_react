import { useCallback, useEffect, useState } from "react";
import { Player } from "../../../player";

export function usePlayerNowPlaying(player: Player) {
    const [state, setState] = useState(() => player.getNowPlaying())

    const update = useCallback(() => {
        setState(player.getNowPlaying())
    }, [player])

    useEffect(() => {
        const unsubscribe = player.onNowPlayingChanged(update)
        return unsubscribe
    }, [update, player])

    return state
}

export function usePlayerPosition(player: Player) {
    const [state, setState] = useState(() => player.getPosition())

    const update = useCallback(() => {
        setState(player.getPosition())
    }, [player])

    useEffect(() => {
        const unsubscribe = player.onPositionChanged(update)
        return unsubscribe
    }, [update, player])

    return state
}

export function usePlayerDuration(player: Player) {
    const [state, setState] = useState(() => player.getDuration())

    const update = useCallback(() => {
        setState(player.getDuration())
    }, [player])

    useEffect(() => {
        const unsubscribe = player.onDurationChanged(update)
        return unsubscribe
    }, [update, player])

    return state
}

export function usePlayerIsPlaying(player: Player) {
    const [state, setState] = useState(() => player.getIsPlaying())

    const update = useCallback(() => {
        setState(player.getIsPlaying())
    }, [player])

    useEffect(() => {
        const unsubscribeOnPause = player.onPause(update)
        const unsubscribeOnPlay = player.onPlay(update)

        return () => {
            unsubscribeOnPause()
            unsubscribeOnPlay()
        }
    }, [update, player])

    return state
}

export function usePlayerPlaylist(player: Player) {
    const [state, setState] = useState(() => player.playlist.getList())

    const update = useCallback(() => {
        setState(player.playlist.getList())
    }, [player.playlist])

    useEffect(() => {
        const unsubscribe = player.onPlaylistChanged(update)

        return unsubscribe
    }, [player, update])

    return state
}

export function usePlayerLoopMode(player: Player) {
    const [state, setState] = useState(() => player.playlist.getLoopMode())

    const update = useCallback(() => {
        setState(player.playlist.getLoopMode())
    }, [player.playlist])

    useEffect(() => {
        const unsubscribe = player.onPlaylistChanged(update)

        return unsubscribe
    }, [player, update])

    return state
}

export function usePlayerHasShuffled(player: Player) {
    const [state, setState] = useState(() => player.playlist.getHasShuffled())

    const update = useCallback(() => {
        setState(player.playlist.getHasShuffled())
    }, [player.playlist])

    useEffect(() => {
        const unsubscribe = player.onPlaylistChanged(update)

        return unsubscribe
    }, [player, update])

    return state
}
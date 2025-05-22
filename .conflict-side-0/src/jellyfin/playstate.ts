import { getPlaystateApi } from '@jellyfin/sdk/lib/utils/api/playstate-api'
import { jellyfinApi } from '.'

export function reportPlayStart(itemId: string) {
    if (itemId.length === 0) return

    return getPlaystateApi(jellyfinApi).onPlaybackStart({
        itemId: itemId,
        playMethod: 'DirectStream'
    }).catch(console.error)
}

export function reportPlayingProgress(
    itemId: string, isPlaying: boolean,
    pos: number
) {
    if (itemId.length === 0) return

    return getPlaystateApi(jellyfinApi).onPlaybackProgress({
        itemId: itemId,
        isPaused: !isPlaying,
        // Optional. The current position, in ticks. 1 tick = 10000 ms.
        positionTicks: Math.floor(pos * 1000 * 10000),
        playMethod: 'DirectStream'
    }).catch(console.error)
}

export function reportPlayingStop(
    itemId: string, pos: number
) {
    if (itemId.length === 0) return

    return getPlaystateApi(jellyfinApi).onPlaybackStopped({
        itemId: itemId,
        // Optional. The current position, in ticks. 1 tick = 10000 ms.
        positionTicks: Math.floor(pos * 1000 * 10000)
    }).catch(console.error)
}
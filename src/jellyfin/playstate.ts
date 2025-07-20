import { Api } from '@jellyfin/sdk'
import { getPlaystateApi } from '@jellyfin/sdk/lib/utils/api/playstate-api'

export function reportPlayStart(jellyfinApi: Api, itemId: string) {
    if (itemId.length === 0) return

    return getPlaystateApi(jellyfinApi).onPlaybackStart({
        itemId: itemId,
        playMethod: 'DirectStream'
    }).catch(console.error)
}

export function reportPlayingProgress(
    jellyfinApi: Api, 
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
    jellyfinApi: Api, 
    itemId: string, pos: number
) {
    if (itemId.length === 0) return

    return getPlaystateApi(jellyfinApi).onPlaybackStopped({
        itemId: itemId,
        // Optional. The current position, in ticks. 1 tick = 10000 ms.
        positionTicks: Math.floor(pos * 1000 * 10000)
    }).catch(console.error)
}
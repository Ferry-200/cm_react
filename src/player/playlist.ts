import { ChangeNotifier, when } from "../utils"

interface ArtistInfo { id: string, name: string }

interface AlbumInfo { id: string, name: string }

export interface AudioInfo {
    id: string,
    title: string,
    artists: ArtistInfo[],
    album: AlbumInfo
}

const EMPTY_AUDIO: AudioInfo = {
    id: '',
    title: 'Coriander Music',
    artists: [],
    album: { id: '', name: '' }
}

export const LoopMode = {
    playlist: 'playlist',
    single: 'single',
    disable: 'disable'
} as const

type LoopMode = keyof typeof LoopMode

export class Playlist extends ChangeNotifier {
    private list: AudioInfo[] = []
    cur = 0
    private loopMode: LoopMode = LoopMode.playlist

    constructor() {
        super();
    }

    getNowPlaying() {
        return this.list[this.cur] ?? EMPTY_AUDIO
    }

    getLoopMode() {
        return this.loopMode
    }

    getList() {
        return this.list
    }

    hasNext() {
        return this.cur < this.list.length - 1
    }

    hasPrev() {
        return this.cur > 0
    }

    setPlaylist(newPlaylist: AudioInfo[], startFrom: number) {
        this.list = Array.from(newPlaylist)

        if (this.list.length === 0) return
        if (startFrom < 0 || startFrom >= this.list.length) return

        this.cur = startFrom

        this.notify()
    }

    next() {
        const canNext = this.hasNext()
        if (this.loopMode === LoopMode.playlist) {
            this.cur = when(canNext, this.cur + 1, 0)
        } else if (this.loopMode === LoopMode.disable) {
            if (canNext) this.cur += 1
        }
    }

    prev() {
        const canPrev = this.hasPrev()
        if (this.loopMode === LoopMode.playlist) {
            this.cur = when(canPrev, this.cur - 1, this.list.length - 1)
        } else if (this.loopMode === LoopMode.disable) {
            if (canPrev) this.cur -= 1
        }
    }
}
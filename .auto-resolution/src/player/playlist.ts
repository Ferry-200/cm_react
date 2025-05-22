import { ChangeNotifier, shuffleArray } from "../utils"

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

export type LoopMode = keyof typeof LoopMode

export class Playlist extends ChangeNotifier {
    private list: AudioInfo[] = []

    private hasShuffled = false
    private shuffleBackup: AudioInfo[] = []
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

    getHasShuffled() {
        return this.hasShuffled
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

    setLoopMode(mode: LoopMode) {
        this.loopMode = mode

        this.notify()
    }

    setHasShuffled(shuffle: boolean) {
        if (shuffle) {
            const nowPlaying = this.getNowPlaying()
            this.list = shuffleArray(this.list)
            this.cur = this.list.indexOf(nowPlaying)
            this.hasShuffled = true
        } else {
            const nowPlaying = this.getNowPlaying()
            this.list = Array.from(this.shuffleBackup)
            this.cur = this.list.indexOf(nowPlaying)
            this.hasShuffled = false
        }

        this.notify()
    }

    setPlaylist(newPlaylist: AudioInfo[], startFrom: number, shuffle?: boolean) {
        this.list = shuffle
            ? shuffleArray(newPlaylist)
            : Array.from(newPlaylist)
        this.shuffleBackup = Array.from(newPlaylist)
        this.hasShuffled = shuffle ?? false

        if (this.list.length === 0) return
        if (startFrom < 0 || startFrom >= this.list.length) return

        this.cur = startFrom

        this.notify()
    }

    next() {
        const canNext = this.hasNext()
        if (this.loopMode === LoopMode.playlist) {
            this.cur = canNext ? this.cur + 1 : 0
        } else if (this.loopMode === LoopMode.disable) {
            if (canNext) this.cur += 1
        }
    }

    prev() {
        const canPrev = this.hasPrev()
        if (this.loopMode === LoopMode.playlist) {
            this.cur = canPrev ? this.cur - 1 : this.list.length - 1
        } else if (this.loopMode === LoopMode.disable) {
            if (canPrev) this.cur -= 1
        }
    }
}
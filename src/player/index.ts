import { getAudioStreamUrl, getImageStreamUrl } from "../jellyfin/streaming"
import { ChangeNotifier } from "../utils";

interface Artist { id: string, name: string }

interface Album { id: string, name: string }

interface Audio {
    id: string,
    title: string,
    artists: Artist[],
    album: Album
}

const EMPTY_AUDIO: Audio = {
    id: '',
    title: 'Coriander Music',
    artists: [],
    album: { id: '', name: '' }
}

function updateMediaSession(nowPlaying: Audio) {
    if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: nowPlaying.title,
            artist: nowPlaying.artists.map((a) => a.name).join('/'),
            album: nowPlaying.album.name,
            artwork: [{
                src: getImageStreamUrl(nowPlaying.album.id, 800)
            }],
        });
    }
}

export const LoopMode = {
    playlist: 'playlist',
    single: 'single',
    disable: 'disable'
} as const

type LoopMode = keyof typeof LoopMode

class Playlist extends ChangeNotifier {
    private list: Audio[] = []
    private cur = 0
    private loopMode: LoopMode = LoopMode.playlist

    constructor() {
        super();
    }

    getNowPlayingIndex() {
        return this.cur
    }

    getNowPlaying() {
        return this.list[this.cur] ?? EMPTY_AUDIO
    }

    getLoopMode() {
        return this.loopMode
    }

    hasNext() {
        return this.cur < this.list.length - 1
    }

    hasPrev() {
        return this.cur > 0
    }

    setPlaylist(newPlaylist: Audio[], startFrom: number) {
        this.list = Array.from(newPlaylist)

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

class Player {
    audioEle = document.createElement('audio')
    playlist = new Playlist()

    constructor() {
        this.audioEle.preload = 'metadata'
        this.audioEle.addEventListener('ended', this.playNext.bind(this))

        navigator.mediaSession.setActionHandler("play", this.play.bind(this));
        navigator.mediaSession.setActionHandler("pause", this.pause.bind(this));
        navigator.mediaSession.setActionHandler("previoustrack", this.playPrev.bind(this));
        navigator.mediaSession.setActionHandler("nexttrack", this.playNext.bind(this));
        this.onNowPlayingChanged(() => {
            updateMediaSession(this.getNowPlaying())
        })
    }

    getNowPlaying() {
        return this.playlist.getNowPlaying()
    }

    getNowPlayingIndex() {
        return this.playlist.getNowPlayingIndex()
    }

    setSrc(audioId: string) {
        this.audioEle.src = getAudioStreamUrl(audioId)
        this.audioEle.load()
    }

    setPlaylist(newPlaylist: Audio[], startFrom: number) {
        this.playlist.setPlaylist(newPlaylist, startFrom)

        this.setSrc(this.playlist.getNowPlaying().id)
    }

    getIsPlaying() {
        return !this.audioEle.paused
    }

    /**
     * @todo show error toast when cannot play
     */
    play() {
        this.audioEle.play().catch((reason) => {
            console.error(reason)
            this.playNext()
        })
    }

    pause() {
        this.audioEle.pause()
    }

    togglePlayAndPause() {
        if (this.getIsPlaying()) {
            this.pause()
        } else {
            this.play()
        }
    }

    seek(pos: number) {
        this.audioEle.currentTime = pos
    }

    playNext() {
        const hasNext = this.playlist.hasNext()
        // 如果 不循环且没有下一首 就停止播放
        if (this.playlist.getLoopMode() === LoopMode.disable && !hasNext) return

        this.playlist.next()
        this.setSrc(this.playlist.getNowPlaying().id)
        this.play()
    }

    playPrev() {
        const hasPrev = this.playlist.hasPrev()
        // 如果 不循环且没有上一首 就停止播放
        if (this.playlist.getLoopMode() === LoopMode.disable && !hasPrev) return

        this.playlist.prev()
        this.setSrc(this.playlist.getNowPlaying().id)
        this.play()
    }

    onNowPlayingChanged(action: VoidFunction) {
        this.audioEle.addEventListener('loadedmetadata', action)
        return () => this.audioEle.removeEventListener('loadedmetadata', action)
    }

    getPosition() {
        return this.audioEle.currentTime
    }

    onPositionChanged(action: VoidFunction) {
        this.audioEle.addEventListener('timeupdate', action)
        return () => this.audioEle.removeEventListener('timeupdate', action)
    }

    getDuration() {
        return this.audioEle.duration
    }

    onDurationChanged(action: VoidFunction) {
        this.audioEle.addEventListener('durationchange', action)
        return () => this.audioEle.removeEventListener('durationchange', action)
    }

    onPause(action: VoidFunction) {
        this.audioEle.addEventListener('pause', action)
        return () => this.audioEle.removeEventListener('pause', action)
    }

    onPlay(action: VoidFunction) {
        this.audioEle.addEventListener('play', action)
        return () => this.audioEle.removeEventListener('play', action)
    }

    onPlaylistChanged(action: VoidFunction) {
        this.playlist.addListener(action)
        return () => this.playlist.removeListener(action)
    }
}

export const PLAYER = new Player()
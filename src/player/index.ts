import { getAudioStreamUrl, getImageStreamUrl } from "../jellyfin/streaming"

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

class Player {
    audioEle = document.createElement('audio')
    playlist: Audio[] = []
    playlistIndex: number = 0
    loopMode: LoopMode = LoopMode.playlist

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
        return this.playlist[this.playlistIndex] || EMPTY_AUDIO
    }

    setSrc(audioId: string) {
        this.audioEle.src = getAudioStreamUrl(audioId)
        this.audioEle.load()
    }

    setPlaylist(newPlaylist: Audio[], startFrom: number) {
        this.playlist = Array.from(newPlaylist)

        if (this.playlist.length === 0) return
        if (startFrom < 0 || startFrom >= this.playlist.length) return

        this.playlistIndex = startFrom
        this.setSrc(this.getNowPlaying().id)
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
        const hasNext = this.playlistIndex < this.playlist.length - 1
        if (this.loopMode === LoopMode.playlist) {
            this.playlistIndex = hasNext ? this.playlistIndex + 1 : 0
        } else if (this.loopMode === LoopMode.disable) {
            if (hasNext) this.playlistIndex += 1
        }

        // 如果 不循环且没有下一首 就停止播放
        if (this.loopMode === LoopMode.disable && !hasNext) return

        this.setSrc(this.playlist[this.playlistIndex].id)
        this.play()
    }

    playPrev() {
        const hasPrev = this.playlistIndex > 0
        if (this.loopMode === LoopMode.playlist) {
            this.playlistIndex = hasPrev ? this.playlistIndex - 1 : this.playlist.length - 1
        } else if (this.loopMode === LoopMode.disable) {
            if (hasPrev) this.playlistIndex -= 1
        }

        // 如果 不循环且没有上一首 就停止播放
        if (this.loopMode === LoopMode.disable && !hasPrev) return

        this.setSrc(this.playlist[this.playlistIndex].id)
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
}

export const PLAYER = new Player()
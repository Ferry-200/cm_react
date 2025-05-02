import { getAudioStreamUrl, getImageStreamUrl } from "../jellyfin/streaming"
import { AudioInfo, LoopMode, Playlist } from "./playlist";

function updateMediaSession(nowPlaying: AudioInfo) {
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

    setSrc(audioId: string) {
        this.audioEle.src = getAudioStreamUrl(audioId)
        this.audioEle.load()
    }

    setPlaylist(newPlaylist: AudioInfo[], startFrom: number) {
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
            if (this.playlist.cur < this.playlist.getList().length - 1) {
                this.playNext()
            }
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

    playWhich(index: number) {
        this.playlist.cur = index
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

    onSeeked(action: VoidFunction) {
        this.audioEle.addEventListener('seeked', action)
        return () => this.audioEle.removeEventListener('seeked', action)
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
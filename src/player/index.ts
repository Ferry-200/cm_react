import { reportPlayingProgress, reportPlayingStop, reportPlayStart } from "../jellyfin/playstate";
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

        // auto next
        this.audioEle.addEventListener('ended', this.playNext.bind(this))

        // report play start as soon as now playing changed
        this.onNowPlayingChanging(() => {

        })

        // sync play progress every 10s
        const _syncProgress = () => {
            setTimeout(() => {
                void reportPlayingProgress(
                    this.getNowPlaying().id,
                    this.getIsPlaying(),
                    this.getPosition()
                )
                _syncProgress()
            }, 10000)
        }
        _syncProgress()

        // init media session
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
        void reportPlayStart(this.getNowPlaying().id)
        this.audioEle.src = getAudioStreamUrl(audioId)
        this.audioEle.load()
    }

    setPlaylist(newPlaylist: AudioInfo[], startFrom: number) {
        void reportPlayingStop(this.getNowPlaying().id, this.getPosition())

        this.playlist.setPlaylist(newPlaylist, startFrom)
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
        void reportPlayingStop(this.getNowPlaying().id, this.getPosition())

        const hasNext = this.playlist.hasNext()
        // 如果 不循环且没有下一首 就停止播放
        if (this.playlist.getLoopMode() === LoopMode.disable && !hasNext) return

        this.playlist.next()
        this.setSrc(this.getNowPlaying().id)
        this.play()
    }

    playPrev() {
        void reportPlayingStop(this.getNowPlaying().id, this.getPosition())

        const hasPrev = this.playlist.hasPrev()
        // 如果 不循环且没有上一首 就停止播放
        if (this.playlist.getLoopMode() === LoopMode.disable && !hasPrev) return

        this.playlist.prev()
        this.setSrc(this.getNowPlaying().id)
        this.play()
    }

    playWhich(index: number) {
        void reportPlayingStop(this.getNowPlaying().id, this.getPosition())

        this.playlist.cur = index
        this.setSrc(this.getNowPlaying().id)
        this.play()
    }

    /**
     * 正在播放的曲目刚开始改变时。getNowPlaying 可以拿到最新的正在播放曲目
     */
    onNowPlayingChanging(action: VoidFunction) {
        this.audioEle.addEventListener('emptied', action)
        return () => this.audioEle.removeEventListener('emptied', action)
    }

    /**
     * 正在播放曲目元信息加载完成时
     */
    onNowPlayingChanged(action: VoidFunction) {
        this.audioEle.addEventListener('loadedmetadata', action)
        return () => this.audioEle.removeEventListener('loadedmetadata', action)
    }

    getPosition() {
        return this.audioEle.currentTime
    }

    /**
     * 当前播放位置更新时
     */
    onPositionChanged(action: VoidFunction) {
        this.audioEle.addEventListener('timeupdate', action)
        return () => this.audioEle.removeEventListener('timeupdate', action)
    }

    /**
     * 刚开始更改播放位置时，可以直接在 getPosition 拿到最新播放位置
     */
    onSeeking(action: VoidFunction) {
        this.audioEle.addEventListener('seeking', action)
        return () => this.audioEle.removeEventListener('seeking', action)
    }

    /**
     * 修改播放位置对应的数据已经加载
     */
    onSeeked(action: VoidFunction) {
        this.audioEle.addEventListener('seeked', action)
        return () => this.audioEle.removeEventListener('seeked', action)
    }

    getDuration() {
        return this.audioEle.duration
    }

    /**
     * 曲目时长更新时
     */
    onDurationChanged(action: VoidFunction) {
        this.audioEle.addEventListener('durationchange', action)
        return () => this.audioEle.removeEventListener('durationchange', action)
    }

    /**
     * 暂停时
     */
    onPause(action: VoidFunction) {
        this.audioEle.addEventListener('pause', action)
        return () => this.audioEle.removeEventListener('pause', action)
    }

    /**
     * 播放时
     */
    onPlay(action: VoidFunction) {
        this.audioEle.addEventListener('play', action)
        return () => this.audioEle.removeEventListener('play', action)
    }

    /**
     * 播放列表变更时
     */
    onPlaylistChanged(action: VoidFunction) {
        this.playlist.addListener(action)
        return () => this.playlist.removeListener(action)
    }
}

export const PLAYER = new Player()
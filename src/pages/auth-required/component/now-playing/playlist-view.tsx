import { styled } from "@linaria/react"
import { usePlayerNowPlaying, usePlayerPlaylist } from "../../hook/player-hooks"
import { useContext, useEffect, useRef } from "react"
import { LucideAudioWaveform } from "lucide-react"
import { makeClickable } from "../../../../utils"
import { PlayerContext } from "../../../../player/context"

const ListTile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  width: 100%;
  padding: 8px;

  ${makeClickable('--md-surface-hover', '--md-surface-active')}

  &.curr {
    color: var(--md-primary);
  }
`

const TileTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const ListTileTitle = styled.span`
  font-weight: bold;
`

const CurrIndicator = styled(LucideAudioWaveform)`
  flex-shrink: 0;
  margin-left: 8px;
`

const EmptyMsg = styled.span`
  margin-left: 8px;
`

export const PlaylistView = () => {
  const player = useContext(PlayerContext)!

  const playlist = usePlayerPlaylist(player)
  const nowPlaying = usePlayerNowPlaying(player)
  const curr = useRef<HTMLDivElement>(null)

  useEffect(() => {
    curr.current?.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    })
  }, [nowPlaying, playlist])

  if (playlist.length === 0) {
    return (<EmptyMsg>播放列表为空</EmptyMsg>)
  }

  return (<>
    {
      playlist.map((audio, index) => {
        const isCurr = nowPlaying.id === audio.id
        return (<ListTile
          key={audio.id}
          ref={isCurr ? curr : undefined}
          className={isCurr ? 'curr' : undefined}
          onClick={() => player.playWhich(index)}
        >
          <TileTextWrapper>
            <ListTileTitle>{audio.title}</ListTileTitle>
            <span>{audio.artists.map((artist) => artist.name).join(' / ')}</span>
            <span>{audio.album.name}</span>
          </TileTextWrapper>
          {isCurr ? <CurrIndicator /> : undefined}
        </ListTile>
        )
      })
    }
  </>)
}
import { styled } from "@linaria/react"
import { usePlayerNowPlaying, usePlayerPlaylist } from "../hook/player-hooks"
import { useEffect, useRef } from "react"
import { PLAYER } from "../../../player"
import { LucideMusic2 } from "lucide-react"

const ListTile = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  width: 100%;
  border: none;
  background: none;
  font-size: 1rem;
  padding-block: 0;
  padding-inline: 0;
  padding: 8px;
  text-align: start;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    border-radius: inherit;
    pointer-events: none;
    transition: background-color 150ms;
  }

  &:hover::before {
    background-color: var(--md-surface-hover);
  }

  &:active::before {
    background-color: var(--md-surface-active);
  }

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

const CurrIndicator = styled(LucideMusic2)`
  flex-shrink: 0;
  margin-left: 8px;
`

const EmptyMsg = styled.span`
  margin-left: 8px;
`

export const PlaylistView = () => {
  const playlist = usePlayerPlaylist()
  const nowPlaying = usePlayerNowPlaying()
  const curr = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    curr.current?.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    })
  }, [nowPlaying])

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
          onClick={() => PLAYER.playWhich(index)}
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
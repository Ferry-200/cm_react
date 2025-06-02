import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { styled } from "@linaria/react"
import { getImageStreamUrl } from "../../../jellyfin/streaming"
import { Avatar } from "radix-ui"
import { LucideImageOff } from "lucide-react"
import { ITEM_ID_DYN_SEG, ROUTE_PATH } from "../../../router"
import { LinkChip } from "../../../component/chips"

type AudioTileProp = {
  audio: BaseItemDto,
  index: number
}

const Wrapper = styled.div`
  width: 100%;
  padding: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
  border-radius: 8px;
  position: relative;
  cursor: pointer;

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

  /* 在支持的浏览器上使用更精细的 hover, active 效果 */
  @supports (selector(:has(*))) {
    &:hover:not(:has(${LinkChip}:hover))::before {
      background-color: var(--md-surface-hover);
    }

    &:active:not(:has(${LinkChip}:active))::before {
      background-color: var(--md-surface-active);
    }
  }

  /* 在不支持的浏览器上保留基本的 hover, active 效果 */
  @supports not (selector(:has(*))) {
    &:hover::before {
      background-color: var(--md-surface-hover);
    }

    &:active::before {
      background-color: var(--md-surface-active);
    }
  }
`

const AudioImgWrapper = styled(Avatar.Root)`
  display: block;
  width: 68px;
  height: 68px;
  line-height: 0;
`

const AudioImg = styled(Avatar.Image)`
  width: 68px;
  height: 68px;
  border-radius: 4px;
  object-fit: cover;
`

const AudioTileMain = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;

  * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const ChipsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const ArtistChipsWrapper = styled(ChipsWrapper)`
  margin: 2px 0 4px 0;
  gap: 4px;
`

export const AudioTile = ({ audio, index }: AudioTileProp) => {
  return (
    <Wrapper data-index={index} onClick={
      (e) => {
        const clickedTarget = e.target as HTMLElement
        const isArtistChip = clickedTarget.dataset['artist']
        const isAlbumChip = clickedTarget.dataset['album']

        if (isArtistChip || isAlbumChip) e.stopPropagation()
      }
    }>
      <AudioImgWrapper>
        <AudioImg src={getImageStreamUrl(audio.AlbumId!, 68)} />
        <Avatar.Fallback>
          <LucideImageOff size='100%' strokeWidth={1} />
        </Avatar.Fallback>
      </AudioImgWrapper>

      <AudioTileMain>
        <span>{audio.Name}</span>
        <ArtistChipsWrapper>
          {
            audio.ArtistItems?.map(
              (artist) => (
                <LinkChip
                  to={{
                    pathname: ROUTE_PATH.artistDetail
                      .replace(ITEM_ID_DYN_SEG, `/${artist.Id}`),
                  }}
                  key={artist.Id}
                  data-artist
                >
                  {artist.Name}
                </LinkChip>
              )
            )
          }
        </ArtistChipsWrapper>
        <ChipsWrapper>
          <LinkChip
            to={{
              pathname: ROUTE_PATH.albumDetail
                .replace(ITEM_ID_DYN_SEG, `/${audio.AlbumId}`),
            }}
            data-album
          >
            {audio.Album}
          </LinkChip>
        </ChipsWrapper>
      </AudioTileMain>
    </Wrapper>
  )
}
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { styled } from "@linaria/react"
import { getImageStreamUrl } from "../../../jellyfin/streaming"
import { Avatar } from "radix-ui"
import { LucideImageOff } from "lucide-react"

type AudioTileProp = {
  audio: BaseItemDto
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

  &:hover::before {
    background-color: var(--md-surface-hover);
  }

  &:active::before {
    background-color: var(--md-surface-active);
  }
`

const AudioImg = styled(Avatar.Image)`
  width: 68px;
  height: 68px;
  border-radius: 4px;
`

const AudioImgFallback = styled(Avatar.Fallback)`
  width: 68px;
  height: 68px;
`

const AudioTileMain = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const ChipsWrapper = styled.div`
  display: flex;
`

const ArtistChipsWrapper = styled(ChipsWrapper)`
  margin: 2px 0 4px 0;
  gap: 4px;
`

const ArtistChip = styled.span`
  font-size: 14px;
  background-color: var(--md-primary-container);
  color: var(--md-on-primary-container);
  border-radius: 4px;
  padding: 0 4px;

  &:hover {
    background-color: var(--md-primary);
    color: var(--md-on-primary);
  }
`

const AlbumChip = styled(ArtistChip)`
  background-color: var(--md-secondary-container);
  color: var(--md-on-secondary-container);

  &:hover {
    background-color: var(--md-secondary);
    color: var(--md-on-secondary);
  }
`

export const AudioTile = ({ audio }: AudioTileProp) => {
  return (
    <Wrapper onClick={
      (e) => {
        const clickedTarget = e.target as HTMLElement
        const clickedDataset = clickedTarget.dataset
        const clickedArtist = clickedDataset['artist']
        const clickedAlbum = clickedDataset['album']

        if (clickedArtist) {
          console.log('artist id:', clickedArtist)
        } else if (clickedAlbum) {
          console.log('album id:', clickedAlbum)
        } else {
          console.log('music id:', audio.Id)
        }
      }
    }>
      <Avatar.Root>
        <AudioImg src={getImageStreamUrl(audio.AlbumId!, 68)} />
        <AudioImgFallback asChild>
          <LucideImageOff strokeWidth={1} />
        </AudioImgFallback>
      </Avatar.Root>

      <AudioTileMain>
        <span>{audio.Name}</span>
        <ArtistChipsWrapper>
          {
            audio.ArtistItems?.map(
              (artist) => <ArtistChip key={artist.Name} data-artist={artist.Id}>{artist.Name}</ArtistChip>
            )
          }
        </ArtistChipsWrapper>
        <ChipsWrapper>
          <AlbumChip data-album={audio.AlbumId}>{audio.Album}</AlbumChip>
        </ChipsWrapper>
      </AudioTileMain>
    </Wrapper>
  )
}
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { styled } from "@linaria/react"
import { getImageStreamUrl } from "../../../jellyfin/streaming"

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

const AudioImg = styled.img`
  width: 68px;
  height: 68px;
  border-radius: 4px;
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
`

const AlbumChip = styled(ArtistChip)`
  background-color: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
`

export const AudioTile = ({ audio }: AudioTileProp) => {
  return (
    <Wrapper>
      <AudioImg src={getImageStreamUrl(audio.AlbumId!, 68)} />
      <AudioTileMain>
        <span>{audio.Name}</span>
        <ArtistChipsWrapper>
          {
            audio.Artists?.map(
              (artist) => <ArtistChip key={artist}>{artist}</ArtistChip>
            )
          }
        </ArtistChipsWrapper>
        <ChipsWrapper>
          <AlbumChip>{audio.Album}</AlbumChip>
        </ChipsWrapper>
      </AudioTileMain>
    </Wrapper>
  )
}
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { styled } from "@linaria/react"
import { getImageStreamUrl } from "../../../jellyfin/streaming"
import { Avatar } from "radix-ui"
import { LucideImageOff } from "lucide-react"
import { createSearchParams, Link } from "react-router"
import { ROUTE_PATH } from "../../../router"

type ArtistTileProp = {
  artist: BaseItemDto
}

const Wrapper = styled(Link)`
  color: var(--md-on-surface);
  text-decoration: none;
  width: 100%;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  border-radius: 8px;
  position: relative;
  cursor: pointer;

  span {
    text-align: center;
  }

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

const ArtistImg = styled(Avatar.Image)`
  display: block;
  width: 112px;
  height: 112px;
  border-radius: 8px;
  object-fit: cover;
`

const ArtistImgFallback = styled(Avatar.Fallback)`
  width: 112px;
  height: 112px;
`

export const ArtistTile = ({ artist }: ArtistTileProp) => {
  return (
    <Wrapper
      to={{
        pathname: ROUTE_PATH.artistDetail,
        search: `?${createSearchParams({ id: artist.Id! })}`
      }}
    >
      <Avatar.Root>
        <ArtistImg src={getImageStreamUrl(artist.Id!, 96)} />
        <ArtistImgFallback asChild>
          <LucideImageOff strokeWidth={1} />
        </ArtistImgFallback>
      </Avatar.Root>
      <span>{artist.Name}</span>
    </Wrapper>
  )
}
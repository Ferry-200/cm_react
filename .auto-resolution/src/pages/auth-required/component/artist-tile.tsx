import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { styled } from "@linaria/react"
import { getImageStreamUrl } from "../../../jellyfin/streaming"
import { Avatar } from "radix-ui"
import { LucideImageOff } from "lucide-react"
import { Link } from "react-router"
import { ITEM_ID_DYN_SEG, ROUTE_PATH } from "../../../router"
import { makeClickable } from "../../../utils"

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

  ${makeClickable('--md-surface-hover', '--md-surface-active')}

  span {
    text-align: center;
  }
`

const ArtistImgWrapper = styled(Avatar.Root)`
  display: block;
  width: 112px;
  height: 112px;
  line-height: 0;
`

const ArtistImg = styled(Avatar.Image)`
  width: 112px;
  height: 112px;
  border-radius: 8px;
  object-fit: cover;
`

export const ArtistTile = ({ artist }: ArtistTileProp) => {
  return (
    <Wrapper
      to={{
        pathname: ROUTE_PATH.artistDetail
          .replace(ITEM_ID_DYN_SEG, `/${artist.Id}`),
      }}
    >
      <ArtistImgWrapper>
        <ArtistImg src={getImageStreamUrl(artist.Id!, 96)} />
        <Avatar.Fallback>
          <LucideImageOff size='100%' strokeWidth={1} />
        </Avatar.Fallback>
      </ArtistImgWrapper>
      <span>{artist.Name}</span>
    </Wrapper>
  )
}
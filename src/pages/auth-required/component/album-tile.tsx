import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { styled } from "@linaria/react"
import { getImageStreamUrl } from "../../../jellyfin/streaming"
import { Avatar } from "radix-ui"
import { LucideImageOff } from "lucide-react"
import { Link } from "react-router"
import { ITEM_ID_DYN_SEG, ROUTE_PATH } from "../../../router"
import { makeClickable } from "../../../utils"
import { useContext } from "react"
import { JellyfinApiContext } from "../../../jellyfin/context"

type AlbumTileProp = {
  album: BaseItemDto
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

const AlbumImgWrapper = styled(Avatar.Root)`
  display: block;
  width: 112px;
  height: 112px;
  line-height: 0;
`

const AlbumImg = styled(Avatar.Image)`
  width: 112px;
  height: 112px;
  border-radius: 8px;
  object-fit: cover;
`

export const AlbumTile = ({ album }: AlbumTileProp) => {
  const jellyfinApi = useContext(JellyfinApiContext)!
  const albumImgUrl = getImageStreamUrl(jellyfinApi, album.Id!, 96)
  return (
    <Wrapper
      to={{
        pathname: ROUTE_PATH.albumDetail
          .replace(ITEM_ID_DYN_SEG, `/${album.Id}`),
      }}
    >
      <AlbumImgWrapper>
        <AlbumImg src={albumImgUrl} />
        <Avatar.Fallback>
          <LucideImageOff size='100%' strokeWidth={1} />
        </Avatar.Fallback>
      </AlbumImgWrapper>
      <span>{album.Name}</span>
    </Wrapper>
  )
}
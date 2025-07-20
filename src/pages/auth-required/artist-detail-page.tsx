import { styled } from "@linaria/react"
import { AlbumsView } from "./album-page"
import { AudiosView } from "./music-page"
import { useParams } from "react-router"
import { useCallback, useContext } from "react"
import { AudioSortBy, getAlbumsOfArtist, getAudiosOfArtist } from "../../jellyfin/browsing"
import { SortOrder } from "@jellyfin/sdk/lib/generated-client/models"
import { ScrollView } from "../../component/scroll-view"
import { Avatar } from "radix-ui"
import { getImageStreamUrl } from "../../jellyfin/streaming"
import { LucideImageOff } from "lucide-react"
import { useItemInfo } from "./hook/use-item"
import { UseAudiosState } from "./hook/use-audios"
import { UseAlbumsState } from "./hook/use-albums"
import { JellyfinApiContext } from "../../jellyfin/context"

const Wrapper = styled.div`
  height: 100%;
  width: 100%;

  &>* {
    height: 100%;
    width: 100%;
  }
`

const Header = styled.div`
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PageTitle = styled.span`
  font-size: 32px;
`

const ArtistImgWrapper = styled(Avatar.Root)`
  display: block;
  width: 200px;
  height: 200px;
  line-height: 0;
`

const ArtistImg = styled(Avatar.Image)`
  width: 200px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
`

const ArtistAlbumsView = styled(AlbumsView)`
  height: auto;
`

const ArtistAudiosView = styled(AudiosView)`
  height: auto;
`

const audiosViewInitialState: UseAudiosState = {
  offset: 0, size: 25,
  sortBy: "Album", sortOrder: "Ascending"
}

const albumsViewInitialState: UseAlbumsState = {
  offset: 0, size: 25,
  sortOrder: "Ascending"
}

export const ArtistDetailPage = () => {
  const jellyfinApi = useContext(JellyfinApiContext)!
  const params = useParams()
  const id = params['item_id']!

  const { data } = useItemInfo(jellyfinApi, id)

  const getArtistAudios = useCallback(
    (
      offset: number, size: number,
      sortBy: AudioSortBy, sortOrder: SortOrder
    ) => getAudiosOfArtist(jellyfinApi, offset, size, sortBy, sortOrder, id),
    [id, jellyfinApi]
  )

  const getArtistAlbums = useCallback(
    (
      offset: number, size: number,
      sortOrder: SortOrder
    ) => getAlbumsOfArtist(jellyfinApi, offset, size, sortOrder, id),
    [id, jellyfinApi]
  )

  const artistImgUrl = getImageStreamUrl(jellyfinApi, id, 200)
  return (
    <Wrapper>
      <ScrollView>
        <Header>
          <ArtistImgWrapper>
            <ArtistImg src={artistImgUrl} />
            <Avatar.Fallback>
              <LucideImageOff size='100%' strokeWidth={1} />
            </Avatar.Fallback>
          </ArtistImgWrapper>
          <PageTitle>{data?.Name}</PageTitle>
        </Header>
        <ArtistAlbumsView
          fetcher={getArtistAlbums}
          initialState={albumsViewInitialState}
        />
        <ArtistAudiosView
          fetcher={getArtistAudios}
          initialState={audiosViewInitialState}
        />
      </ScrollView>
    </Wrapper>
  )
}
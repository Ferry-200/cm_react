import { styled } from "@linaria/react"
import { AudiosView } from "./music-page"
import { useParams } from "react-router"
import { useCallback, useContext } from "react"
import { AudioSortBy, getArtistsOf, getAudiosOfAlbum } from "../../jellyfin/browsing"
import { SortOrder } from "@jellyfin/sdk/lib/generated-client/models"
import { ScrollView } from "../../component/scroll-view"
import { Avatar } from "radix-ui"
import { getImageStreamUrl } from "../../jellyfin/streaming"
import { LucideImageOff } from "lucide-react"
import { useItemInfo } from "./hook/use-item"
import { ArtistsView } from "./artist-page"
import { UseAudiosState } from "./hook/use-audios"
import { UseArtistsState } from "./hook/use-artists"
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

const AlbumImgWrapper = styled(Avatar.Root)`
  display: block;
  width: 200px;
  height: 200px;
  line-height: 0;
`

const AlbumImg = styled(Avatar.Image)`
  width: 200px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
`

const AlbumArtistsView = styled(ArtistsView)`
  height: auto;
`

const AlbumAudiosView = styled(AudiosView)`
  height: auto;
`

const audiosViewInitialState: UseAudiosState = {
  offset: 0, size: 25,
  sortBy: "IndexNumber", sortOrder: "Ascending"
}

const artistsViewInitialState: UseArtistsState = {
  offset: 0, size: 25,
  sortOrder: "Ascending"
}

export const AlbumDetailPage = () => {
  const jellyfinApi = useContext(JellyfinApiContext)!
  const params = useParams()
  const id = params['item_id']!

  const { data } = useItemInfo(jellyfinApi, id)

  const getAlbumAudios = useCallback(
    (
      offset: number, size: number,
      sortBy: AudioSortBy, sortOrder: SortOrder
    ) => getAudiosOfAlbum(jellyfinApi, offset, size, sortBy, sortOrder, id),
    [id, jellyfinApi]
  )

  const getAlbumArtists = useCallback(
    (
      offset: number, size: number,
      sortOrder: SortOrder
    ) => getArtistsOf(jellyfinApi, offset, size, sortOrder, id),
    [id, jellyfinApi]
  )

  const albumImgUrl = getImageStreamUrl(jellyfinApi, id, 200)
  return (
    <Wrapper>
      <ScrollView>
        <Header>
          <AlbumImgWrapper>
            <AlbumImg src={albumImgUrl} />
            <Avatar.Fallback>
              <LucideImageOff size='100%' strokeWidth={1} />
            </Avatar.Fallback>
          </AlbumImgWrapper>
          <PageTitle>{data?.Name}</PageTitle>
        </Header>
        <AlbumArtistsView
          fetcher={getAlbumArtists}
          initialState={artistsViewInitialState}
        />
        <AlbumAudiosView
          fetcher={getAlbumAudios}
          initialState={audiosViewInitialState}
        />
      </ScrollView>
    </Wrapper>
  )
}
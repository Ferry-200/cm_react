import { styled } from "@linaria/react"
import { AlbumsView } from "./album-page"
import { AudiosView } from "./music-page"
import { useSearchParams } from "react-router"
import { useCallback } from "react"
import { AudioSortBy, getAlbumsOfArtist, getAudiosOfArtist } from "../../jellyfin/browsing"
import { SortOrder } from "@jellyfin/sdk/lib/generated-client/models"
import { ScrollView } from "../../component/scroll-view"
import { Avatar } from "radix-ui"
import { getImageStreamUrl } from "../../jellyfin/streaming"
import { LucideImageOff } from "lucide-react"
import { useItemInfo } from "./hook/use-item"
import { UseAudiosState } from "./hook/use-audios"
import { UseAlbumsState } from "./hook/use-albums"

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
  const [params] = useSearchParams()
  const id = params.get('id')!

  const { data } = useItemInfo(id)

  const getArtistAudios = useCallback(
    (
      offset: number, size: number,
      sortBy: AudioSortBy, sortOrder: SortOrder
    ) => getAudiosOfArtist(offset, size, sortBy, sortOrder, id),
    [id]
  )

  const getArtistAlbums = useCallback(
    (
      offset: number, size: number,
      sortOrder: SortOrder
    ) => getAlbumsOfArtist(offset, size, sortOrder, id),
    [id]
  )

  return (
    <Wrapper>
      <ScrollView>
        <Header>
          <ArtistImgWrapper>
            <ArtistImg src={getImageStreamUrl(id, 200)} />
            <Avatar.Fallback>
              <LucideImageOff size='100%' strokeWidth={1} />
            </Avatar.Fallback>
          </ArtistImgWrapper>
          <PageTitle>{data && data.Name}</PageTitle>
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
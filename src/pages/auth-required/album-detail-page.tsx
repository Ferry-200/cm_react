import { styled } from "@linaria/react"
import { AudiosView } from "./music-page"
import { useSearchParams } from "react-router"
import { useCallback } from "react"
import { AudioSortBy, getArtistsOf, getAudiosOfAlbum } from "../../jellyfin/browsing"
import { SortOrder } from "@jellyfin/sdk/lib/generated-client/models"
import { ScrollView } from "../../component/scroll-view"
import { Avatar } from "radix-ui"
import { getImageStreamUrl } from "../../jellyfin/streaming"
import { LucideImageOff } from "lucide-react"
import { useItemInfo } from "./hook/use-item"
import { ArtistsView } from "./artist-page"

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

const AlbumLargeImg = styled(Avatar.Image)`
  display: block;
  width: 200px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
`

const AlbumLargeImgFallback = styled(Avatar.Fallback)`
  display: block;
  width: 200px;
  height: 200px;
`

const AlbumArtistsView = styled(ArtistsView)`
  height: auto;
`

const AlbumAudiosView = styled(AudiosView)`
  height: auto;
`

export const AlbumDetailPage = () => {
  const [params] = useSearchParams()
  const id = params.get('id')!

  const { data } = useItemInfo(id)

  const getAlbumAudios = useCallback(
    (
      offset: number, size: number,
      sortBy: AudioSortBy, sortOrder: SortOrder
    ) => getAudiosOfAlbum(offset, size, sortBy, sortOrder, id),
    [id]
  )

  const getAlbumArtists = useCallback(
    (
      offset: number, size: number,
      sortOrder: SortOrder
    ) => getArtistsOf(offset, size, sortOrder, id),
    [id]
  )

  return (
    <Wrapper>
      <ScrollView>
        <Header>
          <Avatar.Root>
            <AlbumLargeImg src={getImageStreamUrl(id, 200)} />
            <AlbumLargeImgFallback asChild>
              <LucideImageOff strokeWidth={1} />
            </AlbumLargeImgFallback>
          </Avatar.Root>
          <PageTitle>{data && data.Name}</PageTitle>
        </Header>
        <AlbumArtistsView fetcher={getAlbumArtists} />
        <AlbumAudiosView fetcher={getAlbumAudios} />
      </ScrollView>
    </Wrapper>
  )
}
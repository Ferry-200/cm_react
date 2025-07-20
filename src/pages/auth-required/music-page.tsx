import { styled } from "@linaria/react"
import { useAudios, UseAudiosFetcher, UseAudiosState } from "./hook/use-audios"
import { AudioTile } from "./component/audio-tile"
import { PagingArea } from "./component/paging-area"
import { StandardIconButton } from "../../component/icon-button"
import { LucideShuffle, LucideSortAsc, LucideSortDesc } from "lucide-react"
import { SortOrder } from "@jellyfin/sdk/lib/generated-client/models"
import { MenuIconButton } from "../../component/menu-icon-button"
import { DropdownMenu } from "radix-ui"
import { RadioGroup } from "../../component/radio-group"
import { AudioSortBy, AudioSortByValues, getLibraryAudios } from "../../jellyfin/browsing"
import { Stylable } from "../../utils"
import { ScrollView } from "../../component/scroll-view"
import { MouseEventHandler, useCallback, useContext } from "react"
import { PlayerContext } from "../../player/context"
import { JellyfinApiContext } from "../../jellyfin/context"

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const ViewHeader = styled.div`
  flex-shrink: 0;
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 8px;
`

const ViewHeaderActions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
`

const ViewMain = styled(ScrollView)`
  width: 100%;
  flex-grow: 1;
  min-height: 0;
`

const ScrollViewPagingArea = styled(PagingArea)`
  flex-shrink: 0;
`

type SortOrderToggleBtnProp = {
  currOrder: SortOrder,
  onOrderSelected: (order: SortOrder) => void
}

const SortOrderToggleBtn = ({ currOrder, onOrderSelected }: SortOrderToggleBtnProp) => {
  return (
    <StandardIconButton
      onClick={() => {
        onOrderSelected(
          currOrder === SortOrder.Ascending
            ? SortOrder.Descending
            : SortOrder.Ascending
        )
      }}
    >
      {
        currOrder === SortOrder.Ascending
          ? <LucideSortAsc />
          : <LucideSortDesc />
      }
    </StandardIconButton>
  )
}

const MenuLabel = styled(DropdownMenu.Label)`
  margin: 4px 0 4px 12px;
  color: var(--on-surface-variant);
  font-weight: bold;
`

function getAudioSortByDisplay(sortBy: AudioSortBy) {
  switch (sortBy) {
    case "Name": return '标题'
    case "Artist": return '艺术家'
    case "Album": return '专辑'
    case "DateCreated": return '创建时间'
    case "IndexNumber": return '音轨号'
  }
}

type AudiosViewProp = Stylable & {
  fetcher: UseAudiosFetcher,
  initialState: UseAudiosState
}

export const AudiosView = ({ className, style, fetcher, initialState }: AudiosViewProp) => {
  const player = useContext(PlayerContext)!

  const [state, result, dispatch] = useAudios(fetcher, initialState)
  const currPage = state.offset / state.size
  const showPagingArea = state.size < (result.data?.TotalRecordCount ?? 0)
  const showSizingArea = (result.data?.TotalRecordCount ?? 0) > 25
  const showSortingArea = (result.data?.TotalRecordCount ?? 0) > 1
  const showMenuIconButton = showSizingArea || showSortingArea

  const sortOrderBtn = showSortingArea
    ? (<SortOrderToggleBtn
      currOrder={state.sortOrder}
      onOrderSelected={(order) => {
        dispatch({ type: 'setSortOrder', sortOrder: order })
      }}
    />)
    : undefined

  const sortByMenu = showSortingArea
    ? (
      <>
        <MenuLabel>排序方式</MenuLabel>
        <RadioGroup
          curr={state.sortBy}
          onValueChange={(curr) => {
            dispatch({ type: 'setSortBy', sortBy: curr })
          }}
          items={AudioSortByValues.map(
            (value) => ({
              value: value,
              display: getAudioSortByDisplay(value)
            })
          )}
        />
      </>
    )
    : undefined

  const sizingMenu = showSizingArea
    ? (
      <>
        <MenuLabel>数量</MenuLabel>
        <RadioGroup
          curr={state.size.toString()}
          onValueChange={(curr) => {
            dispatch({ type: 'setSize', size: Number.parseInt(curr) })
          }}
          items={[
            { value: '25', display: '25' },
            { value: '50', display: '50' },
            { value: '75', display: '75' },
            { value: '100', display: '100' }
          ].slice(0,
            Math.min(4, Math.floor((result.data?.TotalRecordCount ?? 0) / 25) + 1)
          )}
        />
      </>
    )
    : undefined

  const menuAnchor = showMenuIconButton
    ? (
      <MenuIconButton>
        {sortByMenu}
        {sizingMenu}
      </MenuIconButton>
    )
    : undefined

  const pagingArea = showPagingArea
    ? <ScrollViewPagingArea
      curr={currPage}
      count={Math.ceil((result.data?.TotalRecordCount ?? 0) / state.size)}
      onPaging={(p) => dispatch({
        type: 'setOffset',
        offset: p * state.size
      })}
    />
    : null

  const playAllAudios = useCallback((startFrom?: number, shuffle?: boolean) => {
    const playlist = result.data?.Items?.map(
      (item) => ({
        id: item.Id!,
        title: item.Name!,
        artists: item
          .ArtistItems!
          .map((artist) => ({ id: artist.Id!, name: artist.Name! })),
        album: { id: item.AlbumId!, name: item.Album! }
      })
    )
    if (playlist) {
      player.setPlaylist(playlist, startFrom || 0, shuffle)
      player.play()
    }
  }, [player, result.data?.Items])

  const onAudioSelected = useCallback<MouseEventHandler<HTMLDivElement>>((event) => {
    const audioTile = (event.target as HTMLElement).closest('[data-index]')
    if (!audioTile) return

    const index = audioTile.getAttribute('data-index')
    if (index) {
      playAllAudios(parseInt(index), false)
    }
  }, [playAllAudios])

  return (
    <Wrapper className={className} style={style}>
      <ViewHeader>
        <span>{result.data?.TotalRecordCount ?? ''} 首歌曲</span>
        <ViewHeaderActions>
          <StandardIconButton onClick={() => playAllAudios(0, true)}>
            <LucideShuffle />
          </StandardIconButton>
          {sortOrderBtn}
          {menuAnchor}
        </ViewHeaderActions>
      </ViewHeader>

      <ViewMain>
        {
          result.data &&
          (
            <div onClick={onAudioSelected}>{
              result.data.Items?.map(
                (item, index) => <AudioTile
                  key={item.Id}
                  audio={item}
                  index={index}
                />
              )
            }</div>
          )
        }
        {pagingArea}
      </ViewMain>
    </Wrapper>
  )
}

const audiosViewInitialState: UseAudiosState = {
  offset: 0, size: 50,
  sortBy: "Artist", sortOrder: "Ascending"
}

export const MusicPage = () => {
  const jellyfinApi = useContext(JellyfinApiContext)!
  return (<AudiosView
    fetcher={getLibraryAudios.bind(this, jellyfinApi)}
    initialState={audiosViewInitialState}
  />)
}

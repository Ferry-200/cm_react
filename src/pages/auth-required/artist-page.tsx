import { styled } from "@linaria/react"
import { useArtists, UseArtistsFetcher, UseArtistsState } from "./hook/use-artists"
import { ArtistTile } from "./component/artist-tile"
import { PagingArea } from "./component/paging-area"
import { StandardIconButton } from "../../component/icon-button"
import { LucideSortAsc, LucideSortDesc } from "lucide-react"
import { SortOrder } from "@jellyfin/sdk/lib/generated-client/models"
import { MenuIconButton } from "../../component/menu-icon-button"
import { DropdownMenu } from "radix-ui"
import { RadioGroup } from "../../component/radio-group"
import { getLibraryArtists } from "../../jellyfin/browsing"
import { Stylable } from "../../utils"
import { ScrollView } from "../../component/scroll-view"

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

const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(136px, 1fr));
  gap: 8px;
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

type ArtistsViewProp = Stylable & {
  fetcher: UseArtistsFetcher,
  initialState: UseArtistsState
}

export const ArtistsView = ({ className, style, fetcher, initialState }: ArtistsViewProp) => {
  const [state, result, dispatch] = useArtists(fetcher, initialState)
  const currPage = state.offset / state.size
  const showPagingArea = state.size < (result.data?.TotalRecordCount ?? 0)
  const showSizingArea = (result.data?.TotalRecordCount ?? 0) > 25
  const showSortingArea = (result.data?.TotalRecordCount ?? 0) > 1

  const sortOrderBtn = showSortingArea
    ? (<SortOrderToggleBtn
      currOrder={state.sortOrder}
      onOrderSelected={(order) => {
        dispatch({ type: 'setSortOrder', sortOrder: order })
      }}
    />)
    : undefined

  const sizingMenuAnchor = showSizingArea
    ? (<MenuIconButton>
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
    </MenuIconButton>)
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

  return (
    <Wrapper className={className} style={style}>
      <ViewHeader>
        <span>{result.data?.TotalRecordCount ?? ''} 位艺术家</span>
        <ViewHeaderActions>
          {sortOrderBtn}
          {sizingMenuAnchor}
        </ViewHeaderActions>
      </ViewHeader>

      <ViewMain>
        {
          result.data &&
          (
            <GridView>{
              result.data.Items?.map(
                (item) => <ArtistTile key={item.Id} artist={item} />
              )
            }</GridView>
          )
        }
        {pagingArea}
      </ViewMain>
    </Wrapper>
  )
}

const artistsViewInitialState: UseArtistsState = {
  offset: 0, size: 50,
  sortOrder: "Ascending"
}

export const ArtistPage = () => {
  return (<ArtistsView
    fetcher={getLibraryArtists}
    initialState={artistsViewInitialState}
  />)
}

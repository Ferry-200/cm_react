import { styled } from "@linaria/react"
import { useAudios } from "./hooks"
import { AudioTile } from "./component/audio-tile"
import { PagingArea } from "./component/paging-area"
import { StandardIconButton } from "../../component/icon-button"
import { LucideShuffle, LucideSortAsc, LucideSortDesc } from "lucide-react"
/** 使用最后一个没有 display: table; 的版本，保证兼容性和界面效果 */
import { ScrollArea, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb } from "@radix-ui/react-scroll-area"
import { SortOrder } from "@jellyfin/sdk/lib/generated-client/models"
import { MenuIconButton } from "../../component/menu-icon-button"
import { DropdownMenu } from "radix-ui"
import { RadioGroup } from "../../component/radio-group"
import { AudioSortByValues, getAudioSortByDisplay } from "../../jellyfin/browsing"

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const PageHeader = styled.div`
  flex-shrink: 0;
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 8px;
`

const PageHeaderActions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
`

const ListViewRoot = styled(ScrollArea)`
  width: 100%;
  flex-grow: 1;
  min-height: 0;
`

const ListViewMain = styled(ScrollAreaViewport)`
  width: 100%;
  height: 100%;
`

const ListViewScrollbar = styled(ScrollAreaScrollbar)`
	/* ensures no selection */
	user-select: none;
	/* disable browser handling of all panning and zooming gestures on touch devices */
	touch-action: none;
  width: 8px;
  padding: 8px 0;
`

const ListViewThumb = styled(ScrollAreaThumb)`
	background-color: var(--md-outline);
  width: 8px;
	border-radius: 4px;
`

const ListViewPagingArea = styled(PagingArea)`
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

export const MusicPage = () => {
  const [state, result, dispatch] = useAudios()
  const currPage = (state.offset / state.size) + 1
  return (
    <Wrapper>
      <PageHeader>
        {result.data && <span>{result.data.TotalRecordCount!} 首歌曲</span>}
        <PageHeaderActions>
          <StandardIconButton onClick={() => { }}>
            <LucideShuffle />
          </StandardIconButton>
          <SortOrderToggleBtn
            currOrder={state.sortOrder}
            onOrderSelected={(order) => {
              dispatch({ type: 'setSortOrder', sortOrder: order })
            }}
          />
          <MenuIconButton>
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
              ]}
            />
          </MenuIconButton>
        </PageHeaderActions>
      </PageHeader>

      <ListViewRoot type='scroll'>
        {
          result.data &&
          <ListViewMain>
            {result.data.Items!.map(
              (item) => <AudioTile key={item.Id} audio={item} />
            )}
            <ListViewPagingArea
              curr={currPage}
              count={Math.ceil(result.data.TotalRecordCount! / state.size)}
              onPaging={(page) => dispatch({
                type: 'setOffset',
                offset: (page - 1) * state.size
              })}
            />
          </ListViewMain>
        }
        <ListViewScrollbar orientation="vertical">
          <ListViewThumb />
        </ListViewScrollbar>
      </ListViewRoot>
    </Wrapper>
  )
}
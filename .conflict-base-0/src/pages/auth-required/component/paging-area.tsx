import { styled } from "@linaria/react"
import { LucideChevronLeft, LucideChevronRight, LucideMoreHorizontal } from "lucide-react"
import { Stylable } from "../../../utils"

type PagingAreaProp = Stylable & {
  curr: number,
  count: number,
  onPaging: (page: number) => void
}

const Wrapper = styled.div`
  height: 56px;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 8px;
`

const PagingBtn = styled.button`
  height: 40px;
  width: 40px;
  border-radius: 8px;
  background-color: var(--md-primary-container);
  color: var(--md-on-primary-container);
  border: none;
  cursor: pointer;
  position: relative;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.primary {
    background-color: var(--md-primary);
    color: var(--md-on-primary);
  }

  &.disable {
    opacity: 0.36;
    cursor: not-allowed;

    &:hover::before,&:active::before {
      background: none;
    }
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    pointer-events: none;
    transition: background-color 150ms;
  }

  &:hover::before {
    background-color: var(--md-primary-container-hover);
  }

  &:active::before {
    background-color: var(--md-primary-container-active);
  }
`

/**
 * |<-| 1 |...| 4 |...| 7 |->|
 * 始终显示 <-、第一页、最后一页、-> 和当前页
 * 第一页和当前页之间的页数大于1时，折叠；否则直接显示
 * 最后一页和当前页之间的页数大于1时，折叠；否则直接显示
 */
export const PagingArea = ({ className, style, curr, count, onPaging }: PagingAreaProp) => {
  const buildPagingBtn = (p: number) => (
    <PagingBtn
      key={p}
      type="button"
      className={curr === p ? 'primary' : undefined}
      onClick={() => onPaging(p)}
    >{p + 1}</PagingBtn>
  )

  const pagingBtns = []

  // 第一页
  pagingBtns.push(buildPagingBtn(0))

  // 第一页和当前页之间的页数
  const btnCountBetweenFirstCurr = curr - 1
  if (btnCountBetweenFirstCurr > 0) {
    pagingBtns.push(
      btnCountBetweenFirstCurr > 1
        ? (
          <PagingBtn
            key='left-ellipsis'
            type="button"
          ><LucideMoreHorizontal /></PagingBtn>
        )
        : buildPagingBtn(1)
    )
  }

  // curr 在中间的情况
  if (curr >= 1 && curr <= count - 2) {
    pagingBtns.push(buildPagingBtn(curr))
  }

  // 最后一页和当前页之间的页数
  const btnCountBetweenCurrLast = count - curr - 2
  if (btnCountBetweenCurrLast > 0) {
    pagingBtns.push(
      btnCountBetweenCurrLast > 1
        ? (
          <PagingBtn
            key='right-ellipsis'
            type="button"
          ><LucideMoreHorizontal /></PagingBtn>
        )
        : buildPagingBtn(count - 2)
    )
  }

  // 最后一页
  pagingBtns.push(buildPagingBtn(count - 1))

  const hasPrev = curr > 0
  const hasNext = curr < count - 1

  return (
    <Wrapper className={className} style={style}>
      <PagingBtn
        type="button"
        className={hasPrev ? 'primary' : 'disable'}
        onClick={hasPrev ? () => onPaging(curr - 1) : undefined}
      >
        <LucideChevronLeft />
      </PagingBtn>
      {pagingBtns}
      <PagingBtn
        type="button"
        className={hasNext ? 'primary' : 'disable'}
        onClick={hasNext ? () => onPaging(curr + 1) : undefined}
      >
        <LucideChevronRight />
      </PagingBtn>
    </Wrapper>
  )
}
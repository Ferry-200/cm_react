import { styled } from "@linaria/react"
import { LucideChevronLeft, LucideChevronRight } from "lucide-react"
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

export const PagingArea = ({ className, style, curr, count, onPaging }: PagingAreaProp) => {
  const pagingBtns = []
  for (let i = 0; i < count; i++) {
    const p = i + 1
    pagingBtns.push(
      <PagingBtn
        key={p}
        type="button"
        className={curr === p ? 'primary' : undefined}
        onClick={() => onPaging(p)}
      >{p}</PagingBtn>
    )
  }

  return (
    <Wrapper className={className} style={style}>
      <PagingBtn
        type="button"
        className={curr > 1 ? 'primary' : 'disable'}
        onClick={curr > 1 ? () => onPaging(curr - 1) : undefined}
      >
        <LucideChevronLeft />
      </PagingBtn>
      {pagingBtns}
      <PagingBtn
        type="button"
        className={curr < count ? 'primary' : 'disable'}
        onClick={curr < count ? () => onPaging(curr + 1) : undefined}
      >
        <LucideChevronRight />
      </PagingBtn>
    </Wrapper>
  )
}
import { styled } from "@linaria/react"
import { ReactNode } from "react"

export type SegmentedButtonOption<V> = {
  icon: ReactNode,
  val: V
}

type SegmentedButtonProp<V> = {
  options: SegmentedButtonOption<V>[],
  selected: V,
  onSelected: (selected: V) => void
}

const Wrapper = styled.div`
  height: 36px;
  border-radius: 18px;
  display: flex;
`

const OptionTile = styled.button`
  border: none;
  background: none;
  color: var(--md-on-surface);
  padding: 0 18px;
  font-size: 16px;
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &.left-side {
    border-radius: 18px 0 0 18px;
    padding: 0 18px 0 18px;
  }

  &.right-side {
    border-radius: 0 18px 18px 0;
    padding: 0 18px 0 18px;
  }

  &.selected {
    background-color: var(--md-secondary-container);
    color: var(--md-on-secondary-container);

    &:hover::before {
      background-color: var(--md-secondary-container-hover);
    }

    &:active::before {
      background-color: var(--md-secondary-container-active);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    pointer-events: none;
  }

  &:hover::before {
    background-color: var(--md-surface-hover);
  }

  &:active::before {
    background-color: var(--md-surface-active);
  }
`

export const SegmentedButton = <V,>({ options, selected, onSelected }: SegmentedButtonProp<V>) => {
  return (
    <Wrapper>
      {options.map((item, index, arr) => {
        const cl = []
        if (item.val === selected) cl.push('selected')
        if (index === 0) cl.push('left-side')
        if (index === arr.length - 1) cl.push('right-side')

        return (
          <OptionTile
            className={cl.join(' ')}
            onClick={() => {
              onSelected(item.val)
            }}>
            {item.icon}
          </OptionTile>
        )
      })}
    </Wrapper>
  )
}
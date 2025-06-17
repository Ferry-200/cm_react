import { styled } from "@linaria/react"
import { ReactNode } from "react"
import { makeClickable } from "../utils"

export type SegmentedButtonOption<V> = {
  icon: ReactNode,
  title?: ReactNode,
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
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0;
  gap: 4px;

  &.left-side {
    border-radius: 18px 0 0 18px;
    padding: 0 18px 0 18px;
  }

  &.right-side {
    border-radius: 0 18px 18px 0;
    padding: 0 18px 0 18px;
  }

  ${makeClickable('--md-surface-hover', '--md-surface-active')}

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
            key={index}
            className={cl.join(' ')}
            onClick={() => {
              onSelected(item.val)
            }}>
            {item.icon}
            {item.title}
          </OptionTile>
        )
      })}
    </Wrapper>
  )
}
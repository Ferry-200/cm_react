import { styled } from "@linaria/react"
import { DropdownMenu } from "radix-ui"

const RadioCheckedIndicator = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--md-primary)"><path d="M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
)

const RadioUncheckedIndicator = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--md-on-surface-variant)"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
)

type RadioIndicatorProp = {
  checked: boolean
}

const RadioIndicator = ({ checked }: RadioIndicatorProp) => (
  checked ? <RadioCheckedIndicator /> : <RadioUncheckedIndicator />
)

const RadioItem = styled(DropdownMenu.RadioItem)`
  height: 36px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;

  &>span {
    margin-left: 8px;
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

type RadioGroupProp<T extends string> = {
  curr: T,
  onValueChange: (curr: T) => void,
  items: { value: T, display: string }[]
}

/** 
 * 因为 Radix 的 `RadioGroup` 只支持 `string`，不支持泛型，所以这里只能把类型限制为 `string`  
 * reference: https://github.com/radix-ui/primitives/issues/3471
 * */
export function RadioGroup<T extends string>({ curr, onValueChange, items }: RadioGroupProp<T>) {
  return (
    <DropdownMenu.RadioGroup
      value={curr}
      onValueChange={onValueChange as (curr: string) => void}
    >
      {
        items.map(({ value, display }) => (
          <RadioItem key={value} value={value}>
            <RadioIndicator checked={curr === value} />
            <span>{display}</span>
          </RadioItem>
        ))
      }
    </DropdownMenu.RadioGroup>
  )
}
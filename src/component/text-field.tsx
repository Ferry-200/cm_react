import { styled } from "@linaria/react"
import { CSSProperties, forwardRef, useImperativeHandle, useRef } from "react"

type TextFieldProp = {
  className?: string,
  style?: CSSProperties,
  id: string,
  labelStr: string,
  password?: boolean
}

export type TextFieldHandle = {
  getText: () => string
}

const TextFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  position: relative;
`

const InnerInput = styled.input`
  padding: 0 8px;
  display: block;
  height: 40px;
  font-size: 18px;
  outline: var(--md-outline) solid 1px;
  background: none;
  border: none;
  border-radius: 4px;
  color: var(--md-on-surface-variant);

  +label {
    position: absolute;
    color: var(--md-on-surface-variant);
    line-height: 12px;
    font-size: 12px;
    top: -7px;
    left: 8px;
    background-color: var(--md-primary-container);
    transition: all 150ms;
  }

  &:placeholder-shown+label {
    font-size: 18px;
    line-height: 18px;
    top: 11px;
  }

  &:focus {
    outline: var(--md-primary) solid 2px;
    color: var(--md-on-primary-container);

    +label {
      color: var(--md-primary);
      line-height: 12px;
      font-size: 12px;
      top: -7px;
      background-color: var(--md-primary-container);
    }
  }
`

export const TextField = forwardRef<TextFieldHandle, TextFieldProp>(
  ({ className, style, id, labelStr, password }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => {
      return {
        getText: () => inputRef.current!.value
      }
    }, [])

    return (
      <TextFieldWrapper className={className} style={style}>
        <InnerInput type={password ? 'password' : 'text'} placeholder="" id={id} ref={inputRef} />
        <label htmlFor={id}>{labelStr}</label>
      </TextFieldWrapper>
    )
  }
)
import { styled } from "@linaria/react"
import { Dispatch, forwardRef, HTMLInputAutoCompleteAttribute, SetStateAction, useImperativeHandle, useRef, useState } from "react"
import { Stylable } from "../utils"

type TextFieldProp = Stylable & {
  id: string,
  labelStr: string,
  password?: boolean,
  autoComplete: HTMLInputAutoCompleteAttribute
}

export type TextFieldHandle = {
  getText: () => string,
  setErr: Dispatch<SetStateAction<boolean>>
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

  &+label {
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

  &.error {
    outline: var(--md-error) solid 2px;

    +label {
      color: var(--md-error);
    }
  }
`

export const TextField = forwardRef<TextFieldHandle, TextFieldProp>(
  ({ className, style, id, labelStr, password, autoComplete }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [err, setErr] = useState(false)

    useImperativeHandle(ref, () => {
      return {
        getText: () => inputRef.current!.value,
        setErr: setErr
      }
    }, [])

    return (
      <TextFieldWrapper className={className} style={style}>
        <InnerInput
          className={err ? 'error' : undefined}
          ref={inputRef}
          autoComplete={autoComplete}
          type={password ? 'password' : 'text'}
          placeholder=""
          id={id}
        />
        <label htmlFor={id}>{labelStr}</label>
      </TextFieldWrapper>
    )
  }
)
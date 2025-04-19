import { styled } from "@linaria/react"
import { forwardRef, MouseEventHandler, ReactNode } from "react"
import { Stylable } from "../utils"

type IconButtonProp = Stylable & {
  children: ReactNode,
  onClick: MouseEventHandler<HTMLButtonElement>
}

const Button = styled.button`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  border: none;
  background: none;
  color: var(--md-on-surface);
  position: relative;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    pointer-events: none;
  }

  &:hover::before {
    background-color: var(--md-surface-hover);
  }

  &:active::before {
    background-color: var(--md-surface-active);
  }
`

export const StandardIconButton = forwardRef<HTMLButtonElement, IconButtonProp>(
  ({ className, style, children, onClick }, ref) => {
    return (
      <Button
        className={className}
        style={style}
        type="button"
        ref={ref}
        onClick={onClick}
      >
        {children}
      </Button>
    )
  }
)
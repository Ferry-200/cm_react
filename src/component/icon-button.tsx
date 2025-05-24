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

const PrimaryButton = styled(Button)`
  background-color: var(--md-primary);
  color: var(--md-on-primary);
  &:hover::before {
    background-color: var(--md-primary-hover);
  }

  &:active::before {
    background-color: var(--md-primary-active);
  }
`

export const PrimaryIconButton = forwardRef<HTMLButtonElement, IconButtonProp>(
  ({ className, style, children, onClick }, ref) => {
    return (
      <PrimaryButton
        className={className}
        style={style}
        type="button"
        ref={ref}
        onClick={onClick}
      >
        {children}
      </PrimaryButton>
    )
  }
)

const SecondaryButton = styled(Button)`
  background-color: var(--md-secondary);
  color: var(--md-on-secondary);
  &:hover::before {
    background-color: var(--md-secondary-hover);
  }

  &:active::before {
    background-color: var(--md-secondary-active);
  }
`

export const SecondaryIconButton = forwardRef<HTMLButtonElement, IconButtonProp>(
  ({ className, style, children, onClick }, ref) => {
    return (
      <SecondaryButton
        className={className}
        style={style}
        type="button"
        ref={ref}
        onClick={onClick}
      >
        {children}
      </SecondaryButton>
    )
  }
)

export type IconButtonType = 'standard' | 'primary' | 'secondary'

export const IconButton = (
  { type, children, ...others }: { type:  IconButtonType} & IconButtonProp
) => {
  switch (type) {
    case "standard": return (<StandardIconButton {...others}>{children}</StandardIconButton>)
    case "primary": return (<PrimaryIconButton {...others}>{children}</PrimaryIconButton>)
    case "secondary": return (<SecondaryIconButton {...others}>{children}</SecondaryIconButton>)
  }
}
import { styled } from "@linaria/react"
import { forwardRef, MouseEventHandler, ReactNode } from "react"
import { makeClickable, Stylable } from "../utils"

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

  ${makeClickable('--md-surface-hover', '--md-surface-active')}

  display: flex;
  justify-content: center;
  align-items: center;
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
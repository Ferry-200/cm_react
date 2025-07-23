import { styled } from "@linaria/react"
import { makeClickable, Stylable } from "../utils"
import { MouseEventHandler, ReactNode } from "react"

export const StandardIconButton = styled.button`
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

export const PrimaryIconButton = styled(StandardIconButton)`
  background-color: var(--md-primary);
  color: var(--md-on-primary);
  &:hover::before {
    background-color: var(--md-primary-hover);
  }

  &:active::before {
    background-color: var(--md-primary-active);
  }
`

export const SecondaryIconButton = styled(StandardIconButton)`
  background-color: var(--md-secondary);
  color: var(--md-on-secondary);
  &:hover::before {
    background-color: var(--md-secondary-hover);
  }

  &:active::before {
    background-color: var(--md-secondary-active);
  }
`

export const TonalIconButton = styled(StandardIconButton)`
  background-color: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  &:hover::before {
    background-color: var(--md-secondary-container-hover);
  }

  &:active::before {
    background-color: var(--md-secondary-container-active);
  }
`

export type IconButtonVariant = {
  type: 'standard' | 'primary' | 'secondary' | 'tonal'
}

type UniIconButtonProp = Stylable & IconButtonVariant & {
  onClick: MouseEventHandler<HTMLButtonElement>,
  children: ReactNode
}

export const UniIconButton = (
  { style, className, type, children, onClick }: UniIconButtonProp
) => {
  switch (type) {
    case "standard": return (
      <StandardIconButton style={style} className={className}
        onClick={onClick}
      >{children}</StandardIconButton>
    )
    case "primary": return (
      <PrimaryIconButton style={style} className={className}
        onClick={onClick}
      >{children}</PrimaryIconButton>
    )
    case "secondary": return (
      <SecondaryIconButton style={style} className={className}
        onClick={onClick}
      >{children}</SecondaryIconButton>
    )
    case "tonal": return (
      <TonalIconButton style={style} className={className}
        onClick={onClick}
      >{children}</TonalIconButton>
    )
  }
}

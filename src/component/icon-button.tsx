import { styled } from "@linaria/react"
import { makeClickable } from "../utils"

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
import { styled } from "@linaria/react"
import { makeClickable } from "../utils"

export const FilledButton = styled.button`
  border: none;
  background-color: var(--md-primary);
  color: var(--md-on-primary);
  height: 40px;
  border-radius: 20px;
  padding: 0 24px;
  font-size: 16px;

  ${makeClickable('--md-primary-hover', '--md-primary-active')}
`
import { styled } from "@linaria/react"
import { Link } from "react-router"

export const FilledLinkChip = styled(Link)`
  font-size: 14px;
  background-color: var(--md-surface-container);
  color: var(--md-on-surface-container);
  border-radius: 4px;
  padding: 0 4px;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: var(--md-secondary-container);
    color: var(--md-on-secondary-container);
  }
`
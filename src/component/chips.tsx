import { styled } from "@linaria/react"
import { Link } from "react-router"

export const FilledLinkChip = styled(Link)`
  font-size: 14px;
  background-color: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  border-radius: 4px;
  padding: 0 4px;
  text-decoration: none;

  &:hover {
    background-color: var(--md-secondary);
    color: var(--md-on-secondary);
  }
`
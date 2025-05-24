import { styled } from "@linaria/react";
import { LinkChip } from "../../../../component/chips";

export const AccentLinkChip = styled(LinkChip)`
  background-color: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  max-width: 268px;

  &:hover {
    background-color: var(--md-secondary);
    color: var(--md-on-secondary);
  }
`
import { styled } from "@linaria/react";
import { makeClickable } from "../../../../utils";

type LyricTileInnerProp = {
  align?: 'start' | 'center' | 'end'
}

export const LyricTileInner = styled.div<LyricTileInnerProp>`
  width: fit-content;
  padding: 8px;
  display: flex;
  flex-direction: column;
  margin: ${props => props.align === 'center'
    ? '0 auto'
    : props.align === 'end'
      ? '0 0 0 auto'
      : 0
  };
  align-items: ${props => props.align ?? 'start'};
  text-align: ${props => props.align ?? 'start'};
  color: var(--md-on-surface-variant);
  font-size: 20px;
  font-weight: bold;
  border-radius: 8px;

  ${makeClickable('--md-surface-hover', '--md-surface-active')}

  &>*:first-child {
    font-size: 24px;
  }

  &.curr {
    color: var(--md-on-surface);
  }

  &:not(.curr)::before {
    backdrop-filter: blur(2px);
  }
`
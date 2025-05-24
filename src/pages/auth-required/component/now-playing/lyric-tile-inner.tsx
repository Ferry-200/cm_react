import { styled } from "@linaria/react";

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
  position: relative;
  border-radius: 8px;
  cursor: pointer;

  &>*:first-child {
    font-size: 24px;
  }

  &.curr {
    color: var(--md-on-surface);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    pointer-events: none;
  }

  &:not(.curr)::before {
    backdrop-filter: blur(2px);
  }

  &:hover::before {
    background-color: var(--md-surface-hover);
  }

  &:active::before {
    background-color: var(--md-surface-active);
  }
`
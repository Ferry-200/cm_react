import { styled } from "@linaria/react"

export const BlurAlbumArtBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: radial-gradient(circle at 20% 30%, var(--md-secondary) 0%, transparent 32%),
              radial-gradient(circle at 50% 50%, var(--md-primary) 0%, transparent 32%),
              radial-gradient(circle at 80% 60%, var(--md-tertiary) 0%, transparent 32%),
              var(--md-surface-container);
  will-change: background-position;
  background-size: 200% 200%;
  animation: flow 6s ease-in-out infinite alternate;

  @keyframes flow {
    0% {
      background-position: 20% 30%, 50% 50%, 80% 60%;
    }
    100% {
      background-position: 35% 45%, 65% 25%, 65% 45%;
    }
  }
`

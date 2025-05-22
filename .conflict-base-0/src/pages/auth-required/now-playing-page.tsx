import { styled } from "@linaria/react"

const Wrap = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const NowPlayingPage = () => {
  return (
    <Wrap>
      now-playing
    </Wrap>
  )
}
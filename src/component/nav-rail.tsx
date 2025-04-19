import { styled } from "@linaria/react"
import { BREAKPOINT } from "../utils"

const Wrapper = styled.nav`
  width: 80px;
  height: 100vh;
  background-color: var(--md-surface-container);
  display: none;

  @media screen and (min-width: ${BREAKPOINT.medium}) {
    display: block;
  }
`

export const NavRail = () => {
  return (
    <Wrapper />
  )
}
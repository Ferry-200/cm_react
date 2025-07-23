import { styled } from "@linaria/react"
import { makeClickable, Stylable } from "../../../utils"
import { Link, useLocation } from "react-router"
import { ReactNode } from "react"
import { ROUTE_PATH } from "../../../router"
import { LucideDiscAlbum, LucideMusic, LucideUsers } from "lucide-react"
import { ThemeModeToggle } from "../../../component/theme-mode-toggle"

const Wrapper = styled.nav`
  width: 80px;
  height: 100vh;
  background-color: var(--md-surface-container);
  padding: 12px;
`

const DesLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 56px;
  width: 100%;
  text-decoration: none;
  color: var(--md-on-surface);
  margin-bottom: 12px;
`

type NavRailDesProp = {
  to: string,
  icon: ReactNode,
  text: string
}

const DesIconWrapper = styled.div`
  height: 32px;
  width: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${makeClickable('--md-surface-hover', '--md-surface-active')}

  &.curr {
    background-color: var(--md-secondary-container);
    color: var(--md-on-secondary-container);

    &:hover::before {
      background-color: var(--md-secondary-container-hover);
    }

    &:active::before {
      background-color: var(--md-secondary-container-active);
    }

    &+span {
      font-weight: bold;
    }
  }
`

const NavRailDes = ({ to, icon, text }: NavRailDesProp) => {
  const loc = useLocation()

  return (
    <DesLink to={to}>
      <DesIconWrapper className={loc.pathname === to ? 'curr' : undefined}>
        {icon}
      </DesIconWrapper>
      <span>{text}</span>
    </DesLink>
  )
}

const BottomedThemeModeToggle = styled(ThemeModeToggle)`
  position: absolute;
  bottom: 12px;
  left: 20px;
`

export const NavRail = ({ className, style }: Stylable) => {
  return (
    <Wrapper className={className} style={style}>
      <NavRailDes
        to={ROUTE_PATH.index}
        icon={<LucideMusic />}
        text="音乐"
      />
      <NavRailDes
        to={ROUTE_PATH.artist}
        icon={<LucideUsers />}
        text="艺术家"
      />
      <NavRailDes
        to={ROUTE_PATH.album}
        icon={<LucideDiscAlbum />}
        text="专辑"
      />
      <BottomedThemeModeToggle />
    </Wrapper>
  )
}
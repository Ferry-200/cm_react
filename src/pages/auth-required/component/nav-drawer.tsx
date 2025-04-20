import { styled } from "@linaria/react"
import { ReactNode } from "react"
import { ROUTE_PATH } from "../../../router"
import { LucideDiscAlbum, LucideMusic, LucideUsers } from "lucide-react"
import { Link, useLocation } from "react-router"

const DesLink = styled(Link)`
  color: var(--md-on-surface);
  width: 100%;
  height: 56px;
  padding: 0 16px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  text-decoration: none;
  position: relative;

  &>span {
    margin-left: 12px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 28px;
  }

  &:hover::before {
    background-color: var(--md-surface-hover);
  }

  &:active::before {
    background-color: var(--md-surface-active);
  }

  &.curr {
    background-color: var(--md-secondary-container);
    color: var(--md-on-secondary-container);
    font-weight: bold;

    &:hover::before {
      background-color: var(--md-secondary-container-hover);
    }

    &:active::before {
      background-color: var(--md-secondary-container-active);
    }
  }
`

type NavDrawerDesProp = {
  to: string,
  onClick?: () => void,
  icon: ReactNode,
  text: string
}

const NavDrawerDes = ({ to, onClick, icon, text }: NavDrawerDesProp) => {
  const loc = useLocation()
  return (
    <DesLink
      to={to}
      onClick={onClick}
      className={loc.pathname === to ? 'curr' : undefined}
    >
      {icon}
      <span>{text}</span>
    </DesLink>
  )
}

type NavDrawerProp = {
  closeBtn?: ReactNode,
  onDesSelected?: () => void
}

const NavDrawerHeader = styled.div`
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
`

export const NavDrawer = ({ closeBtn, onDesSelected }: NavDrawerProp) => {
  return (<>
    <NavDrawerHeader>
      <span>Coriander Music</span>
      {closeBtn}
    </NavDrawerHeader>

    <NavDrawerDes
      onClick={onDesSelected}
      to={ROUTE_PATH.index}
      icon={<LucideMusic />}
      text="音乐"
    />
    <NavDrawerDes
      onClick={onDesSelected}
      to={ROUTE_PATH.artist}
      icon={<LucideUsers />}
      text="艺术家"
    />
    <NavDrawerDes
      onClick={onDesSelected}
      to={ROUTE_PATH.album}
      icon={<LucideDiscAlbum />}
      text="专辑"
    />
  </>)
}
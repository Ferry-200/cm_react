import { styled } from "@linaria/react"
import { ReactNode } from "react"
import { NavDrawerDes } from "./nav-drawer-des"
import { ROUTE_PATH } from "../router"
import { LucideDiscAlbum, LucideMusic, LucideUsers } from "lucide-react"

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
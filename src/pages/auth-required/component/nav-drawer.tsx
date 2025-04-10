import { styled } from "@linaria/react"
import { Dialog } from "radix-ui"
import { StandardIconButton } from "../../../component/icon-button"
import { LucideDiscAlbum, LucideMusic, LucideSidebarClose, LucideUsers } from "lucide-react"
import { ROUTE_PATH } from "../../../router"
import { useCallback } from "react"
import { NavDrawerDes } from "../../../component/nav-drawer-des"

type NavDrawer = {
  open: boolean,
  onOpenChange: (open: boolean) => void
}

const NavDrawerOverlay = styled(Dialog.Overlay)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--md-scrim);
`

const NavDrawerContent = styled(Dialog.Content)`
  position: absolute;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background-color: var(--md-surface);
  border-radius: 0 16px 16px 0;
  padding: 0 12px;
`

const HiddenTitle = styled(Dialog.Title)`
  display: none;
`

const HiddenDescription = styled(Dialog.Description)`
  display: none;
`

const NavDrawerHeader = styled.div`
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
`

export const NavDrawer = ({ open, onOpenChange }: NavDrawer) => {
  const closeDrawer = useCallback(() => onOpenChange(false), [])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <NavDrawerOverlay />
        <NavDrawerContent>
          <HiddenTitle>Navigation drawer.</HiddenTitle>
          <HiddenDescription>Select a route.</HiddenDescription>

          <NavDrawerHeader>
            <span>Coriander Music</span>
            <Dialog.Close asChild>
              <StandardIconButton onClick={closeDrawer}>
                <LucideSidebarClose />
              </StandardIconButton>
            </Dialog.Close>
          </NavDrawerHeader>

          <NavDrawerDes
            onClick={closeDrawer}
            to={ROUTE_PATH.index}
            icon={<LucideMusic />}
            text="音乐"
          />
          <NavDrawerDes
            onClick={closeDrawer}
            to={ROUTE_PATH.artist}
            icon={<LucideUsers />}
            text="艺术家"
          />
          <NavDrawerDes
            onClick={closeDrawer}
            to={ROUTE_PATH.album}
            icon={<LucideDiscAlbum />}
            text="专辑"
          />
        </NavDrawerContent>
      </Dialog.Portal>
    </Dialog.Root >
  )
}
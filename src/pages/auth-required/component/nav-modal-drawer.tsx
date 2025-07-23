import { styled } from "@linaria/react"
import { Dialog } from "radix-ui"
import { StandardIconButton } from "../../../component/icon-button"
import { LucideSidebarClose } from "lucide-react"
import { useCallback } from "react"
import { NavDrawer } from "./nav-drawer"

type NavModalDrawerProp = {
  open: boolean,
  onOpenChange: (open: boolean) => void
}

const ModalOverlay = styled(Dialog.Overlay)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--md-scrim);
`

const ModalContent = styled(Dialog.Content)`
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background-color: var(--md-surface);
  border-radius: 0 16px 16px 0;
  padding: 0 12px;
  z-index: 9999;
`

const HiddenTitle = styled(Dialog.Title)`
  display: none;
`

const HiddenDescription = styled(Dialog.Description)`
  display: none;
`

export const NavModalDrawer = ({ open, onOpenChange }: NavModalDrawerProp) => {
  const closeDrawer = useCallback(
    () => onOpenChange(false),
    [onOpenChange]
  )

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <ModalOverlay />
        <ModalContent>
          <HiddenTitle>Navigation drawer.</HiddenTitle>
          <HiddenDescription>Select a route.</HiddenDescription>

          <NavDrawer
            closeBtn={
              <Dialog.Close asChild>
                <StandardIconButton onClick={closeDrawer}>
                  <LucideSidebarClose />
                </StandardIconButton>
              </Dialog.Close>
            }
            onDesSelected={closeDrawer}
          />
        </ModalContent>
      </Dialog.Portal>
    </Dialog.Root >
  )
}
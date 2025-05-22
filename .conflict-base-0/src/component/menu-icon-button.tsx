import { DropdownMenu } from "radix-ui"
import { ReactNode, useState } from "react"
import { StandardIconButton } from "./icon-button"
import { LucideMoreVertical } from "lucide-react"
import { styled } from "@linaria/react"

const MenuContent = styled(DropdownMenu.Content)`
  min-width: 112px;
  max-width: 280px;
  background-color: var(--md-surface-container);
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: var(--md-elevation-2)
`

type MDMenuProp = {
  children: ReactNode
}

export const MenuIconButton = ({ children }: MDMenuProp) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <StandardIconButton onClick={() => setOpen(!open)}>
          <LucideMoreVertical />
        </StandardIconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <MenuContent align="end">{children}</MenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
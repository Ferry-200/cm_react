import { styled } from "@linaria/react"
import { ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from "@radix-ui/react-scroll-area"
import { Stylable } from "../utils"
import { ReactNode } from "react"

const ScrollViewRoot = styled(ScrollArea)`
  width: 100%;
  flex-grow: 1;
  min-height: 0;
`

const ScrollViewMain = styled(ScrollAreaViewport)`
  width: 100%;
  height: 100%;
`

const ScrollViewScrollbar = styled(ScrollAreaScrollbar)`
  /* ensures no selection */
  user-select: none;
  /* disable browser handling of all panning and zooming gestures on touch devices */
  touch-action: none;
  width: 8px;
  padding: 8px 0;
`

const ScrollViewThumb = styled(ScrollAreaThumb)`
  background-color: var(--md-outline);
  width: 8px;
  border-radius: 4px;
`

type ScrollViewProp = Stylable & {
  children: ReactNode
}

export const ScrollView = ({ className, style, children }: ScrollViewProp) => {
  return (
    <ScrollViewRoot type='scroll' className={className} style={style}>
      <ScrollViewMain>{children}</ScrollViewMain>
      <ScrollViewScrollbar orientation="vertical"><ScrollViewThumb></ScrollViewThumb></ScrollViewScrollbar>
    </ScrollViewRoot>
  )
}
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { styled } from "@linaria/react"
import { Stylable } from "../utils"
import { ReactNode } from "react"
import { ScrollbarsVisibilityBehavior } from "overlayscrollbars";

const ScrollViewRoot = styled(OverlayScrollbarsComponent)`
  width: 100%;
  flex-grow: 1;
  min-height: 0;
`

type ScrollViewProp = Stylable & {
  children: ReactNode,
  visibility?: ScrollbarsVisibilityBehavior
}

export const ScrollView = ({ className, style, children, visibility }: ScrollViewProp) => {
  return (
    <ScrollViewRoot className={className} style={style}
      element="div"
      options={{
        scrollbars: {
          visibility: visibility,
          theme: 'md-scrollbar',
          autoHide: 'scroll',
          autoHideDelay: 500,
        },
      }}
      defer
    >
      {children}
    </ScrollViewRoot >
  )
}
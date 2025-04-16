import { CSSProperties } from "react"

export const BREAKPOINT = {
    medium: '600px',
    large: '840px',
    extraLarge: '1200px'
}

export type Stylable = {
    className?: string,
    style?: CSSProperties,
}
import { CSSProperties } from "react"
import { useState, useEffect } from "react"

export type Stylable = {
    className?: string,
    style?: CSSProperties,
}

export const BREAKPOINT = {
    medium: '600px',
    large: '840px',
    extraLarge: '1200px'
}

const MEDIA_MATCHER = {
    medium: `(min-width: ${BREAKPOINT.medium})`,
    large: `(min-width: ${BREAKPOINT.large})`,
    extraLarge: `(min-width: ${BREAKPOINT.extraLarge})`
} as const

type MEDIA_MATCHER = (typeof MEDIA_MATCHER)[keyof typeof MEDIA_MATCHER]

function useIsScreenType(matcher: MEDIA_MATCHER) {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const mediaQueryList = window.matchMedia(matcher)

        const handleChange = (e: MediaQueryListEvent) => {
            setMatches(e.matches)
        }

        mediaQueryList.addEventListener("change", handleChange)
        setMatches(mediaQueryList.matches)

        return () => {
            mediaQueryList.removeEventListener("change", handleChange)
        }
    }, [matcher])

    return matches
}

export const useIsMediumScreen = () => useIsScreenType(MEDIA_MATCHER.medium)

export const useIsLargeScreen = () => useIsScreenType(MEDIA_MATCHER.large)

export const useIsExtraLargeScreen = () => useIsScreenType(MEDIA_MATCHER.extraLarge)
import { CSSProperties } from "react"
import { useState, useEffect } from "react"

export const BREAKPOINT = {
    medium: '600px',
    large: '840px',
    extraLarge: '1200px'
}

const MEDIUM_MEDIA_MATCHER = `(min-width: ${BREAKPOINT.medium})`

export type Stylable = {
    className?: string,
    style?: CSSProperties,
}

export const useIsMediumScreen = () => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const mediaQueryList = window.matchMedia(MEDIUM_MEDIA_MATCHER)

        const handleChange = (e: MediaQueryListEvent) => {
            setMatches(e.matches)
        }

        mediaQueryList.addEventListener("change", handleChange)
        setMatches(mediaQueryList.matches)

        return () => {
            mediaQueryList.removeEventListener("change", handleChange)
        }
    }, [])

    return matches
}

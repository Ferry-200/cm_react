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

export class ChangeNotifier {
    private listeners: Set<VoidFunction> = new Set()

    constructor() { }

    addListener(listener: VoidFunction) {
        this.listeners.add(listener)
    }

    removeListener(listener: VoidFunction) {
        this.listeners.delete(listener)
    }

    notify() {
        for (const listener of this.listeners) {
            try {
                listener()
            } catch (err) {
                console.error(err)
            }
        }
    }
}

export function shuffleArray<T>(array: Array<T>) {
    for (let i = array.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}
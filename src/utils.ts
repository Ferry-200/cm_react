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

export function useIsScreenType(matcher: MEDIA_MATCHER): boolean
export function useIsScreenType(matcher: string) {
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
    return Array.from(array)
}

/**
 * position: relative;
 * cursor: pointer;
 * &::before { ... }
 * &:hover::before {
 * &:active::before {
 * 
 * 生成对应颜色的 clickable state layer，
 * 应用的样式必须已经声明 border-radius
 * 
 * @param hover css var
 * @param active css var
 */
export const makeClickable = (hover: string, active: string) => `
    position: relative;
    cursor: pointer;    
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      pointer-events: none;
      transition: background-color 150ms;
    }
    
    &:hover::before {
      background-color: var(${hover});
    }
    
    &:active::before {
      background-color: var(${active});
    }
`
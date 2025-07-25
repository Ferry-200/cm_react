import { SVGProps } from "react"

export const RepeatOff = ({ ...prop }: SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-repeat-icon lucide-repeat"
            {...prop}
        >
            <path d="m17 2 4 4-4 4" />
            <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
            <path d="m7 22-4-4 4-4" />
            <path d="m2 2 20 20" />
            <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </svg>
    )
}
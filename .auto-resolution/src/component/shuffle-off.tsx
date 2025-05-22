import { SVGProps } from "react"

export const ShuffleOff = ({ ...prop }: SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-left-icon lucide-arrow-right-left"
            {...prop}
        >
            <path d="m16 3 4 4-4 4" />
            <path d="M20 7H4" />
            <path d="m16 13 4 4-4 4" />
            <path d="M20 17H4" />
        </svg>

    )
}
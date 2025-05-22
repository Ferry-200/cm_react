import { createContext } from "react";

export type LyricViewAlign = 'start' | 'center' | 'end'

export const LyricViewAlignContext =
    createContext<LyricViewAlign>('start')
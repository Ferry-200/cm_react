import { createContext, useContext } from "react";
import { Player } from ".";

export const PlayerContext = createContext<Player | undefined>(undefined)

export function usePlayer() {
    return useContext(PlayerContext)!
}
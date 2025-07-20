import { ReactNode, useContext, useMemo } from "react";
import { createPlayer } from ".";
import { JellyfinApiContext } from "../jellyfin/context";
import { PlayerContext } from "./context";

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const jellyfinApi = useContext(JellyfinApiContext)!
    const player = useMemo(() => createPlayer(jellyfinApi), [jellyfinApi])

    return (
        <PlayerContext.Provider value={player}>
            {children}
        </PlayerContext.Provider>
    )
}
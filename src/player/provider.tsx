import { ReactNode, useMemo } from "react";
import { createPlayer } from ".";
import { PlayerContext } from "./context";
import { useJellyfinApi } from "../jellyfin/context";

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const jellyfinApi = useJellyfinApi()
    const player = useMemo(() => createPlayer(jellyfinApi), [jellyfinApi])

    return (
        <PlayerContext.Provider value={player}>
            {children}
        </PlayerContext.Provider>
    )
}
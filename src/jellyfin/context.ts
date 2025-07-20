import { Api } from "@jellyfin/sdk";
import { createContext, useContext } from "react";

export const JellyfinApiContext = createContext<Api | undefined>(undefined)

export function useJellyfinApi() {
    return useContext(JellyfinApiContext)!
}
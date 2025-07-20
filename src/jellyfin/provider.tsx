import { ReactNode } from "react";
import { JellyfinApiContext } from "./context";
import { createJellyfinApi } from ".";

export const JellyfinApiProvider = ({ children }: { children: ReactNode }) => (
    <JellyfinApiContext.Provider value={createJellyfinApi()}>
        {children}
    </JellyfinApiContext.Provider>
)
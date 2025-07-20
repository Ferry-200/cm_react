import { Api } from "@jellyfin/sdk";
import { createContext } from "react";

export const JellyfinApiContext = createContext<Api | undefined>(undefined)
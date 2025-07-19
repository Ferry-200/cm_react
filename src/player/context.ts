import { createContext } from "react";
import { Player } from ".";

export const PlayerContext = createContext<Player | undefined>(undefined)
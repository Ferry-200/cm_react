import { createContext, useContext } from "react";

type GlobalMessager = {
    showMessage: (text: string) => void
}

export const GlobalMessagerContext = createContext<GlobalMessager | null>(null);
export const useGlobalMessager = (): GlobalMessager => {
    return useContext(GlobalMessagerContext)!
};
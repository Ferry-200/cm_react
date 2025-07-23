import { createContext, useContext } from "react";
import { ChangeNotifier } from "../utils";

type GlobalMessager = {
    showMessage: (text: string) => void
}

export const GlobalMessagerContext = createContext<GlobalMessager | null>(null);
export const useGlobalMessager = (): GlobalMessager => {
    return useContext(GlobalMessagerContext)!
};

/** 建议仅在不能通过组件 useGlobalMessager 时调用 */
export const GlobalMessagerNotifier = new ChangeNotifier<(text: string) => void>()

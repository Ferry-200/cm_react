import { SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import { useReducer } from "react";
import useSWR from "swr";
import { getAlbums } from "../../../jellyfin/browsing";

type UseAlbumsState = {
    offset: number, size: number,
    sortOrder: SortOrder
}

type UseAlbumsAction = { type: 'setOffset'; offset: number }
    | { type: 'setSize'; size: number }
    | { type: 'setSortOrder'; sortOrder: SortOrder }

function useAlbumsReducer(state: UseAlbumsState, action: UseAlbumsAction): UseAlbumsState {
    switch (action.type) {
        case "setOffset": {
            return {
                ...state,
                offset: action.offset
            }
        }
        case "setSize": {
            return {
                ...state,
                size: action.size
            }
        }
        case "setSortOrder": {
            return {
                ...state,
                sortOrder: action.sortOrder
            }
        }
    }
}

const useAlbumsInitialState = {
    offset: 0, size: 50,
    sortOrder: SortOrder.Ascending
}

export function useAlbums(initialState = useAlbumsInitialState) {
    const [state, dispatch] = useReducer<UseAlbumsState, [UseAlbumsAction]>(
        useAlbumsReducer,
        initialState
    )

    const { data, isLoading } = useSWR(
        { identity: getAlbums.name, ...state },
        ({ offset, size, sortOrder }) => getAlbums(offset, size, sortOrder)
    )

    return [state, { data, isLoading }, dispatch] as const
}
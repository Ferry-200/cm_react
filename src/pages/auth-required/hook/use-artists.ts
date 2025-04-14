import { SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import { useReducer } from "react";
import useSWR from "swr";
import { getArtists } from "../../../jellyfin/browsing";

type UseArtistsState = {
    offset: number, size: number,
    sortOrder: SortOrder
}

type UseArtistsAction = { type: 'setOffset'; offset: number }
    | { type: 'setSize'; size: number }
    | { type: 'setSortOrder'; sortOrder: SortOrder }

function useArtistsReducer(state: UseArtistsState, action: UseArtistsAction): UseArtistsState {
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

const useArtistsInitialState = {
    offset: 0, size: 50,
    sortOrder: SortOrder.Ascending
}

export function useArtists(initialState = useArtistsInitialState) {
    const [state, dispatch] = useReducer<UseArtistsState, [UseArtistsAction]>(
        useArtistsReducer,
        initialState
    )

    const { data, isLoading } = useSWR(
        { identity: 'getArtists', ...state },
        ({ offset, size, sortOrder }) => getArtists(offset, size, sortOrder)
    )

    return [state, { data, isLoading }, dispatch] as const
}
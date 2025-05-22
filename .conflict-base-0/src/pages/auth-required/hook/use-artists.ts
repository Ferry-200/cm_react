import { BaseItemDtoQueryResult, SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import { useReducer } from "react";
import useSWR from "swr";

export type UseArtistsState = {
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

export type UseArtistsFetcher = (
    offset: number, size: number,
    sortOrder: SortOrder
) => Promise<BaseItemDtoQueryResult>

export function useArtists(fetcher: UseArtistsFetcher, initialState: UseArtistsState) {
    const [state, dispatch] = useReducer<UseArtistsState, [UseArtistsAction]>(
        useArtistsReducer,
        initialState
    )

    const { data, isLoading } = useSWR(
        { identity: fetcher, ...state },
        ({ offset, size, sortOrder }) => fetcher(offset, size, sortOrder)
    )

    return [state, { data, isLoading }, dispatch] as const
}
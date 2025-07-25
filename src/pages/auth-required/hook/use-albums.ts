import { BaseItemDtoQueryResult, SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import { useReducer } from "react";
import useSWR from "swr";

export type UseAlbumsState = {
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

export type UseAlbumsFetcher = (
    offset: number, size: number,
    sortOrder: SortOrder
) => Promise<BaseItemDtoQueryResult>

export function useAlbums(fetcher: UseAlbumsFetcher, initialState: UseAlbumsState) {
    const [state, dispatch] = useReducer<UseAlbumsState, [UseAlbumsAction]>(
        useAlbumsReducer,
        initialState
    )

    const { data, isLoading } = useSWR(
        { identity: fetcher, ...state },
        ({ offset, size, sortOrder }) => fetcher(offset, size, sortOrder)
    )

    return [state, { data, isLoading }, dispatch] as const
}
import { SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import { AudioSortBy, getAudios } from "../../../jellyfin/browsing";
import { useReducer } from "react";
import useSWR from "swr";

type UseAudiosState = {
    offset: number, size: number,
    sortBy: AudioSortBy, sortOrder: SortOrder
}

type UseAudiosAction = { type: 'setOffset'; offset: number }
    | { type: 'setSize'; size: number }
    | { type: 'setSortBy'; sortBy: AudioSortBy }
    | { type: 'setSortOrder'; sortOrder: SortOrder }

function useAudiosReducer(state: UseAudiosState, action: UseAudiosAction): UseAudiosState {
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
        case "setSortBy": {
            return {
                ...state,
                sortBy: action.sortBy
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

const useAudiosInitialState = {
    offset: 0, size: 50,
    sortBy: AudioSortBy.Artist, sortOrder: SortOrder.Ascending
}

export function useAudios(initialState = useAudiosInitialState) {
    const [state, dispatch] = useReducer<UseAudiosState, [UseAudiosAction]>(
        useAudiosReducer,
        initialState
    )

    const { data, isLoading } = useSWR(
        { identity: getAudios.name, ...state },
        ({ offset, size, sortBy, sortOrder }) => getAudios(offset, size, sortBy, sortOrder)
    )

    return [state, { data, isLoading }, dispatch] as const
}
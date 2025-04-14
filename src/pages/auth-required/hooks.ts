import { SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import { useReducer } from "react";
import { AudioSortBy, getAlbums, getArtists, getAudios } from "../../jellyfin/browsing";
import useSWR from "swr";

/** useAudios hook */

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
        { identity: 'getAudios', ...state },
        ({ offset, size, sortBy, sortOrder }) => getAudios(offset, size, sortBy, sortOrder)
    )

    return [state, { data, isLoading }, dispatch] as const
}

/** useArtists hook */

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

/** useAlbums hook */

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
        { identity: 'getArtists', ...state },
        ({ offset, size, sortOrder }) => getAlbums(offset, size, sortOrder)
    )

    return [state, { data, isLoading }, dispatch] as const
}
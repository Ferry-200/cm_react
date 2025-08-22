import { BaseItemDtoQueryResult, SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import { AudioSortBy } from "../../../jellyfin/browsing";
import useSWR from "swr";
import { useUrlState } from "./use-url-state";

export type UseAudiosState = {
    offset: number, size: number,
    sortBy: AudioSortBy, sortOrder: SortOrder
}

export type UseAudiosFetcher = (
    offset: number, size: number,
    sortBy: AudioSortBy, sortOrder: SortOrder
) => Promise<BaseItemDtoQueryResult>

export function useAudios(fetcher: UseAudiosFetcher, initialState: UseAudiosState, namespace?: string) {
    const [state, dispatch] = useUrlState(initialState, namespace);

    const { data, isLoading } = useSWR(
        { identity: fetcher, ...state },
        ({ offset, size, sortBy, sortOrder }) => fetcher(offset, size, sortBy, sortOrder)
    )

    return [state, { data, isLoading }, dispatch] as const
}
import { BaseItemDtoQueryResult, SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import useSWR from "swr";
import { useUrlState } from "./use-url-state";

export type UseAlbumsState = {
    offset: number, size: number,
    sortOrder: SortOrder
}

export type UseAlbumsFetcher = (
    offset: number, size: number,
    sortOrder: SortOrder
) => Promise<BaseItemDtoQueryResult>

export function useAlbums(fetcher: UseAlbumsFetcher, initialState: UseAlbumsState, namespace?: string) {
    const [state, dispatch] = useUrlState(initialState, namespace);

    const { data, isLoading } = useSWR(
        { identity: fetcher, ...state },
        ({ offset, size, sortOrder }) => fetcher(offset, size, sortOrder)
    )

    return [state, { data, isLoading }, dispatch] as const
}
import { BaseItemDtoQueryResult, SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import useSWR from "swr";
import { useUrlState } from "./use-url-state";

export type UseAlbumsState = {
    offset: number, size: number,
    sortOrder: SortOrder
}

type UseAlbumsAction = { type: 'setOffset'; offset: number }
    | { type: 'setSize'; size: number }
    | { type: 'setSortOrder'; sortOrder: SortOrder }

export type UseAlbumsFetcher = (
    offset: number, size: number,
    sortOrder: SortOrder
) => Promise<BaseItemDtoQueryResult>

export function useAlbums(fetcher: UseAlbumsFetcher, initialState: UseAlbumsState, namespace?: string) {
    const [state, dispatchUrl] = useUrlState(initialState, namespace);

    const { data, isLoading } = useSWR(
        { identity: fetcher, ...state },
        ({ offset, size, sortOrder }) => fetcher(offset, size, sortOrder)
    )

    const dispatch = (action: UseAlbumsAction) => {
        switch (action.type) {
            case 'setOffset':
                dispatchUrl({ key: 'offset', value: action.offset });
                break;
            case 'setSize':
                dispatchUrl({ key: 'size', value: action.size });
                break;
            case 'setSortOrder':
                dispatchUrl({ key: 'sortOrder', value: action.sortOrder });
                break;
        }
    };

    return [state, { data, isLoading }, dispatch] as const
}
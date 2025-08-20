import { BaseItemDtoQueryResult, SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import useSWR from "swr";
import { useUrlState } from "./use-url-state";

export type UseArtistsState = {
    offset: number, size: number,
    sortOrder: SortOrder
}

type UseArtistsAction = { type: 'setOffset'; offset: number }
    | { type: 'setSize'; size: number }
    | { type: 'setSortOrder'; sortOrder: SortOrder }

export type UseArtistsFetcher = (
    offset: number, size: number,
    sortOrder: SortOrder
) => Promise<BaseItemDtoQueryResult>

export function useArtists(fetcher: UseArtistsFetcher, initialState: UseArtistsState, namespace?: string) {
    const [state, dispatchUrl] = useUrlState(initialState, namespace);

    const { data, isLoading } = useSWR(
        { identity: fetcher, ...state },
        ({ offset, size, sortOrder }) => fetcher(offset, size, sortOrder)
    )

    const dispatch = (action: UseArtistsAction) => {
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
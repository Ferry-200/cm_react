import { BaseItemDtoQueryResult, SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import { AudioSortBy } from "../../../jellyfin/browsing";
import useSWR from "swr";
import { useUrlState } from "./use-url-state";

export type UseAudiosState = {
    offset: number, size: number,
    sortBy: AudioSortBy, sortOrder: SortOrder
}

type UseAudiosAction = { type: 'setOffset'; offset: number }
    | { type: 'setSize'; size: number }
    | { type: 'setSortBy'; sortBy: AudioSortBy }
    | { type: 'setSortOrder'; sortOrder: SortOrder }

export type UseAudiosFetcher = (
    offset: number, size: number,
    sortBy: AudioSortBy, sortOrder: SortOrder
) => Promise<BaseItemDtoQueryResult>

export function useAudios(fetcher: UseAudiosFetcher, initialState: UseAudiosState, namespace?: string) {
    const [state, dispatchUrl] = useUrlState(initialState, namespace);

    const { data, isLoading } = useSWR(
        { identity: fetcher, ...state },
        ({ offset, size, sortBy, sortOrder }) => fetcher(offset, size, sortBy, sortOrder)
    )

    const dispatch = (action: UseAudiosAction) => {
        switch (action.type) {
            case 'setOffset':
                dispatchUrl({ key: 'offset', value: action.offset });
                break;
            case 'setSize':
                dispatchUrl({ key: 'size', value: action.size });
                break;
            case 'setSortBy':
                dispatchUrl({ key: 'sortBy', value: action.sortBy });
                break;
            case 'setSortOrder':
                dispatchUrl({ key: 'sortOrder', value: action.sortOrder });
                break;
        }
    };

    return [state, { data, isLoading }, dispatch] as const
}
import useSWR from "swr";
import { getItemInfo } from "../../../jellyfin/browsing";
import { Api } from "@jellyfin/sdk";

export function useItemInfo(jellyfinApi: Api, itemId: string) {
    const { data, isLoading } = useSWR(
        { identity: getItemInfo, itemId: itemId },
        ({ itemId }) => getItemInfo(jellyfinApi, itemId)
    )

    return { data, isLoading }
}
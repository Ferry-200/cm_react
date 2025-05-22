import useSWR from "swr";
import { getItemInfo } from "../../../jellyfin/browsing";

export function useItemInfo(itemId: string) {
    const { data, isLoading } = useSWR(
        { identity: getItemInfo, itemId: itemId },
        ({ itemId }) => getItemInfo(itemId)
    )

    return { data, isLoading }
}
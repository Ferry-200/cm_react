import useSWR from "swr";
import { getItemInfo } from "../../../jellyfin/browsing";

export function useItemInfo(itemId: string) {
    const { data, isLoading } = useSWR(itemId, getItemInfo)

    return { data, isLoading }
}
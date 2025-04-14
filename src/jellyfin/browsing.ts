import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api"
import { jellyfinApi } from "."
import { BaseItemKind, ItemSortBy, SortOrder } from "@jellyfin/sdk/lib/generated-client/models"

export const AudioSortBy = {
    [ItemSortBy.Name]: ItemSortBy.Name,
    [ItemSortBy.Artist]: ItemSortBy.Artist,
    [ItemSortBy.Album]: ItemSortBy.Album,
    [ItemSortBy.DateCreated]: ItemSortBy.DateCreated,
} as const

export const AudioSortByValues = Object.keys(AudioSortBy) as AudioSortBy[]

export type AudioSortBy = typeof AudioSortBy[keyof typeof AudioSortBy]

export function getAudioSortByDisplay(sortBy: AudioSortBy) {
    switch (sortBy) {
        case "Name": return '标题'
        case "Artist": return '艺术家'
        case "Album": return '专辑'
        case "DateCreated": return '创建时间'
    }
}

export async function getAudios(
    offset: number, size: number,
    sortBy: AudioSortBy, sortOrder: SortOrder
) {
    const val = await getItemsApi(jellyfinApi).getItems({
        includeItemTypes: [BaseItemKind.Audio],
        recursive: true,
        sortBy: [sortBy],
        sortOrder: [sortOrder],
        startIndex: offset,
        limit: size
    })
    return val.data
}

export async function getArtists(
    offset: number, size: number, sortOrder: SortOrder
) {
    const val = await getItemsApi(jellyfinApi).getItems({
        includeItemTypes: [BaseItemKind.MusicArtist],
        recursive: true,
        sortBy: [ItemSortBy.Name],
        sortOrder: [sortOrder],
        startIndex: offset,
        limit: size
    })
    return val.data
}

export async function getAlbums(
    offset: number, size: number, sortOrder: SortOrder
) {
    const val = await getItemsApi(jellyfinApi).getItems({
        includeItemTypes: [BaseItemKind.MusicAlbum],
        recursive: true,
        sortBy: [ItemSortBy.Name],
        sortOrder: [sortOrder],
        startIndex: offset,
        limit: size
    })
    return val.data
}
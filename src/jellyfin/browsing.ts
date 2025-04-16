import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api"
import { getArtistsApi } from "@jellyfin/sdk/lib/utils/api/artists-api"
import { getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api/user-library-api"
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

export async function getAudiosOfArtist(
    offset: number, size: number,
    sortBy: AudioSortBy, sortOrder: SortOrder,
    artistId: string
) {
    const val = await getItemsApi(jellyfinApi).getItems({
        artistIds: [artistId],
        includeItemTypes: [BaseItemKind.Audio],
        recursive: true,
        sortBy: [sortBy],
        sortOrder: [sortOrder],
        startIndex: offset,
        limit: size
    })
    return val.data
}

export async function getAudiosOfAlbum(
    offset: number, size: number,
    sortBy: AudioSortBy, sortOrder: SortOrder,
    albumId: string
) {
    const val = await getItemsApi(jellyfinApi).getItems({
        albumIds: [albumId],
        includeItemTypes: [BaseItemKind.Audio],
        recursive: true,
        sortBy: [sortBy],
        sortOrder: [sortOrder],
        startIndex: offset,
        limit: size
    })
    return val.data
}

export async function getLibraryAudios(
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

export async function getArtistsOf(
    offset: number, size: number,
    sortOrder: SortOrder,
    parentId?: string
) {
    const val = await getArtistsApi(jellyfinApi).getArtists({
        parentId: parentId,
        sortBy: [ItemSortBy.Name],
        sortOrder: [sortOrder],
        startIndex: offset,
        limit: size
    })
    return val.data
}

export function getLibraryArtists(
    offset: number, size: number, sortOrder: SortOrder
) {
    return getArtistsOf(offset, size, sortOrder)
}

export async function getAlbumsOfArtist(
    offset: number, size: number,
    sortOrder: SortOrder,
    artistId: string
) {
    const val = await getItemsApi(jellyfinApi).getItems({
        artistIds: [artistId],
        includeItemTypes: [BaseItemKind.MusicAlbum],
        recursive: true,
        sortBy: [ItemSortBy.Name],
        sortOrder: [sortOrder],
        startIndex: offset,
        limit: size
    })
    return val.data
}

export async function getLibraryAlbums(
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

export async function getItemInfo(itemId: string) {
    const val = await getUserLibraryApi(jellyfinApi).getItem({
        itemId: itemId
    })
    return val.data
}
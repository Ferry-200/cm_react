import { jellyfinApi } from ".";

/**
 * @param resolve default: true; resolve the img size, size * devicePixelRatio
 * @returns 
 */
export function getImageStreamUrl(id: string, size: number, resolve?: boolean) {
    if (id.length === 0) return ''

    const querySize = (resolve ?? true)
        ? Math.floor(size * window.devicePixelRatio)
        : size
    const uri = jellyfinApi.axiosInstance.getUri({
        url: `/Items/${id}/Images/Primary`,
        params: {
            "fillWidth": querySize,
            "fillHeight": querySize,
            "quality": 90
        }
    });
    return jellyfinApi.basePath + uri;
}

export function getAudioStreamUrl(id: string) {
    if (id.length === 0) return ''

    const uri = jellyfinApi.axiosInstance.getUri({
        url: `/Audio/${id}/stream`,
        params: {
            "static": true
        }
    });
    return jellyfinApi.basePath + uri;
}
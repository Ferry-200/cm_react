import { jellyfinApi } from ".";

export function getImageStreamUrl(id: string, size: number) {
    if (id.length === 0) return ''

    const resolvedSize = Math.floor(size * window.devicePixelRatio)
    const uri = jellyfinApi.axiosInstance.getUri({
        url: `/Items/${id}/Images/Primary`,
        params: {
            "fillWidth": resolvedSize,
            "fillHeight": resolvedSize,
            "quality": 90
        }
    });
    return jellyfinApi.basePath + uri;
}

export function getAudioStreamUrl(id: string) {
    const uri = jellyfinApi.axiosInstance.getUri({
        url: `/Audio/${id}/stream`,
        params: {
            "static": true
        }
    });
    return jellyfinApi.basePath + uri;
}
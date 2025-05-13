import { Jellyfin } from "@jellyfin/sdk";
import { ROUTE_PATH, ROUTER } from "../router";

const jellyfin = new Jellyfin({
    clientInfo: {
        name: 'Coriander Music',
        version: '1.0.0'
    },
    deviceInfo: {
        name: navigator.userAgent,
        id: navigator.userAgent
    }
})

export const jellyfinApi = jellyfin
    .createApi("http://localhost:8096/", localStorage.getItem('token') || '')

jellyfinApi
    .axiosInstance
    .interceptors
    .response
    .use((response) => response, (error: { status: number }) => {
        if (error.status === 401 && window.location.pathname !== ROUTE_PATH.login) {
            console.warn('unauthorized, nav to login')
            void ROUTER.navigate('/login', { replace: true })
        } else {
            console.error(error)
        }
    })

export function authenticate(username: string, password: string) {
    return jellyfinApi
        .authenticateUserByName(username, password)
        .then<boolean, boolean>(
            (value) => {
                localStorage.setItem('token', value.data.AccessToken || '')
                return true
            },
            () => {
                return false
            }
        )
}
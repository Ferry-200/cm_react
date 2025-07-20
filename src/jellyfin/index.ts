import { Api, Jellyfin } from "@jellyfin/sdk";
import { ROUTE_PATH } from "../router";
import { BASE_URL } from "./BASE_URL";
import { UAParser } from "ua-parser-js";

export function createJellyfinApi() {
    const uaParser = new UAParser()
    const browser = uaParser.getBrowser()
    const os = uaParser.getOS()
    const device = uaParser.getDevice()
    const deviceName = [browser.name, os.name, device.vendor, device.model]
        .filter((str) => str !== undefined)
        .join(' ')

    const jellyfin = new Jellyfin({
        clientInfo: {
            name: 'Coriander Music',
            version: '1.0.0'
        },
        deviceInfo: {
            name: deviceName,
            id: uaParser.getUA()
        }
    })

    const jellyfinApi = jellyfin
        .createApi(BASE_URL, localStorage.getItem('token') || '')

    jellyfinApi
        .axiosInstance
        .interceptors
        .response
        .use((response) => response, (error: { status: number }) => {
            if (error.status === 401 && window.location.pathname !== ROUTE_PATH.login) {
                console.warn('unauthorized, nav to login')
                window.location.replace('/login')
            } else {
                console.error(error)
            }
        })

    return jellyfinApi
}

export function authenticate(jellyfinApi: Api, username: string, password: string) {
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
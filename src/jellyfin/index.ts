import { Api, Jellyfin } from "@jellyfin/sdk";
import { ROUTE_PATH } from "../router";
import { BASE_URL } from "./BASE_URL";
import { GlobalMessagerNotifier } from "../component/global-messager-context";

async function getDeviceName() {
    const { UAParser } = await import("ua-parser-js")
    const uaParser = new UAParser()
    const browser = uaParser.getBrowser()
    const os = uaParser.getOS()
    const device = uaParser.getDevice()
    return [browser.name, os.name, device.vendor, device.model]
        .filter((str) => str !== undefined)
        .join(' ')
}

export async function createJellyfinApi() {
    const deviceName = await getDeviceName()

    const jellyfin = new Jellyfin({
        clientInfo: {
            name: 'Coriander Music',
            version: '1.0.0'
        },
        deviceInfo: {
            name: deviceName,
            id: navigator.userAgent
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
                GlobalMessagerNotifier.notify("登录状态失效，请重新登录")
                window.location.replace('/login')
            } else {
                console.error(error)
            }
        })

    return jellyfinApi
}

export async function authenticate(jellyfinApi: Api, username: string, password: string) {
    const authResult = await jellyfinApi
        .authenticateUserByName(username, password)

    if (authResult.data && authResult.data.AccessToken) {
        localStorage.setItem('token', authResult.data.AccessToken)
        return true
    }

    return false
}
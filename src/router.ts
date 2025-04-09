import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/login-page";
import { AuthGuard } from "./pages/auth-guard";

export const ROUTE_PATH = {
    login: '/login',
    index: '/',
    artist: '/artist',
    artistDetail: '/artist/detail',
    album: '/album',
    albumDetail: '/album/detail'
}

export const ROUTER = createBrowserRouter([
    {
        path: ROUTE_PATH.login,
        Component: LoginPage
    },
    {
        Component: AuthGuard,
        children: [
            {
                index: true,
                // Component: 
            },
            {
                path: ROUTE_PATH.artist,
                // Component: 
            },
            {
                path: ROUTE_PATH.artistDetail,
                // Component: 
            },
            {
                path: ROUTE_PATH.album,
                // Component: 
            },
            {
                path: ROUTE_PATH.albumDetail,
                // Component: 
            }
        ]
    }
])
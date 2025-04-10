import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/login-page";
import { AuthGuard } from "./pages/auth-guard";
import { MusicPage } from "./pages/auth-required/music-page";
import { ArtistPage } from "./pages/auth-required/artist-page";
import { ArtistDetailPage } from "./pages/auth-required/artist-detail-page";
import { AlbumPage } from "./pages/auth-required/album-page";
import { AlbumDetailPage } from "./pages/auth-required/album-detail-page";

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
                Component: MusicPage
            },
            {
                path: ROUTE_PATH.artist,
                Component: ArtistPage
            },
            {
                path: ROUTE_PATH.artistDetail,
                Component: ArtistDetailPage
            },
            {
                path: ROUTE_PATH.album,
                Component: AlbumPage
            },
            {
                path: ROUTE_PATH.albumDetail,
                Component: AlbumDetailPage
            }
        ]
    }
])
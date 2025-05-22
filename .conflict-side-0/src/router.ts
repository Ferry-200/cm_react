import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/login-page";
import { AuthGuard } from "./pages/auth-guard";
import { MusicPage } from "./pages/auth-required/music-page";
import { ArtistPage } from "./pages/auth-required/artist-page";
import { ArtistDetailPage } from "./pages/auth-required/artist-detail-page";
import { AlbumPage } from "./pages/auth-required/album-page";
import { AlbumDetailPage } from "./pages/auth-required/album-detail-page";
import { Scaffold } from "./pages/auth-required/component/scaffold";
import { NowPlayingPage } from "./pages/auth-required/now-playing-page/page";

export const ITEM_ID_DYN_SEG = '/:item_id'

export const ROUTE_PATH = {
    login: '/login',
    index: '/',
    artist: '/artist',
    artistDetail: '/artist' + ITEM_ID_DYN_SEG,
    album: '/album',
    albumDetail: '/album' + ITEM_ID_DYN_SEG,
    nowPlaying: '/now-playing'
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
                Component: Scaffold,
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
            },
            {
                path: ROUTE_PATH.nowPlaying,
                Component: NowPlayingPage
            }
        ]
    }
])
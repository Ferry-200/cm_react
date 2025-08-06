import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { ROUTE_PATH } from "../router";
import { useJellyfinApi } from "../jellyfin/context";

export const AuthGuard = () => {
  const navTo = useNavigate()
  const location = useLocation()
  const jellyfinApi = useJellyfinApi()
  useEffect(() => {
    if (jellyfinApi.accessToken.length === 0) {
      if (location.pathname !== ROUTE_PATH.login) {
        void navTo(ROUTE_PATH.login, { replace: true })
      }
    }
  }, [jellyfinApi.accessToken.length, location, navTo])

  return <Outlet />
}
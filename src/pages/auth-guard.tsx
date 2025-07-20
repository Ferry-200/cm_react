import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { ROUTE_PATH } from "../router";
import { JellyfinApiContext } from "../jellyfin/context";

export const AuthGuard = () => {
  const navTo = useNavigate()
  const location = useLocation()
  const jellyfinApi = useContext(JellyfinApiContext)!
  useEffect(() => {
    if (jellyfinApi.accessToken.length === 0) {
      if (location.pathname !== ROUTE_PATH.login) {
        void navTo(ROUTE_PATH.login, { replace: true })
      }
    }
  }, [jellyfinApi.accessToken.length, location, navTo])

  return <Outlet />
}
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { ROUTE_PATH } from "../router";
import { useJellyfinApi } from "../jellyfin/context";
import { useGlobalMessager } from "../component/global-messager-context";

export const AuthGuard = () => {
  const navTo = useNavigate()
  const location = useLocation()
  const jellyfinApi = useJellyfinApi()
  const messager = useGlobalMessager()
  useEffect(() => {
    if (jellyfinApi.accessToken.length === 0) {
      if (location.pathname !== ROUTE_PATH.login) {
        messager.showMessage("登录状态失效，请重新登录")
        void navTo(ROUTE_PATH.login, { replace: true })
      }
    }
  }, [jellyfinApi.accessToken.length, location, messager, navTo])

  return <Outlet />
}
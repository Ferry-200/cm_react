import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { jellyfinApi } from "../jellyfin";
import { ROUTE_PATH } from "../router";
import { Scaffold } from "./auth-required/scaffold";

export const AuthGuard = () => {
  const navTo = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (jellyfinApi.accessToken.length === 0) {
      if (location.pathname !== ROUTE_PATH.login) {
        navTo(ROUTE_PATH.login, { replace: true })
      }
    }
  }, [location])

  return (
    <Scaffold>
      <Outlet />
    </Scaffold>
  )
}
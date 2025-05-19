import { Outlet } from "react-router";

export const AuthGuard = () => {
  // const navTo = useNavigate()
  // const location = useLocation()
  // useEffect(() => {
  //   if (jellyfinApi.accessToken.length === 0) {
  //     if (location.pathname !== ROUTE_PATH.login) {
  //       void navTo(ROUTE_PATH.login, { replace: true })
  //     }
  //   }
  // }, [location, navTo])

  return <Outlet />
}
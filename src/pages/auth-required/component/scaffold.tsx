import { styled } from "@linaria/react"
import { ReactNode, useCallback, useState } from "react"
import { StandardIconButton } from "../../../component/icon-button"
import { LucideSearch, LucideSidebar } from "lucide-react"
import { useLocation } from "react-router"
import { ROUTE_PATH } from "../../../router"
import { NavModalDrawer } from "./nav-modal-drawer"

type ScaffoldProp = {
  children: ReactNode
}

const ScaffoldWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.header`
  flex-shrink: 0;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;

  &>span {
    font-size: 22px;
  }
`

function getRouteName(route: string) {
  if (route === ROUTE_PATH.index) {
    return '音乐'
  } else if (route === ROUTE_PATH.artist) {
    return '艺术家'
  } else if (route === ROUTE_PATH.album) {
    return '专辑'
  } else if (route.includes('detail')) {
    return '详情'
  }

  return 'Coriander Music'
}

const NavDrawerButton = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openDrawer = useCallback(() => {
    setDrawerOpen(true)
  }, [])

  return (<>
    <StandardIconButton onClick={openDrawer}>
      <LucideSidebar />
    </StandardIconButton>
    <NavModalDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
  </>)
}

const SearchButton = () => {
  return (
    <StandardIconButton onClick={() => { }}>
      <LucideSearch />
    </StandardIconButton>
  )
}

const PageWrapper = styled.div`
  width: 100%;
  flex-grow: 1;
  overflow: hidden;
  padding: 0 8px;
`

export const Scaffold = ({ children }: ScaffoldProp) => {
  const loc = useLocation()

  return (
    <ScaffoldWrapper>
      <Header>
        <NavDrawerButton />
        <span>{getRouteName(loc.pathname)}</span>
        <SearchButton />
      </Header>

      <PageWrapper>{children}</PageWrapper>
    </ScaffoldWrapper>
  )
}
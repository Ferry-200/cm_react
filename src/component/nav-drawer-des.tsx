import { styled } from "@linaria/react"
import { ReactNode } from "react"
import { Link, useLocation } from "react-router"

const DesLink = styled(Link)`
  color: var(--md-on-surface);
  width: 100%;
  height: 56px;
  padding: 0 16px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  text-decoration: none;
  position: relative;
  transition: all 150ms;

  &>span {
    margin-left: 12px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 28px;
  }

  &:hover::before {
    background-color: var(--md-surface-hover);
  }

  &:active::before {
    background-color: var(--md-surface-active);
  }

  &.active {
    background-color: var(--md-secondary-container);
    color: var(--md-on-secondary-container);
    font-weight: bold;

    &:hover::before {
      background-color: var(--md-secondary-container-hover);
    }

    &:active::before {
      background-color: var(--md-secondary-container-active);
    }
  }
`

type NavDrawerDesProp = {
  to: string,
  onClick?: () => void,
  icon: ReactNode,
  text: string
}

export const NavDrawerDes = ({ to, onClick, icon, text }: NavDrawerDesProp) => {
  const loc = useLocation()
  return (
    <DesLink
      to={to}
      onClick={onClick}
      className={loc.pathname === to ? 'active' : undefined}
    >
      {icon}
      <span>{text}</span>
    </DesLink>
  )
}
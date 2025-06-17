import { styled } from "@linaria/react"
import { makeClickable } from "../utils"

type FilledButtonProp = {
  text: string,
  onClick: VoidFunction
}

const Button = styled.button`
  border: none;
  background-color: var(--md-primary);
  color: var(--md-on-primary);
  height: 40px;
  border-radius: 20px;
  padding: 0 24px;
  font-size: 16px;

  ${makeClickable('--md-primary-hover', '--md-primary-active')}
`

export const FilledButton = ({ text, onClick }: FilledButtonProp) => {
  return (
    <Button type="button" onClick={onClick}>{text}</Button>
  )
}
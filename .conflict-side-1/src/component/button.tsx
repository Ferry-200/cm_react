import { styled } from "@linaria/react"

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
  position: relative;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    pointer-events: none;
  }

  &:hover::before {
    background-color: var(--md-primary-hover);
  }

  &:active::before {
    background-color: var(--md-primary-active);
  }
`

export const FilledButton = ({ text, onClick }: FilledButtonProp) => {
  return (
    <Button type="button" onClick={onClick}>{text}</Button>
  )
}
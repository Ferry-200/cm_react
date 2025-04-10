import { styled } from "@linaria/react"
import { TextField, TextFieldHandle } from "../component/text-field"
import { useCallback, useRef } from "react"
import { FilledButton } from "../component/button"
import { authenticate } from "../jellyfin"
import { useNavigate } from "react-router"
import { BREAKPOINT } from "../const"
import { ROUTE_PATH } from "../router"

const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`

const PageMain = styled.main`
  margin: auto;
  width: 70%;
  height: 240px;
  padding: 8px 36px;
  background-color: var(--md-primary-container);
  color: var(--md-on-primary-container);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  @media screen and (min-width: ${BREAKPOINT.medium}) {
    width: 400px;
  }
`

const LoginTitle = styled.span`
  font-size: 24px;
`

const LoginTextField = styled(TextField)`
  align-self: stretch;
`

export const LoginPage = () => {
  const usernameHandle = useRef<TextFieldHandle>(null)
  const passwordHandle = useRef<TextFieldHandle>(null)
  const navTo = useNavigate()

  const login = useCallback(() => {
    authenticate(
      usernameHandle.current!.getText(),
      passwordHandle.current!.getText()
    ).then(
      (result) => {
        if (result) {
          void navTo(ROUTE_PATH.index, { replace: true })
        }
      },
      (reason) => {
        console.error(reason)
      }
    )
  }, [navTo])

  return (
    <PageWrapper>
      <PageMain>
        <LoginTitle>Coriander Music</LoginTitle>
        <LoginTextField id="username-input" labelStr='用户名' ref={usernameHandle} />
        <LoginTextField password id="password-input" labelStr='密码' ref={passwordHandle} />
        <FilledButton text="登陆" onClick={login} />
      </PageMain>
    </PageWrapper>
  )
}
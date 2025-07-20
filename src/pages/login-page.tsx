import { styled } from "@linaria/react"
import { TextField, TextFieldHandle } from "../component/text-field"
import { useCallback, useRef } from "react"
import { FilledButton } from "../component/button"
import { authenticate } from "../jellyfin"
import { useNavigate } from "react-router"
import { BREAKPOINT } from "../utils"
import { ROUTE_PATH } from "../router"
import { useJellyfinApi } from "../jellyfin/context"

const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`

const PageMain = styled.main`
  margin: auto;
  width: 80%;
  height: 240px;
  padding: 8px 36px;
  background-color: var(--md-primary-container);
  color: var(--md-on-primary-container);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: ${BREAKPOINT.medium}) {
    width: 400px;
  }
`

const LoginTitle = styled.span`
  font-size: 24px;
  margin-bottom: 12px;
`

const LoginTextField = styled(TextField)`
  align-self: stretch;
  margin-bottom: 12px;
`

export const LoginPage = () => {
  const jellyfinApi = useJellyfinApi()
  const usernameHandle = useRef<TextFieldHandle>(null)
  const passwordHandle = useRef<TextFieldHandle>(null)
  const navTo = useNavigate()

  const login = useCallback(() => {
    authenticate(
      jellyfinApi,
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
  }, [jellyfinApi, navTo])

  return (
    <PageWrapper>
      <PageMain>
        <LoginTitle>Coriander Music</LoginTitle>
        <form>
          <LoginTextField
            id="username-input"
            labelStr='用户名'
            autoComplete='username'
            ref={usernameHandle}
          />
          <LoginTextField
            password
            id="password-input"
            labelStr='密码'
            autoComplete='current-password'
            ref={passwordHandle}
          />
        </form>
        <FilledButton onClick={login} >登陆</FilledButton>
      </PageMain>
    </PageWrapper>
  )
}
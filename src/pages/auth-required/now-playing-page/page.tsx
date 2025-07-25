import { styled } from "@linaria/react"
import { useIsLargeScreen } from "../../../utils"
import { NowPlayingPageLarge } from "./large"
import { NowPlayingPageSmall } from "./small"
import { StandardIconButton } from "../../../component/icon-button"
import { LucideArrowLeft } from "lucide-react"
import { useNavigate } from "react-router"

const Wrap = styled.div`
  background-color: var(--md-surface-container);
  
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  padding: 8px 20px;
`

const BackIconBtnWrapper = styled.div`
  align-self: flex-start;
  flex-shrink: 0;
  margin-bottom: 8px;
`

export const NowPlayingPage = () => {
  const navigate = useNavigate()
  const isLarge = useIsLargeScreen()

  return (
    <Wrap>
      <BackIconBtnWrapper>
        <StandardIconButton onClick={() => void navigate(-1)}>
          <LucideArrowLeft />
        </StandardIconButton>
      </BackIconBtnWrapper>
      {isLarge ? <NowPlayingPageLarge /> : <NowPlayingPageSmall />}
    </Wrap>
  )
}
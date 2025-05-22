import { styled } from "@linaria/react";

const Wrapper = styled.a`
  margin: auto 0 8px 0;
  text-decoration: none;
  color: var(--md-on-surface);
`

export const ICP = () => (
    <Wrapper href="https://beian.miit.gov.cn/" target="_blank">
        桂ICP备2025061728号-1
    </Wrapper>
)
import { styled } from "@linaria/react";
import { Stylable } from "../utils";

const Wrapper = styled.a`
  text-decoration: none;
  color: var(--md-on-surface);
`

export const ICP = ({ style, className }: Stylable) => (
    <Wrapper style={style} className={className}
        href="https://beian.miit.gov.cn/" target="_blank"
    >
        桂ICP备2025061728号-1
    </Wrapper>
)
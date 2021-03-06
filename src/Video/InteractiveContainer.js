import React from "react"
import styled from "styled-components"
import { ReactComponent as Iphone } from "./clear-phone.svg"

const Container = styled.div`
  ${props =>
    !props.noCursor &&
    `
cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='30' height='36' viewport='0 0 100 100' style='fill:black;font-size:18px;'><text y='50%'>🤚</text></svg>")
      16 0,
    auto; /*emojicursor.app*/
`};
  position: relative;
  height: 600px;
  width: 100%;
  overflow: ${props => (props.showOverflow ? "visible" : "hidden")};
  user-select: none !important;
  @media (min-width: 768px) {
    height: 770px;
  }

  > svg {
    height: 100%;
    width: 100%;
    display: none;
  }

  @media (min-width: 768px) {
    width: 371px;

    > svg {
      display: block;
    }
  }

  > svg,
  > div {
    position: absolute;
    top: 0;
    left: 0;
  }

  > div {
    margin: 0 auto;
    @media (min-width: 768px) {
      height: 531px;
      width: 347px;
      margin: none;
      top: 77px;
      left: 12px;
      overflow: ${props => (props.showOverflow ? "visible" : "hidden")};
    }
  }
`

const Video = ({ children, showOverflow, noCursor }) => {
  return (
    <Container showOverflow={showOverflow} noCursor={noCursor}>
      <Iphone />
      {children}
    </Container>
  )
}

export default Video

import React from "react"
import styled from "styled-components"
import iphone from "./clear-phone.svg"
import hand from "./hand.png"

const Container = styled.div`
  ${props =>
    !props.noCursor &&
    `
cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='30' height='36' viewport='0 0 100 100' style='fill:black;font-size:18px;'><text y='50%'>🤚</text></svg>")
      16 0,
    auto; /*emojicursor.app*/
`};
  position: relative;
  height: 770px;
  width: 371px;
  overflow: ${props => (props.showOverflow ? "visible" : "hidden")};
  user-select: none !important;
  > img {
    height: 100%;
    width: 100%;
  }
  > img,
  > div {
    position: absolute;
    top: 0;
    left: 0;
  }

  > div {
    height: 531px;
    width: 347px;
    top: 77px;
    left: 12px;
    overflow: ${props => (props.showOverflow ? "visible" : "hidden")};
  }
`

const Video = ({ children, showOverflow, noCursor }) => {
  return (
    <Container showOverflow={showOverflow} noCursor={noCursor}>
      <img src={iphone} />
      {children}
    </Container>
  )
}

export default Video

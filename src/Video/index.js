import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import iphone from "./iphone.svg"

const Container = styled.div`
  position: relative;
  height: 800px;
  width: 391px;
  > img {
    height: 100%;
    width: 100%;
    position: relative;
  }
  > img,
  > div {
    position: absolute;
    top: 0;
    left: 0;
  }

  > div {
    height: 652px;
    top: 75px;
    left: 1px;
  }
`

const Video = ({ path }) => {
  return (
    <Container>
      <img src={iphone} />
      <div
        dangerouslySetInnerHTML={{
          __html: `
      <video
        style="height: 100%; width: 100%"
        autoplay
        loop
        muted
        src="${path}"
      />
    `
        }}
      />
    </Container>
  )
}

export default Video

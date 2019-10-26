import React, { useRef, useLayoutEffect } from "react"
import styled from "styled-components"
import { animated, useSpring } from "react-spring"
import ImageGrid, { defaultSpringSettings } from "./ImageGrid"
import images from "../assets/index"
import usePrevious from "../usePrevious"
import * as Rematrix from "rematrix"

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  ${props =>
    props.backgroundPointerEvents
      ? "pointer-events:none;"
      : "pointer-events:all;"};
  background-color: white;
  z-index: ${props => props.zIndex};
  will-change: opacity;
`

const StyledContainer = styled.div`
  position: relative;
  background-color: white;
  padding-top: 2rem;
  padding-bottom: 2rem;
`

const imageData = images
  .slice(0, 15)
  .map((img, i) => ({ img, id: `img-${i}` }))
  .reduce((acc, curr) => {
    acc[curr.id] = curr
    return acc
  }, {})

const imageIds = Object.keys(imageData)

class Flipper {
  constructor({ ref, onFlip }) {
    this.ref = ref
    this.onFlip = onFlip
    this.positions = {}
  }
  getEl = id => this.ref.current.querySelector(`[data-flip-key=${id}]`)

  measure(id) {
    const el = this.getEl(id)
    if (el) return el.getBoundingClientRect()
  }

  beforeFlip(id) {
    this.positions[id] = this.measure(id)
  }

  flip(id, data) {
    const el = this.getEl(id)

    const startTransform = Rematrix.fromString(el.style.transform)
    el.style.transform = ""
    const after = this.measure(id, true)
    const before = this.positions[id]
    const scaleX = before.width / after.width
    const scaleY = before.height / after.height
    const x = before.left - after.left
    const y = before.top - after.top

    const transformsArray = [
      startTransform,
      Rematrix.translateX(x),
      Rematrix.translateY(y),
      Rematrix.scaleX(scaleX),
      Rematrix.scaleY(scaleY)
    ]

    const matrix = transformsArray.reduce(Rematrix.multiply)

    const diff = {
      x: matrix[12],
      y: matrix[13],
      scaleX: matrix[0],
      scaleY: matrix[5]
    }

    this.onFlip(id, diff, data)
  }
}

const DismissFullScreen = ({ config }) => {
  const containerRef = React.useRef(null)
  const [zIndexQueue, setZindexQueue] = React.useState([])

  const [selectedImageId, setSelectedImage] = React.useState(null)

  const [backgroundSpring, setBackgroundSpring] = useSpring(() => {
    return {
      opacity: 0
    }
  })

  const springsRef = React.useRef({})

  const setSpring = React.useCallback(({ id, springVals, set }) => {
    springsRef.current[id] = {
      springVals,
      set
    }
  }, [])

  React.useEffect(() => {
    Object.keys(springsRef.current).forEach(id => {
      springsRef.current[id].set({ config })
      setBackgroundSpring({ config })
    })
  }, [config, setBackgroundSpring])

  const flipRef = useRef(
    new Flipper({
      ref: containerRef,
      onFlip(id, vals, data = {}) {
        const set = springsRef.current[id].set

        const el = this.getEl(id)
        el.style.transform = `translate(${vals.x}px, ${vals.y}px) scaleX(${vals.scaleX}) scaleY(${vals.scaleY})`
        set({
          ...vals,
          immediate: true,
          onFrame: () => {}
        })

        requestAnimationFrame(() => {
          setBackgroundSpring({
            opacity: data.isLeaving ? 0 : 1,
            config: data.config
          })

          set(
            {
              ...defaultSpringSettings,
              config: data.config,
              immediate: false
            },
            { skipSetVelocity: true }
          )
        })
      }
    })
  )

  const previousSelectedImageId = usePrevious(selectedImageId)

  useLayoutEffect(() => {
    if (
      previousSelectedImageId === undefined ||
      previousSelectedImageId === selectedImageId
    )
      return
    if (selectedImageId) {
      flipRef.current.flip(selectedImageId, {
        config,
        trackVelocity: false
      })
      requestAnimationFrame(() => {
        setZindexQueue(
          zIndexQueue
            .filter(id => id !== selectedImageId)
            .concat(selectedImageId)
        )
      })
    } else {
      flipRef.current.flip(previousSelectedImageId, {
        isLeaving: true,
        config
      })
    }
  }, [config, previousSelectedImageId, selectedImageId, zIndexQueue])

  const wrappedSetSelectedImage = React.useCallback(id => {
    flipRef.current.beforeFlip(id)
    setSelectedImage(id)
  }, [])

  const wrappedUnsetSelectedImage = React.useCallback(id => {
    flipRef.current.beforeFlip(id)
    setSelectedImage(null)
  }, [])

  return (
    <StyledContainer ref={containerRef}>
      <ImageGrid
        zIndexQueue={zIndexQueue}
        setSpring={setSpring}
        selectedImageId={selectedImageId}
        setSelectedImage={wrappedSetSelectedImage}
        unsetSelectedImage={wrappedUnsetSelectedImage}
        setBackgroundSpring={setBackgroundSpring}
        images={imageIds.map(id => imageData[id])}
        config={config}
      />

      <Background
        as={animated.div}
        backgroundPointerEvents={!selectedImageId}
        style={backgroundSpring}
        zIndex={3 + zIndexQueue.length}
      />
    </StyledContainer>
  )
}

export default DismissFullScreen

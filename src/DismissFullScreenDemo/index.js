import React, { useLayoutEffect } from "react";
import styled from "styled-components";
import { animated, useSpring } from "react-spring";
import ImageGrid from "./ImageGrid";
import images from "../assets/index";
import usePrevious from "../usePrevious";

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
`;

const StyledContainer = styled.div`
  position: relative;
  background-color: white;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const imageData = images
  .slice(0, 15)
  .map((img, i) => ({ img, id: `img-${i}` }))
  .reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});

const imageIds = Object.keys(imageData);

const DismissFullScreen = ({ config }) => {
  const containerRef = React.useRef(null);
  const [zIndexQueue, setZindexQueue] = React.useState([]);

  const [selectedImageId, setSelectedImage] = React.useState(null);

  const [backgroundSpring, setBackgroundSpring] = useSpring(() => {
    return {
      opacity: 0
    };
  });

  const springsRef = React.useRef({});

  const setSpring = React.useCallback(({ id, springVals, set }) => {
    springsRef.current[id] = {
      springVals,
      set
    };
  }, []);

  React.useEffect(() => {
    Object.keys(springsRef.current).forEach(id => {
      springsRef.current[id].set({ config });
      setBackgroundSpring({ config });
    });
  }, [config, setBackgroundSpring]);

  const previousSelectedImageId = usePrevious(selectedImageId);

  useLayoutEffect(() => {
    if (
      previousSelectedImageId === undefined ||
      previousSelectedImageId === selectedImageId
    )
      return;
    if (selectedImageId) {
      requestAnimationFrame(() => {
        setZindexQueue(
          zIndexQueue
            .filter(id => id !== selectedImageId)
            .concat(selectedImageId)
        );
      });
    }
  }, [config, previousSelectedImageId, selectedImageId, zIndexQueue]);

  return (
    <StyledContainer ref={containerRef}>
      <ImageGrid
        zIndexQueue={zIndexQueue}
        setSpring={setSpring}
        selectedImageId={selectedImageId}
        setSelectedImage={setSelectedImage}
        unsetSelectedImage={() => setSelectedImage(null)}
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
  );
};

export default DismissFullScreen;

import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import { useSpring, interpolate } from "react-spring";
import useVelocityTrackedSpring from "../useVelocityTrackedSpring";
import { useDrag } from "react-use-gesture";
import { dragSelected, dragUnselected } from "./drag";
import useWindowSize from "../useWindowSize";
import FlippableAnimatedDiv from "../FlippableAnimatedDiv";

export const defaultSpringSettings = {
  y: 0,
  x: 0,
  scaleX: 1,
  scaleY: 1,
  config: {
    tension: 500,
    friction: 50
  }
};

export const bounceConfig = {
  tension: 500,
  friction: 30
};

const StyledGrid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  margin: 0.5rem;
  grid-template-columns: repeat(3, 1fr);
`;

const StyledGridItem = styled.div`
  overflow: hidden;
  transform-origin: 0 0;
  position: relative;
  will-change: transform;
  user-select: none;
  ${props =>
    props.isSelected
      ? css`
          touch-action: none;
          height: 321px;
          position: absolute;
          top: 6.5rem;
          left: 0;
          right: 0;
        `
      : css`
          height: 93.7px;
        `}
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GridImage = ({
  setSelectedImage,
  unsetSelectedImage,
  img,
  id,
  setSpring,
  isSelected,
  setBackgroundSpring,
  zIndexQueue,
  height,
  config
}) => {
  const [{ y }, setY] = useVelocityTrackedSpring(() => ({
    y: 0,
    config
  }));

  const [{ x }, setX] = useSpring(() => ({
    x: 0,
    config
  }));

  const [{ scaleX, scaleY }, setScale] = useSpring(() => ({
    scaleX: 1,
    scaleY: 1
  }));

  const containerRef = React.useRef(null);

  const set = (...args) => {
    setY(...args);
    setX(...args);
    setScale(...args);
  };

  const dragCallback = isSelected
    ? dragSelected({
        onImageDismiss: () => unsetSelectedImage(id),
        x,
        y,
        set,
        setBackgroundSpring
      })
    : dragUnselected({
        setSelectedImage: () => setSelectedImage(id)
      });

  const bind = useDrag(dragCallback);

  useEffect(() => {
    setSpring({
      id,
      springVals: {
        x,
        y,
        scaleX,
        scaleY
      },
      set
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <StyledGridItem
        height={height}
        isSelected={isSelected}
        ref={containerRef}
        as={FlippableAnimatedDiv}
        flipKey={isSelected}
        flipSet={[setX, setY, setScale]}
        {...bind()}
        style={{
          zIndex: interpolate([x, y], (x, y) => {
            const animationInProgress = x !== 0 || y !== 0;
            if (isSelected) return zIndexQueue.length + 1000;
            if (
              animationInProgress &&
              zIndexQueue.indexOf(id) === zIndexQueue.length - 1
            )
              return 5 + zIndexQueue.indexOf(id);
            if (zIndexQueue.indexOf(id) > -1 && animationInProgress) {
              return 2 + zIndexQueue.indexOf(id);
            }
            return 1;
          }),
          transform: interpolate(
            [x, y, scaleX, scaleY],
            (x, y, scaleX, scaleY) => {
              return `translate3d(${x}px, ${y}px, 0) scaleX(${scaleX}) scaleY(${scaleY})`;
            }
          )
        }}
      >
        <img src={img} alt="landscape" draggable={false} />
      </StyledGridItem>
    </div>
  );
};

const MemoizedGridImage = React.memo(GridImage);

const ImageGrid = ({ images, selectedImageId, ...rest }) => {
  const { height } = useWindowSize();
  return (
    <StyledGrid>
      {images.map(({ id, img }) => {
        return (
          <MemoizedGridImage
            key={id}
            isSelected={selectedImageId === id}
            id={id}
            img={img}
            height={height}
            {...rest}
          />
        );
      })}
    </StyledGrid>
  );
};

export default ImageGrid;

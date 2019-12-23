import React from "react";
import * as Rematrix from "rematrix";
import { animated, useSpring, interpolate } from "react-spring";

const positionCache = {};

class InnerFlip extends React.Component {
  el = React.createRef();

  // allow users to pass in spring set functions
  // if they want to maintain control over springs
  setVals(vals) {
    Array.isArray(this.props.flipSet)
      ? this.props.flipSet.map(set => set(vals))
      : this.props.flipSet(vals);
  }

  calculateFlip(before) {
    const startTransform = Rematrix.fromString(this.el.current.style.transform);
    this.el.current.style.transform = "";
    const after = this.el.current.getBoundingClientRect();
    const scaleX = before.width / after.width;
    const scaleY = before.height / after.height;
    const x = before.left - after.left;
    const y = before.top - after.top;

    const transformsArray = [
      startTransform,
      Rematrix.translateX(x),
      Rematrix.translateY(y),
      Rematrix.scaleX(scaleX),
      Rematrix.scaleY(scaleY)
    ];

    const matrix = transformsArray.reduce(Rematrix.multiply);

    const diff = {
      x: matrix[12],
      y: matrix[13],
      scaleX: matrix[0],
      scaleY: matrix[5]
    };
    this.animate(diff);
  }

  animate(vals) {
    this.el.current.style.transform = `translate(${vals.x}px, ${vals.y}px) scaleX(${vals.scaleX}) scaleY(${vals.scaleY})`;
    this.setVals({ ...vals, immediate: true });
    requestAnimationFrame(() => {
      this.setVals({ x: 0, y: 0, scaleX: 1, scaleY: 1, immediate: false });
    });
  }

  componentDidMount() {
    const previousCoords = positionCache[this.props.flipId];
    if (previousCoords) {
      this.calculateFlip(previousCoords);
      delete positionCache[this.props.flipId];
    }
  }

  componentWillUnmount() {
    if (this.props.flipId) {
      positionCache[
        this.props.flipId
      ] = this.el.current.getBoundingClientRect();
    }
  }

  componentDidUpdate(prevProps, prevState, before) {
    if (prevProps.flipKey === this.props.flipKey) return;
    this.calculateFlip(before);
  }

  getSnapshotBeforeUpdate(nextProps) {
    return nextProps.flipKey !== this.props.flipKey
      ? this.el.current.getBoundingClientRect()
      : "";
  }

  render() {
    return <animated.div {...this.props} ref={this.el} />;
  }
}

const AnimationHandler = props => {
  const [{ x, y, scaleX, scaleY }, set] = useSpring(() => ({
    y: 0,
    x: 0,
    scaleX: 1,
    scaleY: 1
  }));

  const augmentedStyle = {
    ...props.style,
    transformOrigin: "0 0",
    transform: interpolate([x, y, scaleX, scaleY], (x, y, scaleX, scaleY) => {
      return `translate3d(${x}px, ${y}px, 0) scaleX(${scaleX}) scaleY(${scaleY})`;
    })
  };
  return <InnerFlip {...props} flipSet={set} style={augmentedStyle} />;
};

const OuterFlip = props => {
  if (props.flipSet) return <InnerFlip {...props} />;
  return <AnimationHandler {...props} />;
};

export default OuterFlip;

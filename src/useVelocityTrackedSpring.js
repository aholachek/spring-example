import { useSpring } from "react-spring"

const getTrackedVar = (_trackedVar, initialConfig) => {
  if (_trackedVar) return _trackedVar
  const hasX = initialConfig.x !== undefined
  const hasY = initialConfig.y !== undefined
  if ((hasX && hasY) || (!hasX && !hasY)) {
    throw new Error(
      "can't automatically detect which variable to track, so you need to specify which variable should be tracked for velocity"
    )
  }
  return hasX ? "x" : "y"
}

const useVelocityTrackedSpring = (initialConfigFunc, _trackedVar) => {
  const initialConfig = initialConfigFunc()
  const trackedVar = getTrackedVar(_trackedVar, initialConfig)
  const [springVals, set] = useSpring(initialConfigFunc)
  const [{ velocityTracker }, setVelocityTracker] = useSpring(() => ({
    velocityTracker: initialConfig[trackedVar],
    ...initialConfig
  }))

  const wrappedSet = (data, { skipSetVelocity } = {}) => {
    const args = { config: data.config }
    if (data[trackedVar]) args.velocityTracker = data[trackedVar]

    setVelocityTracker(args)

    if (data.immediate) return set(data)

    set({
      ...data,
      config: {
        ...data.config,
        velocity: !skipSetVelocity && velocityTracker.lastVelocity
      }
    })
  }
  return [springVals, wrappedSet]
}

export default useVelocityTrackedSpring

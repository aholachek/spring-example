// 0 < percent < 1
export const range = (start, end, percent) => (end - start) * percent + start

export const clamp = (min, max, val) => Math.max(Math.min(val, max), min)

export const rangeMap = (arr1, arr2, val) => {
  const percent = (val - arr1[0]) / (arr1[1] - arr1[0])
  return range(arr2[0], arr2[1], percent)
}

// https://twitter.com/chpwn/status/285540192096497664
// iOS constant = 0.55
export const rubberBand = (distance, dimension, constant = 0.12) => {
  return (distance * dimension * constant) / (dimension + constant * distance)
}

export const rubberBandIfOutOfBounds = (min, max, delta, constant) => {
  if (delta < min) {
    return -rubberBand(min - delta, max - min, constant) + min
  }
  if (delta > max) {
    return rubberBand(delta - max, max - min, constant) + max
  }
  return delta
}

export const decelerationRates = {
  fast: 0.99,
  normal: 0.998
}

// https://medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5
// note: velocity in UIkit is points per second, but react use gesture gives px per millisecond,
// so we can simplify somewhat
export const projection = (initialVelocity, rateName = "normal") => {
  const decelerationRate = decelerationRates[rateName] || rateName
  return (initialVelocity * decelerationRate) / (1 - decelerationRate)
}

export const findNearestNumberInArray = (n, arr) => {
  const sortedArr = [...arr].sort((a, b) => a - b)
  if (n <= sortedArr[0]) return sortedArr[0]
  if (n >= sortedArr[arr.length - 1]) return sortedArr[arr.length - 1]

  for (let i = 1; i < sortedArr.length; i++) {
    const prev = sortedArr[i - 1]
    const current = sortedArr[i]
    if (current === n) return current
    if (current > n && prev < n) {
      return current - n < n - prev ? current : prev
    }
  }
  return false
}

export const getPercent = (val, stops) => {
  if (stops.length === 0) return 0
  return (val - stops[0]) / (stops[stops.length - 1] - stops[0])
}

export const tweenByDrag = (val, stops, values, clampVal) => {
  let percent = getPercent(val, stops)
  if (clampVal) {
    percent = clamp(0, 1, percent)
  }
  if (Array.isArray(values)) return range(values[0], values[1], percent)
  return Object.keys(values)
    .map(key => {
      return [key, range(values[key][0], values[key][1], percent)]
    })
    .reduce((acc, curr) => {
      acc[curr[0]] = curr[1]
      return acc
    }, {})
}

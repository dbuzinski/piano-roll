const snapToGrid = (x,y,round) => {
  if (round === "floor") {
    const snappedX = Math.floor(x/30)*30
    const snappedY =  Math.floor(y/10)*10
    return [snappedX, snappedY]
  } else if (round === "ceil") {
    const snappedX = Math.ceil(x/30)*30
    const snappedY =  Math.ceil(y/10)*10
    return [snappedX, snappedY]
  } else {
    const snappedX = Math.round(x/30)*30
    const snappedY =  Math.round(y/10)*10
    return [snappedX, snappedY]
  }
}



export default snapToGrid

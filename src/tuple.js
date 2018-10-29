export function createTupleKey(row,col) {
  return row.toString()+","+col.toString()
}

export function first(tuple) {
  return parseInt(tuple.split(",")[0])
}

export function second(tuple) {
  return parseInt(tuple.split(",")[1])
}

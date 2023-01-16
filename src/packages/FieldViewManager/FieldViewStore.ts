import { isNil } from 'lodash-es'

export type ViewRow = symbol
export type ViewCol = symbol

const VIEW_STORE = new Map<ViewRow, Map<ViewCol, unknown>>()

function write<P = unknown>(row: ViewRow, col: ViewCol, value: P) {
  let viewCol = VIEW_STORE.get(row)

  if (isNil(viewCol)) {
    viewCol = new Map<ViewCol, P>()
  }

  if (viewCol.has(col)) {
    throw new Error(`ViewStore: ${String(row)}:${String(col)} already exists!`)
  }

  viewCol.set(col, value)

  VIEW_STORE.set(row, viewCol)
}

function read<P = unknown>(row: ViewRow, col: ViewCol): P | undefined {
  const viewCol = VIEW_STORE.get(row)
  if (isNil(viewCol)) return
  return viewCol.get(col) as P
}

function reset() {
  VIEW_STORE.clear()
}

export default { write, read, reset }

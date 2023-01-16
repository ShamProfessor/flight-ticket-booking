import React, { createElement } from 'react'
import { has, isNil } from 'lodash-es'
import { withErrorBoundary } from '@sentry/react'

import { DEFAULT_FIELD_TYPE, VIEW_TOKEN_REGEXP } from '@packages/miscellaneous/FieldViewManager/types'
import { beforeCapture } from '../Sentry/beforeSentrySend'

import type BaseFieldModel from '@packages/domains/Fields/FieldModel/BaseFieldModel'
import type { FieldViewImplement } from '@packages/miscellaneous/FieldViewManager/types'
import type { FieldClass } from 'typings/domain'

type ViewRow = symbol
type ViewCol = symbol

export const MissingView =
  process.env.NODE_ENV === 'production'
    ? () => null
    : () => React.createElement(React.Fragment, null, `Can not found field view!`)

class FieldViewManager {
  VIEW_STORE: Map<ViewRow, Map<ViewCol, unknown>>

  constructor() {
    this.VIEW_STORE = new Map<symbol, Map<symbol, unknown>>()
  }

  write<P = unknown>(row: ViewRow, col: ViewCol, value: P) {
    let viewCol = this.VIEW_STORE.get(row)

    if (isNil(viewCol)) {
      viewCol = new Map<ViewCol, P>()
    }

    if (viewCol.has(col)) {
      throw new Error(`ViewStore: ${String(row)}:${String(col)} already exists!`)
    }

    viewCol.set(col, value)

    this.VIEW_STORE.set(row, viewCol)
  }

  read<P = unknown>(row: ViewRow, col: ViewCol): P | undefined {
    const viewCol = this.VIEW_STORE.get(row)
    if (isNil(viewCol)) return
    return viewCol.get(col) as P
  }

  reset() {
    this.VIEW_STORE.clear()
  }

  private obtainViewCoordinate(fieldViewName: string) {
    if (!fieldViewName) {
      throw new Error(`${fieldViewName} has no view name.`)
    }

    const result = VIEW_TOKEN_REGEXP.exec(fieldViewName)

    if (isNil(result)) {
      throw new Error(`${fieldViewName} is invalid.`)
    }

    const [, fieldType, viewType] = result
    if (!isNil(fieldType) && !/Field$/.test(fieldType)) {
      throw new Error(`${fieldType} must end with 'Field'.`)
    }

    const viewRow = fieldType ? Symbol.for(fieldType) : DEFAULT_FIELD_TYPE
    const viewCol = Symbol.for(viewType.replace(/^Field/, ''))

    return [viewRow, viewCol]
  }

  record<P extends BaseFieldModel = BaseFieldModel>(fieldViewName: string, fieldView: FieldViewImplement<P>) {
    const fieldViewComponentName = fieldView.name ?? fieldView.displayName

    if (fieldViewName !== fieldViewComponentName && process.env.NODE_ENV === 'development') {
      console.warn('[FieldViewRegister]', `${fieldViewComponentName} is not equal to ${fieldViewName}.`)
    }

    const [viewRow, viewCol] = this.obtainViewCoordinate(fieldViewName)

    this.write(
      viewRow,
      viewCol,
      withErrorBoundary(fieldView, { fallback: createElement('p', null, '⚠️ Something went wrong!'), beforeCapture })
    )
  }

  direct(sourceView: string, destView: string) {
    const [viewRow, viewCol] = this.obtainViewCoordinate(sourceView)
    const [destViewRow, destViewCol] = this.obtainViewCoordinate(destView)

    this.write(viewRow, viewCol, {
      to: [destViewRow, destViewCol],
    })
  }

  resolve<P extends BaseFieldModel = BaseFieldModel>(
    type: FieldClass,
    token: string | symbol,
    options?: {
      fallback: boolean
    }
  ): FieldViewImplement<P> {
    const viewRow = /Field$/.test(type) ? type : `${type}Field`
    const viewCol = typeof token === 'symbol' ? token : Symbol.for(token)
    let record = this.read<FieldViewImplement<P>>(Symbol.for(viewRow), viewCol)
    let searchCounter = 0

    if (isNil(record) && options?.fallback) {
      record = this.read<FieldViewImplement<P>>(DEFAULT_FIELD_TYPE, viewCol)
    }

    while (has(record, 'to')) {
      if (searchCounter > 10) {
        console.warn(`Search ${type} ${String(token)} more than 10 times.`)
        break
      }
      const [destViewRow, destViewCol] = (record as unknown as { to: [symbol, symbol] }).to
      record = this.read<FieldViewImplement<P>>(destViewRow, destViewCol)
      searchCounter++
    }

    if (isNil(record)) {
      return MissingView
    }

    return record
  }
}

export default FieldViewManager

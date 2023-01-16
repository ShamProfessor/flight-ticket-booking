import { createElement } from 'react'
import { isNil } from 'lodash-es'
import { withErrorBoundary } from '@sentry/react'

import { withSuspense } from '@packages/miscellaneous/FieldViewManager/withSuspense'
import FieldViewStore from './FieldViewStore'
import { VIEW_TOKEN_REGEXP, DEFAULT_FIELD_TYPE } from './types'
import { beforeCapture } from '../Sentry/beforeSentrySend'

import type BaseFieldModel from '@packages/domains/Fields/FieldModel/BaseFieldModel'
import type { FieldViewImplement } from './types'

function obtainViewCoordinate(fieldViewName: string) {
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

function record<P extends BaseFieldModel = BaseFieldModel>(fieldViewName: string, fieldView: FieldViewImplement<P>) {
  const [viewRow, viewCol] = obtainViewCoordinate(fieldViewName)

  FieldViewStore.write<FieldViewImplement<P>>(
    viewRow,
    viewCol,
    withErrorBoundary(withSuspense(fieldView), {
      fallback: createElement('p', null, '⚠️ Something went wrong!'),
      beforeCapture,
    })
  )
}

function direct(sourceView: string, destView: string) {
  const [viewRow, viewCol] = obtainViewCoordinate(sourceView)
  const [destViewRow, destViewCol] = obtainViewCoordinate(destView)

  FieldViewStore.write(viewRow, viewCol, {
    to: [destViewRow, destViewCol],
  })
}

function reset() {
  FieldViewStore.reset()
}

export default { record, direct, reset }

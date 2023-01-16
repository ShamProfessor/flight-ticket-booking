import { has, isNil } from 'lodash-es'

import FieldViewStore from './FieldViewStore'
import { DEFAULT_FIELD_TYPE } from './types'

import { MissingView } from './MissingView'

import type BaseFieldModel from '@packages/domains/Fields/FieldModel/BaseFieldModel'
import type { FieldClass } from 'typings/domain'
import type { FieldViewImplement } from './types'

interface FieldViewResolveOptions {
  fallback: boolean
}

function resolve<P extends BaseFieldModel = BaseFieldModel>(
  type: FieldClass,
  token: string | symbol,
  options?: FieldViewResolveOptions
): FieldViewImplement<P> {
  const viewRow = /Field$/.test(type) ? type : `${type}Field`
  const viewCol = typeof token === 'symbol' ? token : Symbol.for(token)
  let record = FieldViewStore.read<FieldViewImplement<P>>(Symbol.for(viewRow), viewCol)
  let searchCounter = 0

  if (isNil(record) && options?.fallback) {
    record = FieldViewStore.read<FieldViewImplement<P>>(DEFAULT_FIELD_TYPE, viewCol)
  }

  while (has(record, 'to')) {
    if (searchCounter > 10) {
      console.warn(`Search ${type} ${String(token)} more than 10 times.`)
      break
    }
    const [destViewRow, destViewCol] = (record as unknown as { to: [symbol, symbol] }).to
    record = FieldViewStore.read<FieldViewImplement<P>>(destViewRow, destViewCol)
    searchCounter++
  }

  if (isNil(record)) {
    return MissingView
  }

  return record
}

export default { resolve }

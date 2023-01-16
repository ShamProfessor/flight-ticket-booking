import type { JSXElementConstructor } from 'react'
import type BaseFieldModel from '@packages/domains/Fields/FieldModel/BaseFieldModel'
import type { FieldControlProps } from '@packages/domains/FormStateManager/FieldAdapter.interface'

/**
 * The fallback field type, No business implication.
 */
export const DEFAULT_FIELD_TYPE = Symbol('__Default__Field__Type__')

/**
 * The Regular Experssion match field view name, eg:
 *
 *   TextFieldDetailView
 *   RadioButtonFieldInputView
 *
 * It consists of two parts: field type and view type. But field type
 * is optional. So `DetailView` is valid.
 */
export const VIEW_TOKEN_REGEXP = /^([A-Z]{1}[A-Za-z]{1,}Field)?([A-Z]{1}[A-Za-z]{1,}View)$/

export interface FieldViewProps<P extends BaseFieldModel = BaseFieldModel>
  extends Partial<FieldControlProps<ReturnType<P['fieldValueSelector']>>> {
  fieldModel: P
  fieldValue: ReturnType<P['fieldValueSelector']>
}

export type FieldViewImplement<P extends BaseFieldModel = BaseFieldModel> = JSXElementConstructor<FieldViewProps<P>> & {
  displayName?: string
}

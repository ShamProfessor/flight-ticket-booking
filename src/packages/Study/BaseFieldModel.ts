import { isArray, isEmpty, isNil, isString } from 'lodash-es'

import i18n from 'i18n'
import BehaviorSubject from '@packages/miscellaneous/BehaviorSubject'
import LengthValidator from './FieldValidators/LengthValidator'
import ValidationManager from './ValidationManager'

import type FormModel from '@packages/domains/Form/FormModel'
import type { BaseField, TextField } from 'typings/domain'
import type { StringIndex } from 'typings/types'
import type { FieldValueType } from './FieldValueType'

/**
 * 抽象字段模型的公共能力
 */

type ExtraParams = Record<string, any>

abstract class BaseFieldModel<F extends BaseField = BaseField, FieldValue = any> {
  abstract valueType: FieldValueType

  validationManager: ValidationManager

  public visibility = true
  public visibilitySubject: BehaviorSubject<boolean>

  public extraParams: ExtraParams = {}
  public extraParamsSubject: BehaviorSubject

  constructor(public fieldDef: F, public formModel: FormModel) {
    this.validationManager = new ValidationManager(this)
    this.visibilitySubject = new BehaviorSubject<boolean>()
    this.extraParamsSubject = new BehaviorSubject()
  }

  parentFieldModel: null | BaseFieldModel = null

  /**
   * 目前从 endpoint 中拿到的 EntryValues 是平铺的结构。 如下：
   * ```json
   * {
   *  "field_1": "kav6",
   *  "field_1_other": "其他信息",
   *  "field_2": "18502960326",
   *  "field_2_intl_mobile_no_country_id": "CN",
   * }
   * ```
   * 以手机字段为例，在这种情况下，FieldView 中得到的 FieldValue 的值只有一个手机号码，而国家代码就丢失了。
   * fieldValueSelector 的作用是，可以将这种情况下的 fieldValue 聚合起来变成：
   * ```json
   * {
   * "field_1": { "value": "kav6", "other": "其他信息" }
   * "field_2": { "value": "18502960326", "intl_mobile_no_country_id": "CN" }
   * }
   * ```
   */
  fieldValueSelector(entryValues: StringIndex): FieldValue {
    return entryValues[this.fieldDef.apiCode] ?? null
  }

  fieldValueDeSelector(fieldValue: FieldValue) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [this.fieldDef.apiCode]: fieldValue as any,
    }
  }

  validateFieldValue(fieldValue: FieldValue) {
    return this.validationManager.validate(fieldValue)
  }

  validateFieldPresence(fieldValue: FieldValue) {
    return this.validationManager.validatePresence(fieldValue)
  }

  isFieldValuePresence(fieldValue: FieldValue) {
    if (isArray(fieldValue) || isString(fieldValue)) return !isEmpty(fieldValue)
    return !isNil(fieldValue)
  }

  isAssociatedField() {
    return this.fieldDef.apiCode.includes('_associated_')
  }

  isSubmitterField() {
    return this.fieldDef.apiCode.includes('x_field_submitter_')
  }

  getAssociatedWithFieldApiCode() {
    const [withFieldApiCode] = this.fieldDef.apiCode.split('_associated_')
    return withFieldApiCode
  }

  formatValueToString(fieldValue: FieldValue) {
    if (!this.isFieldValuePresence(fieldValue)) return ''
    return `${fieldValue}`
  }

  // 业务上的数据长度，比如选项类选了几个，文本类填了几个字
  getFieldValueLength(fieldValue: FieldValue) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (fieldValue as any)?.length ?? 0
  }

  fieldValueLengthInputTipNameSpace = 'length'
  getFieldValueLengthInputTip() {
    const minValue = (this.fieldDef as unknown as TextField).minimumLength
    const maxValue = (this.fieldDef as unknown as TextField).maximumLength
    const error = LengthValidator.getValidatorName(minValue, maxValue)
    if (!error) return ''
    return i18n.t(`common.error.${this.fieldValueLengthInputTipNameSpace}.${error}`, {
      minValue,
      maxValue,
      ns: 'field',
    })
  }

  // 更新字段的动态属性，如：Quota、Inventory
  updateDynamicAttrs(dynamicValue: any) {}

  getPredefinedValue() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.fieldDef as any).predefinedValue
  }

  getScore(): number | undefined {
    const { apiCode } = this.fieldDef
    return this.formModel.getScoreMap()[apiCode]
  }
}

export default BaseFieldModel

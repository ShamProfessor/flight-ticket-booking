import { has, isNil, reduce } from 'lodash-es'

import isNotEmpty from '@packages/utils/isNotEmpty'
import FieldModelFactory from '@packages/domains/Fields/FieldModel/FieldModelFactory'
import { FieldClass, Scene } from 'typings/domain'
import { deepClone } from '@packages/utils/deepClone'
import BehaviorSubject from '@packages/miscellaneous/BehaviorSubject'
import { fieldRulesFilter } from '@packages/domains/FieldRule'

import type FormulaFieldModel from '@packages/domains/Fields/FormulaField/FieldModel/FormulaFieldModel'
import type { Entry, Field, Form, Maybe, FormRoleUserExternalAbilitiesType } from 'typings/domain'
import type BaseFieldModel from '@packages/domains/Fields/FieldModel/BaseFieldModel'

type DefaultFormType = Pick<Form, 'token'> &
  Partial<
    Pick<Form, 'fieldRulesGroupByTargetAndOperator' | 'scene' | 'storageConfig' | 'currency' | 'entriesCount'>
  > & {
    currentCooperator?: {
      externalAttachAbilities?: FormRoleUserExternalAbilitiesType[] | null
      formRole?: Pick<Exclude<Form['userFormRole'], null | undefined>, 'id' | 'abilities' | 'fieldAbilities'> | null
    } | null
  } & {
    billingAccount?: {
      id: Form['billingAccount']['id']
      planPackage?: Maybe<{ plan: { code: string } }>
      currentFeatureTrialInfo?: Maybe<{ status?: Maybe<string>; trialType?: Maybe<string> }>
    }
  }

export type FormValuesChangeParams = {
  formValues: Record<string, any>
  defaultFormValues?: Record<string, any>
  fieldApiCode?: string
  rowId?: string
  onChange: (value: any, fieldApiCode: string, originValue?: any) => void
}

class FormModel<FormType extends DefaultFormType = DefaultFormType> {
  form: FormType
  entry: Entry['fieldValues']

  fields: Field[]

  fieldModels: BaseFieldModel[] = []

  scoreMap: Record<string, number> = {}

  fieldsVisibilityChange = false

  fieldsVisibilityChangeSubject: BehaviorSubject<boolean>

  constructor(form: FormType, fields?: Maybe<Field>[] | null, entry?: Entry['fieldValues'] | null) {
    this.form = form
    this.entry = entry
    this.fieldsVisibilityChangeSubject = new BehaviorSubject<boolean>()
    this.fields = deepClone((fields ?? []).filter(isNotEmpty))

    this.fieldModels = this.fields.map(field => FieldModelFactory.create(field, this))

    this.updateFieldModelVisibility(entry?.fieldValues ?? {})

    if (entry) {
      this.scoreMap = entry.fieldValues['score_map'] ?? {}
    }
  }

  getFilteredFieldsByRules(fields: Field[], fieldValues: any) {
    // @ts-ignore
    const defaultRulableHiddenValues = JSON.parse(this.form?.defaultRulableHiddenValues ?? '{}')
    const mergeFieldValues = {
      ...defaultRulableHiddenValues,
      ...this.entry?.fieldValues,
      ...fieldValues,
    }
    const filteredFieldsByRules = fieldRulesFilter(
      this.form.fieldRulesGroupByTargetAndOperator || {},
      fields,
      mergeFieldValues
    )

    return reduce(
      filteredFieldsByRules,
      (result, field) => ({ ...result, [field.apiCode]: field }),
      {} as Record<string, Field>
    )
  }

  getFieldModels() {
    return this.fieldModels
  }

  getFieldModelByApiCode(apiCode: string) {
    return this.fieldModels.find(fieldModel => fieldModel.fieldDef.apiCode === apiCode)
  }

  getFormToken() {
    return this.form.token
  }

  getForm() {
    return this.form
  }

  getFields() {
    return this.fields
  }

  getScoreMap() {
    return this.scoreMap
  }

  handleFormValuesChange(params: FormValuesChangeParams) {
    const { formValues } = params

    this.updateFieldModelVisibility(formValues, false)
    this.updateFormulaFieldValue(params)
  }

  updateFieldModelVisibility(
    formValues: Record<string, any>,
    isOrigin = true,
    fieldsMapFilter?: (fieldsMap: Record<string, Field>) => Record<string, Field>
  ) {
    if (!isOrigin) {
      formValues = this.fieldModels.reduce(
        (result, fieldModel) => ({
          ...result,
          ...fieldModel.fieldValueDeSelector(formValues[fieldModel.fieldDef.apiCode]),
        }),
        {}
      )
    }

    let fieldsMap = this.getFilteredFieldsByRules(this.fields, formValues)

    if (!isNil(fieldsMapFilter)) {
      fieldsMap = fieldsMapFilter(fieldsMap)
    }

    let visibilityChange = false
    this.fieldModels.forEach(fieldModel => {
      const { apiCode } = fieldModel.fieldDef
      const currentVisibility = !isNil(fieldsMap[apiCode])
      if (currentVisibility !== fieldModel.visibility) {
        fieldModel.visibility = currentVisibility
        fieldModel.visibilitySubject.dispatch(currentVisibility)
        visibilityChange = true
      }
    })

    this.fieldsVisibilityChange = visibilityChange
    this.fieldsVisibilityChangeSubject.dispatch(visibilityChange)
  }

  updateFormulaFieldValue(params: FormValuesChangeParams) {
    const fieldModels = this.fieldModels
    fieldModels
      .filter(fieldModel => fieldModel.fieldDef.type === FieldClass.FormulaField)
      .forEach(fieldModel => {
        ;(fieldModel as FormulaFieldModel).handleEntryValueChange(params)
      })
  }

  updateDynamicAttrs(formValues: Record<string, any>) {
    this.fieldModels.forEach(fieldModel => {
      const { apiCode } = fieldModel.fieldDef
      if (!isNil(formValues[apiCode])) {
        fieldModel.updateDynamicAttrs(formValues[apiCode])
      }
    })
  }

  deSelectFormValues(formValues: Record<string, any>) {
    return this.fieldModels
      .filter(fieldModel => fieldModel.visibility)
      .reduce(
        (result, fieldModel) => ({
          ...result,
          ...fieldModel.fieldValueDeSelector(formValues[fieldModel.fieldDef.apiCode]),
        }),
        {}
      )
  }

  validateFormValues(formValues: Record<string, any>) {
    return this.fieldModels.reduce(
      (result, fieldModel) => ({
        ...result,
        ...{ [fieldModel.fieldDef.apiCode]: fieldModel.validateFieldValue(formValues[fieldModel.fieldDef.apiCode]) },
      }),
      {}
    )
  }
}

export default FormModel

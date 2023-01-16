import React from 'react'

import FieldViewManager, { MissingView } from '@packages/miscellaneous/FieldViewManager'
import { FieldClass } from 'typings/domain'

import type { FieldViewProps } from '../types'

const TextFieldDefaultView: React.FC<FieldViewProps> = () => <div>Default View</div>

const fieldViewManager = new FieldViewManager()

beforeEach(() => {
  fieldViewManager.reset()
})

it('Can register FieldViews', () => {
  fieldViewManager.record('TextFieldDefaultView', TextFieldDefaultView)
  const view = fieldViewManager.resolve(FieldClass.TextField, 'DefaultView')
  expect(view).not.toBeUndefined()
})

it('should throw error when register FieldViews with invalid name', () => {
  const textFieldTooltipView: React.FC<FieldViewProps> = () => <div>Tooltip View</div>
  expect(() => fieldViewManager.record('textFieldTooltipView', textFieldTooltipView)).toThrow()
})

it('should throw error when register FieldViews overlap', () => {
  fieldViewManager.record('TextFieldDefaultView', TextFieldDefaultView)
  expect(() => fieldViewManager.record('TextFieldDefaultView', TextFieldDefaultView)).toThrow()
})

it('should use fallback view', () => {
  const DefaultView: React.FC<FieldViewProps> = () => <div>Default View</div>
  fieldViewManager.record('DefaultView', DefaultView)
  const view = fieldViewManager.resolve(FieldClass.TextField, 'DefaultView')
  expect(view).toBe(MissingView)
  const fallbackView = fieldViewManager.resolve(FieldClass.TextField, 'DefaultView', { fallback: true })
  expect(fallbackView).not.toBeUndefined()
})

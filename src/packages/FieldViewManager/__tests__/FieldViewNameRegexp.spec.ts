import { VIEW_TOKEN_REGEXP } from '../types'

it('View Token Regexp Testing', () => {
  expect(VIEW_TOKEN_REGEXP.test('DetailView')).toBe(true)
  expect(VIEW_TOKEN_REGEXP.test('FieldDetailView')).toBe(true)
  expect(VIEW_TOKEN_REGEXP.test('fieldDetailView')).toBe(false)
  expect(VIEW_TOKEN_REGEXP.test('TextFieldDetailView')).toBe(true)
  expect(VIEW_TOKEN_REGEXP.test('v')).toBe(false)
  expect(VIEW_TOKEN_REGEXP.test('FieldView')).toBe(true)
  expect(VIEW_TOKEN_REGEXP.test('DetailFieldVie')).toBe(false)
  expect(VIEW_TOKEN_REGEXP.test('textFieldDetailView')).toBe(false)
})

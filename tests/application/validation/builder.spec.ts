import { Required, RequiredNumber, RequiredString, ValidationBuilder } from '@/application/validation'

describe('ValidationBuilder', () => {
  it('should return RequiredString', () => {
    const validators = ValidationBuilder
      .of({ fieldValue: 'any_value' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString('any_value')])
  })
  it('should return Required', () => {
    const validators = ValidationBuilder
      .of({ fieldValue: { any_value: 'any_value' } })
      .required()
      .build()
    expect(validators).toEqual([new Required({ any_value: 'any_value' })])
  })
  it('should return RequiredNumber', () => {
    const validators = ValidationBuilder
      .of({ fieldValue: 2 })
      .required()
      .build()
    expect(validators).toEqual([new RequiredNumber(2)])
  })
})

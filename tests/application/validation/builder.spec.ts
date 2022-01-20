import { Required, MaxFileSize, RequiredBuffer, RequiredNumber, RequiredString, ValidationBuilder, Email } from '@/application/validation'

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
  it('should return RequiredBuffer', () => {
    const buffer = Buffer.from(new ArrayBuffer(1))
    const validators = ValidationBuilder
      .of({ fieldValue: { buffer } })
      .required()
      .build()
    expect(validators).toEqual([new RequiredBuffer(buffer)])
  })
  it('should return Email', () => {
    const validators = ValidationBuilder
      .of({ fieldValue: 'any_email@gmail.com' })
      .email()
      .build()
    expect(validators).toEqual([new Email('any_email@gmail.com')])
  })
  it('should return MaxFileSize', () => {
    const file = Buffer.from(new ArrayBuffer(1 * 1024 * 1024))
    const validators = ValidationBuilder
      .of({ fieldValue: { buffer: file } })
      .image({ maxSizeInMb: 1 })
      .build()
    expect(validators).toEqual([new MaxFileSize(1, file)])
  })
})

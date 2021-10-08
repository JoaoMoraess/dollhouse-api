import { Required, RequiredString } from '@/application/validation'
import { RequiredFieldError } from '@/application/errors/validation'

describe('Required', () => {
  it('should return RequiredFieldError if field is undefined', () => {
    const sut = new Required(undefined as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })
  it('should return RequiredFieldError if field is null', () => {
    const sut = new Required(null as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })
  it('should return undefined if field is not empty', () => {
    const sut = new Required('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
describe('RequiredString', () => {
  it('should extend Required', () => {
    const sut = new RequiredString('')

    expect(sut).toBeInstanceOf(Required)
  })

  it('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredString('' as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return undefined if value is not empty', () => {
    const sut = new RequiredString('any_value' as any, 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})

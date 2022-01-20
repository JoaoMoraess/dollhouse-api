import { Required, RequiredBuffer, RequiredNumber, RequiredString } from '@/application/validation'
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
describe('RequiredNumber', () => {
  it('should extend Required', () => {
    const sut = new RequiredNumber(1)

    expect(sut).toBeInstanceOf(Required)
  })

  it('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredNumber('' as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return undefined if value is not empty', () => {
    const sut = new RequiredNumber(1, 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})

describe('RequiredBuffer', () => {
  it('should extend Required', () => {
    const buffer = Buffer.from(new ArrayBuffer(1))
    const sut = new RequiredBuffer(buffer)

    expect(sut).toBeInstanceOf(Required)
  })

  it('should return RequiredFieldError if value is empty', () => {
    const emptyBuffer = Buffer.from(new ArrayBuffer(0))
    const sut = new RequiredBuffer(emptyBuffer, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return undefined if value is not empty', () => {
    const buffer = Buffer.from(new ArrayBuffer(1))
    const sut = new RequiredBuffer(buffer, 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})

import { Validator } from '@/application/validation'
import { RequiredFieldError } from '@/application/errors/validation'

class Required implements Validator {
  constructor (
    readonly fieldValue: any,
    readonly fieldName?: string
  ) {}

  validate (): Error | undefined {
    if (this.fieldValue === undefined || this.fieldValue === null) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}

class RequiredString extends Required {
  constructor (
    override readonly fieldValue: string,
    override readonly fieldName?: string
  ) {
    super(fieldValue, fieldName)
  }

  override validate (): Error | undefined {
    if (super.validate() !== undefined || this.fieldValue === '') {
      return new RequiredFieldError(this.fieldName)
    }
  }
}

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

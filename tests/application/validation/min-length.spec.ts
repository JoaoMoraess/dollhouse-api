import { Validator } from '@/application/validation'
import { InvalidFieldError } from '@/application/errors/validation'

export class MinLength implements Validator {
  constructor (
    readonly fieldValue: number,
    readonly minFieldValue: number,
    readonly fieldName?: string
  ) {}

  validate (): Error | undefined {
    if (this.fieldValue < this.minFieldValue) {
      return new InvalidFieldError(this.fieldName)
    }
  }
}

describe('MinLenght', () => {
  it('should return RequiredFieldError if value is invalid', () => {
    const sut = new MinLength(8, 9, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new InvalidFieldError('any_field'))
  })

  it('should return undefined value is okay', () => {
    const sut = new MinLength(10, 10, 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()

    const sut2 = new MinLength(15, 10, 'any_field')

    const error2 = sut2.validate()

    expect(error2).toBeUndefined()
  })
})

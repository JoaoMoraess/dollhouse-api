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
})

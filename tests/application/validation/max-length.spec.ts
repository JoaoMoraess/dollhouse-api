import { Validator } from '@/application/validation'

class InvalidFieldError extends Error {
  constructor (field?: string) {
    const message = field === undefined
      ? 'Field invalid!'
      : `The field ${field} is invalid!`
    super(message)
    this.name = 'InvalidFieldError'
  }
}

export class MaxLength implements Validator {
  constructor (
    readonly fieldValue: number,
    readonly maxFieldValue: number,
    readonly fieldName?: string
  ) {}

  validate (): Error | undefined {
    if (this.fieldValue > this.maxFieldValue) {
      return new InvalidFieldError(this.fieldName)
    }
  }
}

describe('MaxLenght', () => {
  it('should return RequiredFieldError if value is empty', () => {
    const sut = new MaxLength(10, 9, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new InvalidFieldError('any_field'))
  })
})

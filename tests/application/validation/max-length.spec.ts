import { InvalidFieldError } from '@/application/errors/validation'
import { MaxLength } from '@/application/validation'

describe('MaxLenght', () => {
  it('should return RequiredFieldError if value is invalid', () => {
    const sut = new MaxLength(10, 9, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new InvalidFieldError('any_field'))
  })

  it('should return undefined value is okay', () => {
    const sut = new MaxLength(10, 10, 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})

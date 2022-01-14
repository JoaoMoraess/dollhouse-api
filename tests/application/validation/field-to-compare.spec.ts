import { FieldToCompare } from '@/application/validation'
import { InvalidFieldError } from '@/application/errors/validation'

describe('FieldToCompare', () => {
  it('should return a error if fields is not equal', () => {
    const sut = new FieldToCompare('any_field', 'other_field', 'field')

    const error = sut.validate()
    expect(error).toEqual(new InvalidFieldError('field'))
  })

  it('should not return a error if field is valid', () => {
    const sut = new FieldToCompare('any_field', 'any_field', 'field')

    const error = sut.validate()
    expect(error).toBeUndefined()
  })
})

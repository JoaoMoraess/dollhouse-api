import { InvalidFieldError } from '@/application/errors/validation'
import { Email } from '@/application/validation'

describe('RequiredString', () => {
  it('should return a error if field is invalid', () => {
    const sut = new Email('invalid_email', 'email')

    const error = sut.validate()
    expect(error).toEqual(new InvalidFieldError('email'))
  })
  it('should not return a error if field is valid', () => {
    const sut = new Email('valid_email@gmail.com', 'email')

    const error = sut.validate()
    expect(error).toBeUndefined()
  })
})

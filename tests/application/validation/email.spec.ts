import { Validator } from '.'
import { InvalidFieldError } from '@/application/errors/validation'

export class Email implements Validator {
  private readonly emailReg: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  constructor (
    readonly fieldValue: string,
    readonly fieldName?: string
  ) {}

  validate (): Error | undefined {
    const isValid = this.emailReg.test(this.fieldValue.toLowerCase())

    if (!isValid) {
      return new InvalidFieldError(this.fieldName)
    }
  }
}

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

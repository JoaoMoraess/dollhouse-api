import { InvalidFieldError } from '@/application/errors/validation'
import { Validator } from '.'

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

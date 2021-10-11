import { Validator } from '.'
import { InvalidFieldError } from '@/application/errors/validation'

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

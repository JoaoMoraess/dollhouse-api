import { Validator } from '.'
import { InvalidFieldError } from '@/application/errors/validation'

export class FieldToCompare implements Validator {
  constructor (
    readonly fieldValue: string,
    readonly fieldToCompare: string,
    readonly fieldName?: string
  ) {}

  validate (): Error | undefined {
    const isValid = (this.fieldValue === this.fieldToCompare)

    if (!isValid) {
      return new InvalidFieldError(this.fieldName)
    }
  }
}

import { RequiredNumber, Validator } from '@/application/validation'
import { InvalidFieldError } from '@/application/errors/validation'

export class NumberLength extends RequiredNumber implements Validator {
  constructor (
    override readonly fieldValue: number,
    readonly is: 'max' | 'min',
    readonly matchValue: number,
    override readonly fieldName?: string
  ) {
    super(fieldValue, fieldName)
  }

  override validate (): Error | undefined {
    if (super.validate() !== undefined) {
      return new InvalidFieldError(this.fieldName)
    }
    return this[this.is]()
  }

  max (): Error | undefined {
    if (this.fieldValue > this.matchValue) {
      return new InvalidFieldError(this.fieldName)
    }
  }

  min (): Error | undefined {
    if (this.fieldValue < this.matchValue) {
      return new InvalidFieldError(this.fieldName)
    }
  }
}

import { Validator } from '.'
import { RequiredFieldError } from '@/application/errors/validation'

export class Required implements Validator {
  constructor (
    readonly fieldValue: any,
    readonly fieldName?: string
  ) {}

  validate (): Error | undefined {
    if (this.fieldValue === undefined || this.fieldValue === null) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}

export class RequiredString extends Required {
  constructor (
    override readonly fieldValue: string,
    override readonly fieldName?: string
  ) {
    super(fieldValue, fieldName)
  }

  override validate (): Error | undefined {
    if (super.validate() !== undefined || this.fieldValue === '') {
      return new RequiredFieldError(this.fieldName)
    }
  }
}

export class RequiredNumber extends Required {
  constructor (
    override readonly fieldValue: number,
    override readonly fieldName?: string
  ) {
    super(fieldValue, fieldName)
  }

  override validate (): Error | undefined {
    if (super.validate() !== undefined || typeof this.fieldValue !== 'number') {
      return new RequiredFieldError(this.fieldName)
    }
  }
}

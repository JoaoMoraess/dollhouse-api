import { Required, RequiredString, Validator } from '@/application/validation'

class ValidationBuilder {
  private constructor (
    private readonly fieldValue: any,
    private readonly fieldName?: string,
    private readonly validators: Validator[] = []
  ) {}

  static of ({ fieldValue, fieldName }: {fieldValue: any, fieldName?: string}): ValidationBuilder {
    return new ValidationBuilder(fieldValue, fieldName)
  }

  required (): ValidationBuilder {
    if (typeof this.fieldValue === 'string') {
      this.validators.push(new RequiredString(this.fieldValue, this.fieldName))
    } else {
      this.validators.push(new Required(this.fieldValue, this.fieldName))
    }
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}

describe('ValidationBuilder', () => {
  it('should return RequiredString', () => {
    const validators = ValidationBuilder
      .of({ fieldValue: 'any_value' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString('any_value')])
  })
  it('should return Required', () => {
    const validators = ValidationBuilder
      .of({ fieldValue: { any_value: 'any_value' } })
      .required()
      .build()
    expect(validators).toEqual([new Required({ any_value: 'any_value' })])
  })
})

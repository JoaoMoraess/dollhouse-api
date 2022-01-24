import { AllowedMimeTypes, Email, Extension, FieldToCompare, MaxFileSize, NumberLength, Required, RequiredBuffer, RequiredNumber, RequiredString, Validator } from '@/application/validation'

export class ValidationBuilder {
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
    } else if (typeof this.fieldValue === 'number') {
      this.validators.push(new RequiredNumber(this.fieldValue, this.fieldName))
    } else {
      if (this.fieldValue.buffer !== undefined) {
        this.validators.push(new RequiredBuffer(this.fieldValue.buffer, this.fieldName))
      } else {
        this.validators.push(new Required(this.fieldValue, this.fieldName))
      }
    }
    return this
  }

  minNumber (min: number): ValidationBuilder {
    this.validators.push(new NumberLength(this.fieldValue, 'min', min, this.fieldName))
    return this
  }

  maxNumber (max: number): ValidationBuilder {
    this.validators.push(new NumberLength(this.fieldValue, 'max', max, this.fieldName))
    return this
  }

  email (): ValidationBuilder {
    this.validators.push(new Email(this.fieldValue, this.fieldName))
    return this
  }

  compare (field: string): ValidationBuilder {
    this.validators.push(new FieldToCompare(this.fieldValue, field, this.fieldName))
    return this
  }

  image ({ maxSizeInMb, allowed }: {maxSizeInMb: number, allowed: Extension[]}): ValidationBuilder {
    if (this.fieldValue.buffer !== undefined) {
      this.validators.push(new MaxFileSize(maxSizeInMb, this.fieldValue.buffer))
    }
    if (this.fieldValue.mimeType !== undefined) {
      this.validators.push(new AllowedMimeTypes(allowed, this.fieldValue.mimeType))
    }
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}

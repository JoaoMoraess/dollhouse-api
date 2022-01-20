import { AllowedMimeTypes } from '@/application/validation'
import { InvalidMimeTypeError } from '@/application/errors'

describe('AllowedMimeTypes', () => {
  it('should return InvalidMimeTypeError if type is invalid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/png')

    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['jpg']))
  })

  it('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/png')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
  it('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpg')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpeg')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})

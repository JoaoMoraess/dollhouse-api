import { InvalidFieldError } from '@/application/errors/validation'
import { NumberLength } from '@/application/validation'

describe('NumberLenght', () => {
  describe('Min()', () => {
    it('should return a error if field is invalid', () => {
      const sut = new NumberLength(3, 'min', 4, 'any_field')

      const error = sut.validate()
      expect(error).toEqual(new InvalidFieldError('any_field'))
    })
    it('should not return a error if field is valid', () => {
      const sut = new NumberLength(3, 'min', 3, 'any_field')

      const error = sut.validate()
      expect(error).toBeUndefined()

      const sut2 = new NumberLength(20, 'min', 3, 'any_field')

      const error2 = sut2.validate()
      expect(error2).toBeUndefined()
    })
  })
  describe('Max()', () => {
    it('should return a error if field is invalid', () => {
      const sut = new NumberLength(5, 'max', 4, 'any_field')

      const error = sut.validate()
      expect(error).toEqual(new InvalidFieldError('any_field'))
    })
    it('should not return a error if field is valid', () => {
      const sut = new NumberLength(3, 'max', 3, 'any_field')

      const error = sut.validate()
      expect(error).toBeUndefined()

      const sut2 = new NumberLength(7, 'max', 10, 'any_field')

      const error2 = sut2.validate()
      expect(error2).toBeUndefined()
    })
  })
})

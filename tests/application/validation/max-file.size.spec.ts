import { MaxFileSize } from '@/application/validation'
import { MaxFileSizeError } from '@/application/errors'

describe('MaxFileSize', () => {
  it('should return MaxFileSizeError if value is invalid', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(9 * 1024 * 1024))
    const sut = new MaxFileSize(4, invalidBuffer)

    const error = sut.validate()

    expect(error).toEqual(new MaxFileSizeError(4))
  })
  it('should return undefined if value is valid', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(3 * 1024 * 1024))
    const sut = new MaxFileSize(4, invalidBuffer)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
  it('should return undefined if value is valid', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(4 * 1024 * 1024))
    const sut = new MaxFileSize(4, invalidBuffer)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})

import { Validator } from '@/application/validation'

class MaxFileSize implements Validator {
  constructor (
    private readonly maxSizeInMb: number,
    private readonly file: Buffer
  ) {}

  validate (): Error | undefined {
    const maxSizeInBytes = (this.maxSizeInMb * 1024 * 1024)
    if (this.file.length > maxSizeInBytes) return new Error('MaxFileSizeError')
  }
}

describe('MaxFileSize', () => {
  it('should return MaxFileSizeError if value is invalid', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(9 * 1024 * 1024))
    const sut = new MaxFileSize(4, invalidBuffer)

    const error = sut.validate()

    expect(error).toEqual(new Error('MaxFileSizeError'))
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

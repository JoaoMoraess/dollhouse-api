import bcrypt from 'bcrypt'
import { BcryptAdapter } from '@/infra/gateways'

jest.mock('bcrypt')

describe('BcryptAdapter', () => {
  let sut: BcryptAdapter
  let fakeBcrypt: jest.Mocked<typeof bcrypt>
  let plainText: string
  let digest: string

  beforeEach(() => {
    fakeBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
    fakeBcrypt.compare.mockImplementation(() => true)
    plainText = 'any_string'
    digest = 'any_encrypted_string'
    sut = new BcryptAdapter()
  })

  it('should call bcrypt.compare with correct input', async () => {
    await sut.compare({ plainText, digest })

    expect(fakeBcrypt.compare).toHaveBeenCalledWith(plainText, digest)
    expect(fakeBcrypt.compare).toHaveBeenCalledTimes(1)
  })
  test('Should return true when compare succeeds', async () => {
    const isValid = await sut.compare({ plainText, digest })
    expect(isValid).toBe(true)
  })

  test('Should return false when compare fails', async () => {
    fakeBcrypt.compare.mockImplementationOnce(() => false)
    const isValid = await sut.compare({ plainText, digest })
    expect(isValid).toBe(false)
  })

  test('Should throw if compare throws', async () => {
    fakeBcrypt.compare.mockImplementationOnce(() => { throw new Error('bcrypt_error') })
    const promise = sut.compare({ plainText, digest })
    await expect(promise).rejects.toThrow(new Error('bcrypt_error'))
  })
})

import bcrypt from 'bcrypt'
import { BcryptAdapter } from '@/infra/gateways'

jest.mock('bcrypt')

describe('BcryptAdapter', () => {
  let sut: BcryptAdapter
  let fakeBcrypt: jest.Mocked<typeof bcrypt>
  let plainText: string
  let digest: string
  let salt: number

  beforeAll(() => {
    salt = 12
    fakeBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
    fakeBcrypt.compare.mockImplementation(() => true)
    fakeBcrypt.hash.mockImplementation(() => 'hashed_string')
  })

  beforeEach(() => {
    plainText = 'any_string'
    digest = 'any_encrypted_string'
    sut = new BcryptAdapter(salt)
  })

  describe('hash()', () => {
    it('should call bcrypt.hash with correct input', async () => {
      await sut.hash({ plainText: 'any_value' })

      expect(fakeBcrypt.hash).toHaveBeenCalledWith('any_value', salt)
      expect(fakeBcrypt.hash).toHaveBeenCalledTimes(1)
    })
    it('should return the correct hash on success', async () => {
      const hash = await sut.hash({ plainText: 'any_value' })

      expect(hash).toEqual('hashed_string')
    })
  })

  describe('compare()', () => {
    it('should call bcrypt.compare with correct input', async () => {
      await sut.compare({ plainText, digest })

      expect(fakeBcrypt.compare).toHaveBeenCalledWith(plainText, digest)
      expect(fakeBcrypt.compare).toHaveBeenCalledTimes(1)
    })
    it('Should return true when compare succeeds', async () => {
      const isValid = await sut.compare({ plainText, digest })
      expect(isValid).toBe(true)
    })

    it('Should return false when compare fails', async () => {
      fakeBcrypt.compare.mockImplementationOnce(() => false)
      const isValid = await sut.compare({ plainText, digest })
      expect(isValid).toBe(false)
    })

    it('Should throw if compare throws', async () => {
      fakeBcrypt.compare.mockImplementationOnce(() => { throw new Error('bcrypt_error') })
      const promise = sut.compare({ plainText, digest })
      await expect(promise).rejects.toThrow(new Error('bcrypt_error'))
    })
  })
})

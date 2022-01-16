import jwt from 'jsonwebtoken'
import { JWTHandler } from '@/infra/gateways'

jest.mock('jsonwebtoken')

describe('JWTHandler', () => {
  let sut: JWTHandler
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JWTHandler(secret)
  })
  describe('generate()', () => {
    let token: string
    let expirationInMs: number
    let key: string

    beforeAll(() => {
      token = 'any_token'
      expirationInMs = 1000
      key = 'any_key'
      fakeJwt.sign.mockImplementation(() => token)
    })

    it('should call jwt.sign with correct input', () => {
      sut.generate({ expirationInMs, key })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: expirationInMs / 1000 })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    it('should return a token', () => {
      const generatedToken = sut.generate({ key, expirationInMs })

      expect(generatedToken).toBe(token)
    })
  })
  describe('validate()', () => {
    let token: string
    let key: string

    beforeAll(() => {
      token = 'any_token'
      key = 'any_key'
      fakeJwt.verify.mockImplementation(() => ({ key }))
    })

    it('should call verify with correct input', async () => {
      await sut.validate({ token })

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret)
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
    })

    it('should return the key used to verify', async () => {
      const generatedKey = await sut.validate({ token })

      expect(generatedKey).toBe(key)
    })

    it('should rethrow if verify throws', async () => {
      fakeJwt.verify.mockImplementationOnce(() => { throw new Error('key_error') })

      const promise = sut.validate({ token })

      await expect(promise).rejects.toThrow(new Error('key_error'))
    })

    it('should throw if verify returns null', async () => {
      fakeJwt.verify.mockImplementationOnce(() => null)

      const promise = sut.validate({ token })

      await expect(promise).rejects.toThrow()
    })
  })
})

import jwt from 'jsonwebtoken'
import { JWTHandler } from '@/infra/gateways'
import { UserRole } from '@/domain/entities'

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
    let userRole: UserRole
    let key: string

    beforeAll(() => {
      userRole = 'customer'
      token = 'any_token'
      expirationInMs = 1000
      key = 'any_key'
      fakeJwt.sign.mockImplementation(() => token)
    })

    it('should call jwt.sign with correct input', async () => {
      await sut.generate({ expirationInMs, userRole, key })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key, userRole }, secret, { expiresIn: expirationInMs / 1000 })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    it('should return a token', async () => {
      const generatedToken = await sut.generate({ key, userRole, expirationInMs })

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
  })
})

import { TokenGenerator } from '@/domain/contracts/gateways'
import jwt from 'jsonwebtoken'
class JWTHandler implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  generate ({ key, expirationInMs }: TokenGenerator.Input): string {
    const expiresInSeconds = expirationInMs / 1000
    const token = jwt.sign({ key }, this.secret, { expiresIn: expiresInSeconds })
    return token
  }
}
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
})

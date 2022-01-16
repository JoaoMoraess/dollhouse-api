/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { TokenGenerator, TokenValidator } from '@/domain/contracts/gateways'
import jwt, { JwtPayload } from 'jsonwebtoken'

export class JWTHandler implements TokenGenerator, TokenValidator {
  constructor (
    private readonly secret: string
  ) {}

  async generate ({ key, userRole, expirationInMs }: TokenGenerator.Input): Promise<TokenGenerator.Output> {
    const expiresInSeconds = expirationInMs / 1000
    const token = await jwt.sign({ key, userRole }, this.secret, { expiresIn: expiresInSeconds })
    return token
  }

  async validate ({ token }: TokenValidator.Input): Promise<TokenValidator.Output> {
    const payload = await jwt.verify(token, this.secret) as JwtPayload
    return payload.key
  }
}

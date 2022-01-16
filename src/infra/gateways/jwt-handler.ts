import { TokenGenerator, TokenValidator } from '@/domain/contracts/gateways'
import jwt from 'jsonwebtoken'

export class JWTHandler implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  generate ({ key, expirationInMs }: TokenGenerator.Input): string {
    const expiresInSeconds = expirationInMs / 1000
    const token = jwt.sign({ key }, this.secret, { expiresIn: expiresInSeconds })
    return token
  }

  async validate ({ token }: TokenValidator.Input): Promise<TokenValidator.Output> {
    jwt.verify(token, this.secret)
    return ''
  }
}

import { AuthenticationMiddleware } from '@/application/middlewares'
import { makeJWTHandler } from '@/main/factories/infra/gateway'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwt = makeJWTHandler()
  return new AuthenticationMiddleware(jwt.validate.bind(jwt))
}

import { AuthenticationMiddleware } from '@/application/middlewares'
import { UserRole } from '@/domain/entities'
import { makeJWTHandler } from '@/main/factories/infra/gateway'

export const makeAuthenticationMiddleware = (role?: UserRole): AuthenticationMiddleware => {
  const jwt = makeJWTHandler()
  return new AuthenticationMiddleware(jwt.validate.bind(jwt), role)
}

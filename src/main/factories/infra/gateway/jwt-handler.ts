import { JWTHandler } from '@/infra/gateways'
import { env } from '@/main/config/env'

export const makeJWTHandler = (): JWTHandler => {
  return new JWTHandler(env.secret)
}

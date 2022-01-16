import { adaptExpressMiddleware } from '@/main/adapters'
import { makeAuthenticationMiddleware } from '@/main/factories/application/middlewares'

export const adminAuth = adaptExpressMiddleware(makeAuthenticationMiddleware('admin'))

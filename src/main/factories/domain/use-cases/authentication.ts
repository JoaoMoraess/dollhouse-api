import { Authentication, setupAuthentication } from '@/domain/use-cases'
import { makePgUserRepo } from '@/main/factories/infra/repos/postgres'
import { makeBcryptAdapter, makeJWTHandler } from '@/main/factories/infra/gateway'

export const makeAuthentication = (): Authentication => {
  return setupAuthentication(makePgUserRepo(), makeBcryptAdapter(), makeJWTHandler())
}

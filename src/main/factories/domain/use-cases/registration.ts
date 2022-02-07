import { Registration, setupRegistration } from '@/domain/use-cases'
import { makePgUserRepo } from '@/main/factories/infra/repos/postgres'
import { makeBcryptAdapter, makeJWTHandler } from '@/main/factories/infra/gateway'

export const makeRegistration = (): Registration => {
  return setupRegistration(makePgUserRepo(), makeBcryptAdapter(), makeJWTHandler())
}

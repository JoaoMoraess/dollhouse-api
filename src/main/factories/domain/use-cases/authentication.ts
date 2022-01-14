import { Authentication, setAuthentication } from '@/domain/use-cases'
import { makePgUserRepo } from '@/main/factories/infra/repos/postgres'
import { makeHashComparer, makeJWTHandler } from '@/main/factories/infra/gateway'

export const makeAuthentication = (): Authentication => {
  return setAuthentication(makePgUserRepo(), makeHashComparer(), makeJWTHandler())
}
